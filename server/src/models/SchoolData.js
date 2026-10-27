import mongoose from 'mongoose'
const {Schema}=mongoose
const documentSchema=new Schema({type:{type:String,required:true,enum:['syllabus','class-routine','exam-routine','internal-result','board-result','admission-form','notice']},title:{type:String,required:true,maxlength:180},grade:{type:String,default:''},group:{type:String,default:''},term:{type:String,default:''},board:{type:String,default:''},description:{type:String,default:''},fileUrl:{type:String,required:true},published:{type:Boolean,default:true}},{timestamps:true})
documentSchema.index({type:1,grade:1,group:1,term:1,board:1})
export const SchoolDocument=mongoose.model('SchoolDocument',documentSchema)
const staffSchema=new Schema({name:{type:String,required:true},designation:{type:String,required:true},subject:String,phone:String,photoUrl:String,type:{type:String,enum:['teacher','officer'],required:true},order:{type:Number,default:0},published:{type:Boolean,default:true}},{timestamps:true})
export const Staff=mongoose.model('Staff',staffSchema)
const contentSchema=new Schema({key:{type:String,required:true,unique:true},text:{type:String,default:''},title:{type:String,default:''},photoUrl:{type:String,default:''}},{timestamps:true})
export const SchoolContent=mongoose.model('SchoolContent',contentSchema)
const gallerySchema=new Schema({title:{type:String,required:true},imageUrl:{type:String,required:true},published:{type:Boolean,default:true}},{timestamps:true})
export const Gallery=mongoose.model('SchoolGallery',gallerySchema)
const admissionSchema=new Schema({studentName:{type:String,required:true},dob:{type:String,required:true},birthRegNo:{type:String,required:true},gender:{type:String,required:true},religion:{type:String,required:true},nationality:{type:String,required:true},fatherName:{type:String,required:true},fatherNid:String,motherName:{type:String,required:true},motherNid:String,guardianName:String,guardianNid:String,presentAddress:{type:String,required:true},permanentAddress:{type:String,required:true},mobile:{type:String,required:true},grade:{type:String,required:true},group:String,photoUrl:{type:String,required:true},status:{type:String,enum:['new','under-review','accepted','rejected'],default:'new'},isRead:{type:Boolean,default:false}},{timestamps:true})
export const Admission=mongoose.model('SchoolAdmission',admissionSchema)
