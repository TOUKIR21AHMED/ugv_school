import mongoose from 'mongoose'
const schema=new mongoose.Schema({key:{type:String,required:true,unique:true,default:'main'},heroImage:{type:String,default:null}},{timestamps:true})
export default mongoose.model('SiteSettings',schema)
