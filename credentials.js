const mongoose=require('mongoose');

let credentialSchema=new mongoose.Schema({
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
    }
})

credentialSchema.pre('save',function(next){
    if(this.email!=null){
        console.log('email introducido correctamente');
        console.log(this);
        next();
    }else{
        console.log('el campo "email" es obligatorio');
    }

})


module.exports=mongoose.model('Credentials',credentialSchema,'credentials')