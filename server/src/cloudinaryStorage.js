import {v2 as cloudinary} from 'cloudinary'
import path from 'node:path'

const keys=['CLOUDINARY_CLOUD_NAME','CLOUDINARY_API_KEY','CLOUDINARY_API_SECRET']
for(const key of keys)if(!process.env[key])throw new Error(`Missing ${key}`)
cloudinary.config({cloud_name:process.env.CLOUDINARY_CLOUD_NAME,api_key:process.env.CLOUDINARY_API_KEY,api_secret:process.env.CLOUDINARY_API_SECRET,secure:true})
const folder='united-school'
const ext=(name)=>path.extname(name).toLowerCase()
export function imageLooksValid(b,mime){
 if(!b)return false
 const pdf=b.subarray(0,5).toString()==='%PDF-'
 const jpg=b[0]===255&&b[1]===216&&b[2]===255
 const png=b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))
 const webp=b.toString('ascii',0,4)==='RIFF'&&b.toString('ascii',8,12)==='WEBP'
 return ({'application/pdf':pdf,'image/jpeg':jpg,'image/png':png,'image/webp':webp})[mime]===true
}
export function cloudResource(filename){
 const extension=ext(filename)
 if(!/^(hero|school)-[a-zA-Z0-9._-]+$/.test(filename)||!['.png','.jpg','.jpeg','.webp','.pdf'].includes(extension))return null
 const pdf=extension==='.pdf'
 return {resource_type:pdf?'raw':'image',public_id:`${folder}/${pdf?filename:filename.slice(0,-extension.length)}`}
}
export function uploadBuffer(buffer,filename){
 const r=cloudResource(filename)
 if(!r)throw new Error('Invalid uploaded filename')
 return new Promise((resolve,reject)=>{
  const stream=cloudinary.uploader.upload_stream({...r,overwrite:false,unique_filename:false},(err,result)=>err?reject(err):resolve(result))
  stream.end(buffer)
 })
}
export function sendStoredFile(req,res){
 const filename=req.params.filename
 const r=cloudResource(filename)
 if(!r)return res.status(404).json({message:'File not found'})
 const url=cloudinary.url(r.public_id,{resource_type:r.resource_type,secure:true,format:r.resource_type==='image'?ext(filename).slice(1):undefined})
 res.set('Cache-Control','public, max-age=300')
 return res.redirect(302,url)
}
export {cloudinary}
