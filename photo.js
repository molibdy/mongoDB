
const mongoose=require('mongoose');

let photoSchema=new mongoose.Schema({
    userName:{
        type: String,
        validate:[
            function(userName){
                return userName==userName.toLowerCase();
            },
            'userName name debe estar en minusculas'
        ]
    },
    url:{
        type:String
    },
    title:{
        type:String
    },
    description:{
        type:String
    }
})




module.exports=mongoose.model('Photo',photoSchema,'photos')