const mongoose=require('mongoose');



 

let profesionalSchema=new mongoose.Schema({
    name:String,
    age:Number,
    gender:String,
    weight:Number,
    height:Number,
    hairColor:String,
    eyeColor:String,
    isRetired:Boolean,
    nationality:String,
    oscarNumber:Number,
    profession:String
})



module.exports=mongoose.model('Profesional',profesionalSchema,'profesionales')