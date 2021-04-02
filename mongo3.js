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

function subirFoto(userName,url,title,description,response){
    let foto= new Photo({
        userName: userName,
        url:url,
        title: title,
        description: description
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
}
//subirFoto('molibdy','urlDeMoli2',"Moli's Pic 2",'second picture of Moli')


//Función para obtener fotos de un user:
function obtenerFotos(userName,response){
    let respuesta;
    if(userName!=null){
        Photo.find({userName:userName})
            .then(function(res){
                if(res.length===0){
                    respuesta={error:true, code:200, message:`El usuario ${userName} no tiene fotos`};
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
}
//obtenerFotos('molibdy')


// funcion seguir
    function seguir(userName,follow,response){
        let respuesta;
        if (userName!=null){
            User.find({userName:userName})
                .then(function(res){
                    if(res.length===0){
                        respuesta={error:true, code:200, message:`El usuario ${userName} no existe`};
                        response.send(respuesta);
                    }else{
                        if(follow!=null){
                            User.updateOne({userName:userName},{follow:follow})
                            .then(function(res){
                                if(res.n===0){
                                    respuesta={error:true, code:200, message:`El usuario ${userName} no existe`};
                                }else{
                                    console.log(res)
                                    respuesta={error:false, code:200, message:`Now ${userName} is following ${follow}`}
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
    }
    



    function dejarDeSeguir(userName,unfollow,response){
        let respuesta;
        if (userName!=null){ // Si el cliente ha especificado userName
            User.find({userName:userName})
                .then(function(res){
                    if(res.length===0){  // Si no existe ningún usuario con el userName especificado
                        respuesta={error:true, code:200, message:`El usuario ${userName} no existe`};
                        response.send(respuesta);
                    }else{
                        if(unfollow!=null){ // Si el cliente ha especificado a quién hacer unfollow
                            User.updateOne({userName:userName,follow:unfollow},{follow:null})
                            .then(function(res){
                                if(res.n===0){
                                    respuesta={error:false, code:200, message:`${userName} was not following ${unfollow}`};
                                    response.send(respuesta);
                                }else{
                                    console.log(res);
                                    respuesta={error:false, code:200, message:`Now ${userName} is not following ${unfollow} anymore`};
                                    response.send(respuesta);
                                }
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
    }
    



//Eliminar fotos:
function eliminarFotos(userName,title,response){
    let respuesta;

    if(userName!=null){
        Photo.find({userName:userName})
            .then(function(res){
                if(res.length===0){
                    respuesta={error:true, code:200, message:`El usuario ${userName} no tiene fotos`};
                    response.send(respuesta);
                }else{
                    if(title!=null){
                                    Photo.deleteOne({userName:userName,title:title})
                                    .then(function(result){
                                        if(result.n===0){
                                            respuesta={error:true, code:200, message:`El usuario ${userName} no tiene ninguna foto llamada ${title}`};
                                            response.send(respuesta);
                                        }else{
                                            respuesta={error:false, code:200, message:`Picture '${title}' was deleted from ${userName}'s pictures`}
                                            response.send(respuesta);
                                            console.log(result)
                                        }
                                    })
                                    .catch(function(err){
                                        respuesta={error:true, code:200, error: err};
                                        response.send(respuesta);
                                    })

                    }else{
                        Photo.deleteMany({userName:userName})
                            .then(function(result){
                                console.log(result)
                                respuesta={error:false, code:200, message:`All of ${userName}'s pictures were deleted`};
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
}
//eliminarFoto('molibdy',"Moli's pic 2")





///// API REST //////

// Utiliza las funciones de arriba //



app.get('/photos',(request,response)=>{
    obtenerFotos(request.query.userName,response)
})





app.post('/photos',(request,response)=>{

    subirFoto(request.body.userName,request.body.url,request.body.title,request.body.description,response)
    
})




app.delete('/photos',(request,response)=>{
   eliminarFotos(request.body.userName,request.body.title,response)
})




app.put('/follow',(request,response)=>{
    seguir(request.body.userName,request.body.follow,response);
})




app.put('/unfollow',(request,response)=>{
    dejarDeSeguir(request.body.userName,request.body.unfollow,response)
})



app.listen(3000)