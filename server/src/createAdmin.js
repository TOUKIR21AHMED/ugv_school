import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import Admin from './models/Admin.js'
const email=process.env.ADMIN_EMAIL?.trim().toLowerCase(), password=process.env.ADMIN_PASSWORD, name=process.env.ADMIN_NAME||'School Administrator'
if(!email||!password||password.length<12||!process.env.MONGO_URI){console.error('Set MONGO_URI, ADMIN_EMAIL and ADMIN_PASSWORD (12+ characters) in server/.env');process.exit(1)}
try{
 await mongoose.connect(process.env.MONGO_URI)
 const existing=await Admin.findOne({email})
 if(existing)console.log('Admin account already exists; no changes made.')
 else{await Admin.create({email,name,passwordHash:await bcrypt.hash(password,12)});console.log('Admin account created for',email)}
}catch(e){console.error(e.message);process.exitCode=1}finally{await mongoose.disconnect()}
