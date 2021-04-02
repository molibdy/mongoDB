const mongoose=require('mongoose');
const Photo =require('./photo')

let userSchema=new mongoose.Schema({
    userName:{
        type: String,
        validate:[
            function(userName){
                return userName==userName.toLowerCase();
            },
            'userName name debe estar en minusculas'
        ]
    },
    password:{
        type:String,
        validate:[
            function(password){
                return password.length>6 && password!=password.toLowerCase();
            },
            'Password debe ser mayor de 6 caracteres y contener al menos una mayuscula'
        ]
    },
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
    },
    address:{
        type: String
    },
    phone:{
        type:Number,
        validate:[
            function(phone){
                return String(phone).length==9;
            },
            'phone debe tener 9 dígitos'
        ]
    },
    email:{
        type:String,
        validate:[
            function(email){
                return email.includes('@') && email.includes('.');
            },
            'el email debe contener "@" y "."'
        ]
    },
  
    follow:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    
    photos:[{type:mongoose.Schema.Types.ObjectId,ref:'Photo'}]
    
})



userSchema.pre('save',function(next){
    if(this.dateOfBirth<new Date(1910,1,1)){
        if (this.comments){
            this.comments+=' Es usted un poco mayor';
        }else{
            this.comments='Es usted un poco mayor';
        }
    }
    if(this.password.toLowerCase()!=this.userName.toLowerCase()){
        console.log('la contraseña es segura');
        next();
    }else{
        console.log('La contraseña no puede ser igual al userName');
    }
})


module.exports=mongoose.model('User',userSchema,'users')