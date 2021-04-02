const mongoose=require('mongoose');
const Photo =require('./photo');
const User=require ('./relacionesUsers');
let express=require ('express');
const { response } = require('express');
let app= new express();
app.use(express.urlencoded({extended:false}));
app.use(express.json());
mongoose.connect('mongodb://localhost:27017/relaciones',{
    useNewUrlParser:true,useUnifiedTopology:true
})

function error(err){
    console.log(`Error: ${err}`);
}


let user1=new User({
    userName:'manolito',
    password:'Patatas',
    name:'Manolo',
    surname:'Potts',
    dateOfBirth:new Date(1993,2,18),
    role:'user',
    address:'Calle Pino 5 puerta 2',
    phone: 657256515,
    email:'manolo@gmail.com',
    follow: [],
    photos:[]
})

let user2=new User({
    userName:'frodo',
    password:'Patatas',
    name:'Frodo',
    surname:'Baggins',
    dateOfBirth:new Date(1994,2,18),
    role:'user',
    address:'Calle Pino 5 puerta 1',
    phone: 657256666,
    email:'frodobaggins@gmail.com',
    follow: [],
    photos:[]
})

let user3=new User({
    userName:'kote',
    password:'Patatitas',
    name:'Kwothe',
    surname:'Kingkiller',
    dateOfBirth:new Date(1990,2,18),
    role:'user',
    address:'Calle Pino 5',
    phone: 656666666,
    email:'kwothe@gmail.com',
    follow: [],
    photos:[]
})

let foto1= new Photo({
    userName: 'kote',
    url:'urlDeKwothe1',
    title: "Kwothe's pic 1",
    description: 'first picture of Kwothe'
})

let foto2= new Photo({
    userName: 'frodo',
    url:'urlDeFrodo1',
    title: "Frodo's pic 1",
    description: 'first picture of Frodo'
})

let foto3= new Photo({
    userName: 'kote',
    url:'urlDeKwothe2',
    title: "Kwothe's pic 2",
    description: 'second picture of Kwothe'
})

let foto4= new Photo({
    userName: 'frodo',
    url:'urlDeFrodo2',
    title: "Frodo's pic 2",
    description: 'second picture of Frodo'
})

let foto5= new Photo({
    userName: 'manolito',
    url:'urlDeManolo1',
    title: "Manolo's pic 1",
    description: 'first picture of Manolo'
})

let foto6= new Photo({
    userName: 'manolito',
    url:'urlDeManolo2',
    title: "Manolo's pic 2",
    description: 'second picture of Manolo'
})

// User.create([user1,user2,user3])
//     .then((users)=>{
//         console.log('users creados')
//         console.log(users)
//     })
//     .catch(error)

// Photo.create([foto1,foto2,foto3,foto4,foto5,foto6])
//     .then((fotos)=>{
//         console.log('fotos creadas')
//         console.log(fotos)
//     })
//     .catch(error)


// User.updateOne({userName:'manolito'},{$addToSet:{follow:['604a32ed1526d4498a12fadb','604a32ed1526d4498a12fadc'],photos:['604b8f09ededc1542749ebd0','604b8f09ededc1542749ebd1']}})
//     .then((res)=>{
//         console.log(res)
//     })
//     .catch((err)=>{
//         console.log(err)
//     })

// User.updateOne({userName:'frodo'},{$addToSet:{follow:['604a32ed1526d4498a12fada','604a32ed1526d4498a12fadc'],photos:['604b8f09ededc1542749ebcd','604b8f09ededc1542749ebcf']}})
//     .then((res)=>{
//         console.log(res)
//     })
//     .catch((err)=>{
//         console.log(err)
//     })

// User.updateOne({userName:'kote'},{$addToSet:{follow:['604a32ed1526d4498a12fada','604a32ed1526d4498a12fadb'],photos:['604b8f09ededc1542749ebcc','604b8f09ededc1542749ebce']}})
//     .then((res)=>{
//         console.log(res)
//     })
//     .catch((err)=>{
//         console.log(err)
//     })


// User.findOne({userName:'molibdy'})
//     .populate('photos')
//     .exec((err,res)=>{
//         if(err){console.log(err)}
//         else{
//             console.log(`Datos y fotos de ${res.userName}: ${res}`)
//         }
//     })

// User.findOne({userName:'pepito'})
//     .populate('photos')
//     .exec((err,res)=>{
//         if(err){console.log(err)}
//         else{
//             console.log(`Datos y fotos de ${res.userName}: ${res}`)
//         }
//     })


// User.findOne({userName:'menchu'})
//     .populate('photos')
//     .exec((err,res)=>{
//         if(err){console.log(err)}
//         else{
//             console.log(`Datos y fotos de ${res.userName}: ${res}`)
//         }
//     })



//  FUNCIONES  //


function follow(user1,user2){
    User.findOne({userName:user2},{_id:1})
        .then((userId)=>{
            console.log(userId)
            returnUser.updateOne({userName:user1},{$addToSet:{follow:[userId._id]}})
        })
        .then((res)=>{
            console.log(res)
        })
        .catch((err)=>{
            console.log(err)
        })
}

//follow('molibdy','pepito')




function unfollow(user1,user2){
    User.findOne({userName:user2},{_id:1})
        .then((userId)=>{
            console.log(userId)
            return User.updateOne({userName:user1,follow:userId._id},{$pull:{follow:userId._id}}) 
        })
        .then((res)=>{
            console.log(res)
        })
        
        .catch((err)=>{
            console.log(err)
        })
}

//unfollow('molibdy','pepito')




function mostrarTimeline1(userName){
    User.findOne({userName:userName})
        .populate({path:'follow',
            populate:{path:'photos'}
        })
        .exec((err,res)=>{
            if(err){console.log(err)}
            else{
                let timeLine=[]
                for(let i=0;i<res.follow.length;i++){
                    for(let j=0;j<res.follow[i].photos.length;j++){
                        timeLine.push(res.follow[i].photos[j])
                    }
                }
                //console.log(timeLine)
            }
            
        })
}

//mostrarTimeline1('menchu')




function explora(userId){
    User.findOne({_id:userId})
        .then((user)=>{
            console.log(user.follow)
            user.follow.push(userId)
            return User.aggregate([{$match:{_id: {$nin:user.follow}}},{$group:{_id:null,allPhotos:{$addToSet:{$arrayElemAt:["$photos",0]}}}}]) 
                // .populate('photos')
        })
        .then((unfollowed)=>{
            console.log(unfollowed)
            console.log(unfollowed[0].allPhotos)
        })
}

explora('604a32ed1526d4498a12fada')




app.get('/usuario',(request,response)=>{
    mostrarTimeline(request.query.userName,response)
})

function mostrarTimeline(userName,response){
    if(userName!=null){
        User.findOne({userName:userName})
        .populate({path:'follow',
            populate:{path:'photos'}
        })
        .exec((err,res)=>{
            if(err){response.send({error:true, code:200, message:err})}
            else{
                if(res!=null){
                    let timeLine=[]
                    for(let i=0;i<res.follow.length;i++){
                        for(let j=0;j<res.follow[i].photos.length;j++){
                            timeLine.push(res.follow[i].photos[j])
                        }
                    }
                    //console.log(timeLine)
                    response.send(timeLine)
                }else{
                    response.send({error:true, code:200, message:`el usuario ${userName} no existe`}) 
                }
            }
        })
    }else{
        response.send({error:true, code:200, message:'usuario no especificado'})
    }
}



app.listen(3000)