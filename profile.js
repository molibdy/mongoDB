const mongoose=require('mongoose');

let profileSchema=new mongoose.Schema({
    name:{
        type: String,
        validate:[
            function(name){
                return name[0]!=name[0].toLowerCase();
            },
            'Name debe empezar por mayúscula'
        ]
    },
    surname:{
        type:String,
        validate:[
            function(surname){
                return surname[0]!=surname[0].toLowerCase();
            },
            'Surname debe empezar por mayúscula'
        ]
    },
    dateOfBirth:{
        type:Date,
        max:new Date(2003,1,1)
    },
    comments:{type:String},

    role:{
        type:String,
        enum:['user','admin','Lord Ruler']
    }
})

profileSchema.pre('save',function(next){
    if(this.dateOfBirth<new Date(1910,1,1)){
        if (this.comments){
            this.comments+=' Es usted un poco mayor';
        }else{
            this.comments='Es usted un poco mayor';
        }
    }
    console.log(this);
    next();
})


module.exports=mongoose.model('Profile',profileSchema,'profiles')