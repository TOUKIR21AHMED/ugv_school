import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import multer from 'multer'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import Admin from './models/Admin.js'
import Notice from './models/Notice.js'
import SiteSettings from './models/SiteSettings.js'
import schoolRoutes from './schoolRoutes.js'

const required=['MONGO_URI','JWT_SECRET','CLIENT_ORIGIN']
for(const k of required)if(!process.env[k]){console.error(`Missing ${k} in server/.env`);process.exit(1)}
if(process.env.JWT_SECRET.length<32){console.error('JWT_SECRET must be at least 32 characters');process.exit(1)}
const app=express()
// Local image storage: works for local testing and persistent VPS disks.
const here=path.dirname(fileURLToPath(import.meta.url))
const uploadsDir=path.resolve(here,'../uploads')
fs.mkdirSync(uploadsDir,{recursive:true})
const allowedTypes=new Map([['image/jpeg','.jpg'],['image/png','.png'],['image/webp','.webp']])
const upload=multer({
 storage:multer.diskStorage({destination:uploadsDir,filename:(req,file,cb)=>cb(null,`hero-${Date.now()}-${Math.random().toString(36).slice(2,10)}${allowedTypes.get(file.mimetype)||'.tmp'}`)}),
 limits:{fileSize:5*1024*1024,files:1},
 fileFilter:(req,file,cb)=>allowedTypes.has(file.mimetype)?cb(null,true):cb(new Error('Only JPG, PNG and WebP images are accepted'))
})
app.use('/uploads',express.static(uploadsDir,{index:false,fallthrough:false,setHeaders:(res)=>res.setHeader('X-Content-Type-Options','nosniff')}))
app.use(helmet())
app.use(cors({origin:process.env.CLIENT_ORIGIN,credentials:true}))
app.use(express.json({limit:'32kb'}))
app.use(cookieParser())
app.use('/api/auth/login',rateLimit({windowMs:15*60*1000,limit:10,standardHeaders:'draft-7',legacyHeaders:false}))
const cookieOptions={httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/'}
function requireAuth(req,res,next){try{const token=req.cookies.school_token;if(!token)return res.status(401).json({message:'Login required'});const payload=jwt.verify(token,process.env.JWT_SECRET);req.adminId=payload.id;return next()}catch{return res.status(401).json({message:'Session expired'})}}
app.get('/api/health',(req,res)=>res.json({ok:true}))
app.post('/api/auth/login',async(req,res,next)=>{try{
 const email=typeof req.body.email==='string'?req.body.email.trim().toLowerCase():''
 const password=typeof req.body.password==='string'?req.body.password:''
 const admin=await Admin.findOne({email})
 if(!admin||!await bcrypt.compare(password,admin.passwordHash))return res.status(401).json({message:'Invalid email or password'})
 const token=jwt.sign({id:String(admin._id)},process.env.JWT_SECRET,{expiresIn:'8h'})
 res.cookie('school_token',token,{...cookieOptions,maxAge:8*60*60*1000})
 res.json({user:{id:admin.id,name:admin.name,email:admin.email}})
}catch(e){next(e)}})
app.get('/api/auth/me',requireAuth,async(req,res,next)=>{try{const admin=await Admin.findById(req.adminId).select('name email');if(!admin)return res.status(401).json({message:'Unauthorized'});res.json({user:{id:admin.id,name:admin.name,email:admin.email}})}catch(e){next(e)}})
app.post('/api/auth/logout',(req,res)=>{res.clearCookie('school_token',cookieOptions);res.json({ok:true})})
// Public settings; null means the bundled fallback hero will be used.
app.get('/api/site-settings',async(req,res,next)=>{try{
 const config=await SiteSettings.findOne({key:'main'}).lean()
 res.json({heroImage:config?.heroImage||null})
}catch(e){next(e)}})

// Protected image upload and settings update.
app.post('/api/admin/hero-image',requireAuth,(req,res,next)=>{
 upload.single('image')(req,res,async err=>{
  if(err){const status=err instanceof multer.MulterError?400:400;return res.status(status).json({message:err.message})}
  if(!req.file)return res.status(400).json({message:'Please select an image'})
  try{
   // Verify the actual file header rather than trusting MIME alone.
   const fd=fs.openSync(req.file.path,'r');const b=Buffer.alloc(12);fs.readSync(fd,b,0,12,0);fs.closeSync(fd)
   const isJpg=b[0]===0xff&&b[1]===0xd8&&b[2]===0xff
   const isPng=b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))
   const isWebp=b.toString('ascii',0,4)==='RIFF'&&b.toString('ascii',8,12)==='WEBP'
   const verified=(req.file.mimetype==='image/jpeg'&&isJpg)||(req.file.mimetype==='image/png'&&isPng)||(req.file.mimetype==='image/webp'&&isWebp)
   if(!verified){fs.unlinkSync(req.file.path);return res.status(400).json({message:'Invalid image file'})}
   const heroImage=`/uploads/${req.file.filename}`
   const old=await SiteSettings.findOneAndUpdate({key:'main'},{$set:{heroImage}},{upsert:true,new:false})
   if(old?.heroImage?.startsWith('/uploads/')){
    const oldName=path.basename(old.heroImage)
    if(oldName!==req.file.filename)fs.promises.unlink(path.join(uploadsDir,oldName)).catch(()=>{})
   }
   res.json({message:'Hero image updated',heroImage})
  }catch(e){fs.promises.unlink(req.file.path).catch(()=>{});next(e)}
 })
})

