const User = require('./user');
const Photo = require('./photo')
const mongoose=require('mongoose');
let express=require ('express');
let app= new express();
app.use(express.urlencoded({extended:false}));
app.use(express.json());

 mongoose.connect('mongodb://localhost:27017/usuarios',{
    useNewUrlParser:true,useUnifiedTopology:true
})

let user1=new User({
    userName:'molibdy',
    password:'Patatas',
    name:'Moli',
    surname:'Potts',
    dateOfBirth:new Date(1993,2,18),
    role:'Lord Ruler',
    address:'Calle Pino 5 puerta 2',
    phone: 657256515,
    email:'molipotts@gmail.com',
    follow: 'pepito'
})

let user2=new User({
    userName:'pepito',
    password:'Patatas',
    name:'Pepe',
    surname:'Potts',
    dateOfBirth:new Date(1994,2,18),
    role:'user',
    address:'Calle Pino 5 puerta 1',
    phone: 657256666,
    email:'pepito@gmail.com',
    follow: 'molibdy'
})

let foto1= new Photo({
    userName: 'molibdy',
    url:'urlDeMoli1',
    title: "Moli's pic 1",
    description: 'first picture of Moli'
})

let foto2= new Photo({
    userName: 'pepito',
    url:'urlDePepe1',
    title: "Pepe's pic 1",
    description: 'first picture of Pepe'
})

// User.deleteMany({},checkAnswer)
// Photo.deleteMany({},checkAnswer)
// User.create(user1,checkAnswer);
// User.create(user2,checkAnswer);
// Photo.create(foto1,checkAnswer);
// Photo.create(foto2,checkAnswer);


function checkAnswer(err,res){
    if(err){
        console.log('Error: ' + err);
    }
    else{
        console.log('documento guardado correctamente')
        console.log(res)
    }
}


//función para añadir documento a colección photos:

function subirFoto(userName,url,title,description){
    let foto= new Photo({
        userName: userName,
        url:url,
        title: title,
        description: description
    })

    Photo.create(foto)
        .then(function(res){
            console.log('documento guardado correctamente')
            console.log(res)
        })
        .catch(function(err){
            console.log('Error: ' + err);
        })
}
//subirFoto('molibdy','urlDeMoli2',"Moli's Pic 2",'second picture of Moli')


function obtenerFotos(userName){
    Photo.find({userName:userName})
        .then(function(res){
            console.log(res)
        })
        .catch(function(err){
            console.log('Error: ' + err);
        })
        
    
}
//obtenerFotos('molibdy')


function seguir(user1,user2){
    User.updateMany({userName:user1},{follow:user2})
        .then(function(res){
            console.log(res)
            console.log(`Now ${user1} is following ${user2}`)
        })
        .catch(function(err){
            console.log('Error: ' + err);
        })
}

//seguir('molibdy','juanito')


function dejarSeguir(user1,user2){
    User.updateMany({userName:user1,follow:user2},{follow:null})
        .then(function(res){
            console.log(res)
            console.log(`Now ${user1} is not following ${user2} anymore`)
        })
        .catch(function(err){
            console.log('Error: ' + err);
        })
}

//dejarSeguir('molibdy','juanito')


function eliminarFoto(userName,title){
    Photo.deleteOne({userName:userName,title:title})
        .then(function(res){
            console.log(res)
            console.log(`Picture '${title}' was deleted from ${userName}'s pictures`)
        })
        .catch(function(err){
            console.log('Error: ' + err);
        })
}
//eliminarFoto('molibdy',"Moli's pic 2")



function eliminarFotos(userName){
    Photo.deleteMany({userName:userName})
        .then(function(res){
            console.log(res)
            console.log(`All of ${userName}'s pictures were deleted`)
        })
        .catch(function(err){
            console.log('Error: ' + err);
        })
}
//eliminarFotos('molibdy',"Moli's pic 2")




////   API REST   /////

app.get('/photos',(request,response)=>{
    let user=request.query.userName;
    let respuesta;
    if(user!=null){
        Photo.find({userName:user})
            .then(function(res){
                if(res.length===0){
                    respuesta={error:true, code:200, message:`El usuario ${user} no tiene fotos`};
                    response.send(respuesta);
                }else{
                    respuesta=res;
                    response.send(respuesta);
                }
            })
            .catch(function(err){
                respuesta='Error: ' + err;
                response.send(respuesta);
            })
    
    }else{
        respuesta={error:true, code:200, message:'Usuario no especificado'};
        response.send(respuesta);
    }

})


