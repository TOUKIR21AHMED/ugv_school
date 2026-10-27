import mongoose from 'mongoose'
const schema=new mongoose.Schema({title:{type:String,required:true,trim:true,maxlength:180},description:{type:String,default:'',maxlength:3000},category:{type:String,enum:['সাধারণ','পরীক্ষা','ভর্তি','একাডেমিক','অন্যান্য'],default:'সাধারণ'},published:{type:Boolean,default:false}},{timestamps:true})
export default mongoose.model('Notice',schema)
