const User = require('./user');
const Profile=require('./profile');
const Credentials=require('./credentials');
const mongoose=require('mongoose');

 mongoose.connect('mongodb://localhost:27017/usuarios',{
    useNewUrlParser:true,useUnifiedTopology:true
})


    let user1=new User({
        login:'molibdy',
        password:'patatas'
    })
    user1.save(checkAnswer);

    let user2=new User({
        login:'Molibdy',
        password:'patatas'
    })
    user2.save(checkAnswer);

    let user3=new User({
        login:'molibdy',
        password:'Patatas'
    })
    user3.save(checkAnswer);

    let user4=new User({
        login:'molibdy',
        password:'Patata'
    })
    user4.save(checkAnswer);

    let user5=new User({
        login:'molibdy',
        password:'Molibdy'
    })
    user5.save(checkAnswer);




    let profile1=new Profile({
        name:'Moli',
        surname:'Potts',
        dateOfBirth:new Date(1993,2,18),
        role:'Lord Ruler'
    })
    profile1.save(checkAnswer);

    let profile2=new Profile({
        name:'moli',
        surname:'Potts',
        dateOfBirth:new Date(1993,2,18),
        role:'Lord Ruler'
    })
    profile2.save(checkAnswer);

    let profile3=new Profile({
        name:'Moli',
        surname:'potts',
        dateOfBirth:new Date(1993,2,18),
        role:'Lord Ruler'
    })
    profile3.save(checkAnswer);

    let profile4=new Profile({
        name:'Moli',
        surname:'Potts',
        dateOfBirth:new Date(2013,2,18),
        role:'Lord Ruler'
    })
    profile4.save(checkAnswer);

    let profile5=new Profile({
        name:'Moli',
        surname:'Potts',
        dateOfBirth:new Date(1900,3,9),
        role:'Lord Ruler'
    })
    profile5.save(checkAnswer);

    let profile6=new Profile({
        name:'Moli',
        surname:'Potts',
        dateOfBirth:new Date(1900,3,9),
        comments:'No comment',
        role:'Lord Ruler'
    })
    profile6.save(checkAnswer);



    let credentials1=new Credentials({
        address:'Calle Pino 5 puerta 2',
        phone: 657256515,
        email:'molipotts@gmail.com'
    })
    credentials1.save(checkAnswer);


    let credentials2=new Credentials({
        address:'Calle Pino 5 puerta 2',
        phone: 65725651534,
        email:'molipotts@gmail.com'
    })
    credentials2.save(checkAnswer);

    let credentials3=new Credentials({
        address:'Calle Pino 5 puerta 2',
        phone: 6572565,
        email:'molipotts@gmail.com'
    })
    credentials3.save(checkAnswer);

    let credentials4=new Credentials({
        address:'Calle Pino 5 puerta 2',
        phone: 657256515,
        email:'molipottsgmail.com'
    })
    credentials4.save(checkAnswer);

    let credentials5=new Credentials({
        address:'Calle Pino 5 puerta 2',
        phone: 657256515,
        email:'molipotts@gmailcom'
    })
    credentials5.save(checkAnswer);

    let credentials6=new Credentials({
        address:'Calle Pino 5 puerta 2',
        phone: 657256515
    })
    credentials6.save(checkAnswer);



    function checkAnswer(err,res){
        if(err){
            console.log('Error: ' + err);
        }
        else{
            console.log('documento guardado correctamente')
        }
    }