app.post('/photos',(request,response)=>{
    let foto= new Photo({
        userName: request.body.userName,
        url:request.body.url,
        title: request.body.title,
        description: request.body.description
    })

    Photo.create(foto)
        .then(function(res){
            respuesta={error:false, code:200, message:'documento guardado correctamente',result:res};
            response.send(respuesta);
        })
        .catch(function(err){
            respuesta={error:true, code:200, error: err};
            response.send(respuesta);
        })
})



app.delete('/photos',(request,response)=>{
    let respuesta;
    if(request.body.userName!=null){
        Photo.find({userName:request.body.userName})
            .then(function(res){
                if(res.length===0){
                    respuesta={error:true, code:200, message:`El usuario ${request.body.userName} no tiene fotos`};
                    response.send(respuesta);
                }else{
                    if(request.body.title!=null){
                                    Photo.deleteOne({userName:request.body.userName,title:request.body.title})
                                    .then(function(result){
                                        if(result.n===0){
                                            respuesta={error:true, code:200, message:`El usuario ${request.body.userName} no tiene ninguna foto llamada ${request.body.title}`};
                                        }
                                        respuesta={error:false, code:200, message:`Picture '${request.body.title}' was deleted from ${request.body.userName}'s pictures`}
                                        response.send(respuesta);
                                        console.log(result)
                                    })
                                    .catch(function(err){
                                        respuesta={error:true, code:200, error: err};
                                        response.send(respuesta);
                                    })

                    }else{
                        Photo.deleteMany({userName:request.body.userName})
                            .then(function(result){
                                console.log(result)
                                respuesta={error:false, code:200, message:`All of ${request.body.userName}'s pictures were deleted`};
                                response.send(respuesta);
                            })
                            .catch(function(err){
                                respuesta={error:true, code:200, error: err};
                                response.send(respuesta);
                            })
                    }
                }
            })
            .catch(function(err){
                respuesta='Error: ' + err;
                response.send(respuesta);
            })
    }else{
        respuesta={error:true, code:200, message:'Usuario no especificado'};
        response.send(respuesta);
    }
})



app.put('/follow',(request,response)=>{
    let respuesta;
    //console.log(request.body.userName)
    if (request.body.userName!=null){
        console.log(request.body.userName)
        User.find({userName:request.body.userName})
            .then(function(res){
                console.log(request.body.userName)
                console.log(res)
                if(res.length===0){
                    respuesta={error:true, code:200, message:`El usuario ${request.body.userName} no existe`};
                    response.send(respuesta);
                }else{
                    if(request.body.follow!=null){
                        User.updateOne({userName:request.body.userName},{follow:request.body.follow})
                        .then(function(res){
                            if(res.n===0){
                                respuesta={error:true, code:200, message:`El usuario ${request.body.userName} no existe`};
                            }else{
                                console.log(res)
                                respuesta={error:false, code:200, message:`Now ${request.body.userName} is following ${request.body.follow}`}
                                response.send(respuesta);
                            }
                        })
                        .catch(function(err){
                            respuesta={error:true, code:200, error: err};
                            response.send(respuesta);
                        })
                    }else{
                        respuesta={error:true, code:200, message:'Follow no especificado'};
                        response.send(respuesta);
                    }
                }
            })
            .catch(function(err){
                respuesta={error:true, code:200, error: err};
                response.send(respuesta);
            })
    }else{
        respuesta={error:true, code:200, message:'Usuario no especificado'};
        response.send(respuesta);
    }
})


app.put('/unfollow',(request,response)=>{
    let respuesta;
    if (request.body.userName!=null){
        User.find({userName:request.body.userName})
            .then(function(res){
                if(res.length===0){
                    respuesta={error:true, code:200, message:`El usuario ${request.body.userName} no existe`};
                    response.send(respuesta);
                }else{
                    if(request.body.unfollow!=null){
                        User.updateOne({userName:request.body.userName,follow:request.body.unfollow},{follow:null})
                        .then(function(res){
                            console.log(res)
                            respuesta={error:false, code:200, message:`Now ${request.body.userName} is not following ${request.body.unfollow} anymore`}
                            response.send(respuesta);
                        })
                        .catch(function(err){
                            respuesta={error:true, code:200, error: err};
                            response.send(respuesta);
                        })
                    }else{
                        respuesta={error:true, code:200, message:'Unfollow no especificado'};
                        response.send(respuesta);
                    }
                }
            })
            .catch(function(err){
                respuesta={error:true, code:200, error: err};
                response.send(respuesta);
            })
    }else{
        respuesta={error:true, code:200, message:'Usuario no especificado'};
        response.send(respuesta);
    }
})



app.listen(3000)