app.get('/api/notices',async(req,res,next)=>{try{const notices=await Notice.find({published:true}).sort({createdAt:-1}).limit(20).lean();res.json({notices})}catch(e){next(e)}})
app.get('/api/admin/notices',requireAuth,async(req,res,next)=>{try{res.json({notices:await Notice.find().sort({createdAt:-1}).limit(200).lean()})}catch(e){next(e)}})
const categories=['সাধারণ','পরীক্ষা','ভর্তি','একাডেমিক','অন্যান্য']
function validateNotice(body){const title=typeof body.title==='string'?body.title.trim():'';const description=typeof body.description==='string'?body.description.trim():'';const category=body.category||'সাধারণ';if(!title||title.length>180||description.length>3000||!categories.includes(category)||typeof body.published!=='boolean')return null;return {title,description,category,published:body.published}}
app.post('/api/admin/notices',requireAuth,async(req,res,next)=>{try{const data=validateNotice(req.body);if(!data)return res.status(400).json({message:'Invalid notice data'});const notice=await Notice.create(data);res.status(201).json({notice})}catch(e){next(e)}})
app.put('/api/admin/notices/:id',requireAuth,async(req,res,next)=>{try{if(!mongoose.isValidObjectId(req.params.id))return res.status(400).json({message:'Invalid ID'});const data=validateNotice(req.body);if(!data)return res.status(400).json({message:'Invalid notice data'});const notice=await Notice.findByIdAndUpdate(req.params.id,data,{new:true,runValidators:true});if(!notice)return res.status(404).json({message:'Notice not found'});res.json({notice})}catch(e){next(e)}})
app.delete('/api/admin/notices/:id',requireAuth,async(req,res,next)=>{try{if(!mongoose.isValidObjectId(req.params.id))return res.status(400).json({message:'Invalid ID'});const result=await Notice.findByIdAndDelete(req.params.id);if(!result)return res.status(404).json({message:'Notice not found'});res.json({ok:true})}catch(e){next(e)}})
app.use('/api/school',schoolRoutes({requireAuth,uploadsDir}))
app.use((err,req,res,next)=>{console.error(err);res.status(err.status||500).json({message:err.status===413?'Image too large (maximum 5 MB)':'Server error'})})
try{await mongoose.connect(process.env.MONGO_URI);const port=Number(process.env.PORT)||5000;app.listen(port,()=>console.log(`School API running at http://localhost:${port}`))}catch(e){console.error('MongoDB connection failed:',e.message);process.exit(1)}
