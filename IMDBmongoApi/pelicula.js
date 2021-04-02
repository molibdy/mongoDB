
const mongoose=require('mongoose');
const Profesional=require('./profesional');

let movieSchema=new mongoose.Schema({
    title:String,
    releaseYear:Number,
    nationality:String,
    genre:String,
    director:[{type:mongoose.Schema.Types.ObjectId,ref:'Profesional'}],
    writer:[{type:mongoose.Schema.Types.ObjectId,ref:'Profesional'}],
    actor:[{type:mongoose.Schema.Types.ObjectId,ref:'Profesional'}],
    language:String,
    isMCU:Boolean,
    mainCharacterName:String,
    producer:String,
    distributor:String
})

module.exports=mongoose.model('Movie',movieSchema,'movies')