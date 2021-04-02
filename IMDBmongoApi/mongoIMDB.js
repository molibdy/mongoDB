// const Profesional=require('./profesional');
// const Movie=require('./pelicula');
let express=require ('express');
let app= new express()
app.use(express.urlencoded({extended:false}));
app.use(express.json())

const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost:27017/IMDB',{
    useNewUrlParser:true,useUnifiedTopology:true
})



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
let Movie=mongoose.model('Movie',movieSchema,'movies')


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
let Profesional=mongoose.model('Profesional',profesionalSchema,'profesionales')







//////////////////////////
//  API REST PROFESIONALES  //
//////////////////////////

app.get('/profesionales',(request,response)=>{
    let respuesta;
    let id=request.query.id
    if(id!=null){
        Profesional.findById(id)
            .then((profesional)=>{
                console.log(profesional)
                if(profesional!=null){
                    respuesta={error:false, code:200, message: `mostrando profesional con id ${id}`, result: profesional} 
                }else{
                    respuesta={error:true, code:200, message: `No existe el profesional con id ${id}`}
                }
                response.send(respuesta);
            })
            .catch((err)=>{
                respuesta={error:true, code:200, message: err};
                response.send(respuesta);
            })
    }else{
        Profesional.find({})
            .then((profesionales)=>{
                console.log(profesionales)
                if(profesionales.length>0){
                    respuesta={error:false, code:200, message: 'Mostrando profesionales', result: profesionales} 
                }else{
                    respuesta={error:true, code:200, message: `No hay profesionales`}
                }
                response.send(respuesta);
            })
            .catch((err)=>{
                respuesta={error:true, code:200, message: err};
                response.send(respuesta);
            })
    }
})



app.post('/profesionales',(request,response)=>{
    let respuesta;
        let profesional=new Profesional({
            name:request.body.name,
            age:request.body.age,
            gender:request.body.gender,
            weight:request.body.weight,
            height:request.body.height,
            hairColor:request.body.hairColor,
            eyeColor:request.body.eyeColor,
            isRetired:request.body.isRetired,
            nationality:request.body.nationality,
            oscarNumber:request.body.oscarNumber,
            profession:request.body.profession 
        })
        
        Profesional.create(profesional)
            .then((profesional)=>{
                respuesta={error:false, code:200, message: `Profesional creado correctamente`, result: profesional};
                response.send(respuesta);  
            })
            .catch((err)=>{
                respuesta={error:true, code:200, message: err};
                response.send(respuesta); 
            })
})



app.put('/profesionales',(request,response)=>{
    let respuesta;
    let id=request.body.id;
    if(id!=null){
        Profesional.updateOne({_id:id},{name:request.body.name,
            age:request.body.age,
            gender:request.body.gender,
            weight:request.body.weight,
            height:request.body.height,
            hairColor:request.body.hairColor,
            eyeColor:request.body.eyeColor,
            isRetired:request.body.isRetired,
            nationality:request.body.nationality,
            oscarNumber:request.body.oscarNumber,
            profession:request.body.profession  },
            {omitUndefined:true})
            .then((res)=>{
                if(res.n>0){
                    if(res.nModified>0){
                        respuesta={error:false, code:200, message: `profesional con id ${id} modificado`};
                    }else{
                        respuesta={error:true, code:200, message: `Ningún dato ha cambiado respecto al original`};
                    }
                }else{
                    respuesta={error:true, code:200, message: `No existe el profesional con id ${id}`};
                }
                response.send(respuesta);  
            })
            .catch((err)=>{
                respuesta={error:true, code:200, message: err};
                response.send(respuesta); 
            })
    }else{
        respuesta={error:true, code:200, message: `id del profesional no especificado`};
        response.send(respuesta);
    }       
})


app.delete('/profesionales',(request,response)=>{
    let respuesta;
    let id=request.body.id;
    if(id!=null){
        Profesional.deleteOne({_id:id})
            .then((res)=>{
                if(res.n>0){
                    console.log(res)
                    if(res.deletedCount>0){
                        respuesta={error:false, code:200, message: `profesional con id ${id} eliminado`};
                    }else{
                        respuesta={error:true, code:200, message: `profesional con id ${id} NO ha sido eliminado`};
                    }
                }else{
                    respuesta={error:true, code:200, message: `No existe el profesional con id ${id}`};
                }
                response.send(respuesta);  
            })
            .catch((err)=>{
                respuesta={error:true, code:200, message: err};
                response.send(respuesta); 
            })
    }else{
        respuesta={error:true, code:200, message: `id del profesional no especificado`};
        response.send(respuesta);
    }       
    })




    

//////////////////////////
//  API REST PELICULAS  //
//////////////////////////


    app.get('/peliculas',(request,response)=>{
        let respuesta;
        let id=request.query.id
        if(id!=null){
            Movie.findById(id)
                .populate('actor')
                .populate('director')
                .populate('writer')
                .then((movie)=>{
                    console.log(movie)
                    if(movie!=null){
                        respuesta={error:false, code:200, message: `mostrando pelicula con id ${id}`, result: movie} 
                    }else{
                        respuesta={error:true, code:200, message: `No existe la película con id ${id}`}
                    }
                    response.send(respuesta);
                })
                .catch((err)=>{
                    respuesta={error:true, code:200, message: err};
                    response.send(respuesta);
                })
        }else{
            Movie.find({})
                .populate('actor')
                .populate('director')
                .populate('writer')
                .then((movies)=>{
                    console.log(movies)
                    if(movies.length>0){
                        respuesta={error:false, code:200, message: 'mostrando peliculas', result: movies} 
                    }else{
                        respuesta={error:true, code:200, message: `No hay películas`}
                    }
                    response.send(respuesta);
                })
                .catch((err)=>{
                    respuesta={error:true, code:200, message: err};
                    response.send(respuesta);
                })
        }
    })


    app.get('/peliculas/actor',(request,response)=>{
        let respuesta;
        let id=request.query.idPelicula
        if(id!=null){
            Movie.findById(id,{actor:1})
                .populate('actor')
                .then((movie)=>{
                    console.log(movie)
                    if(movie!=null){
                        if(movie.actor.length>0 || movie.actor!=null){
                            respuesta={error:false, code:200, message: `Mostrando actores de la pelicula con id ${id}`, result: movie.actor}   
                        }else{
                            respuesta={error:true, code:200, message: `La pelicula con id ${id} no tiene actores`} 
                        }
                    }else{
                        respuesta={error:true, code:200, message: `No existe la película con id ${id}`}
                    }
                    response.send(respuesta);
                })
                .catch((err)=>{
                    respuesta={error:true, code:200, message: err};
                    response.send(respuesta);
                })
        }else{
            respuesta={error:true, code:200, message: `id de la película no especificado`};
            response.send(respuesta);
        }
    })


   app.get('/peliculas/director',(request,response)=>{
        let respuesta;
        let id=request.query.idPelicula
        if(id!=null){
            Movie.findById(id,{director:1})
                .populate('director')
                .then((movie)=>{
                    console.log(movie)
                    if(movie!=null){
                        if(movie.director.length>0 || movie.director!=null){
                            respuesta={error:false, code:200, message: `Mostrando directores de la pelicula con id ${id}`, result: movie.director}   
                        }else{
                            respuesta={error:true, code:200, message: `La pelicula con id ${id} no tiene directores`} 
                        }
                    }else{
                        respuesta={error:true, code:200, message: `No existe la película con id ${id}`}
                    }
                    response.send(respuesta);
                })
                .catch((err)=>{
                    respuesta={error:true, code:200, message: err};
                    response.send(respuesta);
                })
        }else{
            respuesta={error:true, code:200, message: `id de la película no especificado`};
            response.send(respuesta);
        }
    })



    app.get('/peliculas/guionista',(request,response)=>{
        let respuesta;
        let id=request.query.idPelicula
        if(id!=null){
            Movie.findById(id,{writer:1})
                .populate('writer')
                .then((movie)=>{
                    console.log(movie)
                    if(movie!=null){
                        if(movie.writer.length>0 || movie.writer!=null){
                            respuesta={error:false, code:200, message: `Mostrando guionistas de la pelicula con id ${id}`, result: movie.writer}   
                        }else{
                            respuesta={error:true, code:200, message: `La pelicula con id ${id} no tiene guionistas`} 
                        }
                    }else{
                        respuesta={error:true, code:200, message: `No existe la película con id ${id}`}
                    }
                    response.send(respuesta);
                })
                .catch((err)=>{
                    respuesta={error:true, code:200, message: err};
                    response.send(respuesta);
                })
        }else{
            respuesta={error:true, code:200, message: `id de la película no especificado`};
            response.send(respuesta);
        }
    })


    app.get('/peliculas/productora',(request,response)=>{
        let respuesta;
        let id=request.query.idPelicula
        if(id!=null){
            Movie.findById(id)
                .then((movie)=>{
                    console.log(movie)
                    if(movie!=null){
                        if(movie.producer!=null){
                            respuesta={error:false, code:200, message: `Mostrando productora de la pelicula con id ${id}`, result: movie.producer}   
                        }else{
                            respuesta={error:true, code:200, message: `La pelicula con id ${id} no tiene productora`} 
                        }
                    }else{
                        respuesta={error:true, code:200, message: `No existe la película con id ${id}`}
                    }
                    response.send(respuesta);
                })
                .catch((err)=>{
                    respuesta={error:true, code:200, message: err};
                    response.send(respuesta);
                })
        }else{
            respuesta={error:true, code:200, message: `id de la película no especificado`};
            response.send(respuesta);
        }
    })






    
app.post('/peliculas',(request,response)=>{
    let respuesta;
    let pelicula=new Movie({
        title: request.body.title,
        releaseYear: request.body.releaseYear,
        nationality: request.body.nationality,
        genre: request.body.genre,
        director:request.body.director, 
        writer: request.body.writer,
        language: request.body.language,
        isMCU: request.body.isMCU,
        mainCharacterName: request.body.mainCharacterName,
        producer: request.body.producer,
        distributor: request.body.distributor,
        actor: request.body.actor     
    })
    
    Movie.create(pelicula)
        .then((res)=>{
            console.log(res)
            respuesta={error:false, code:200, message: `Película creada correctamente`, result: res};
            response.send(respuesta);  
        })
        .catch((err)=>{
            respuesta={error:true, code:200, message: err};
            response.send(respuesta); 
        })
})
    



app.post('/peliculas/actor',(request,response)=>{
    let respuesta;
    let id=request.body.idPelicula
    if(id!=null){
        let actor=new Profesional({
            name:request.body.name,
            age:request.body.age,
            gender:request.body.gender,
            weight:request.body.weight,
            height:request.body.height,
            hairColor:request.body.hairColor,
            eyeColor:request.body.eyeColor,
            isRetired:request.body.isRetired,
            nationality:request.body.nationality,
            oscarNumber:request.body.oscarNumber,
            profession:request.body.profession 
        })
        
        Profesional.create(actor)
            .then((actor)=>{
                console.log('actor creado correctamente')
                console.log(actor)
                return Movie.updateOne({_id:id},{$addToSet:{actor:actor._id}})
            })
            .then((res)=>{
                if(res.n>0){
                    if(res.nModified>0){
                        respuesta={error:false, code:200, message: `Actor añadido a la película con id ${id}`};
                    }else{
                        respuesta={error:true, code:200, message: `Actor ya existía en la película con id ${id}`};
                    }
                }else{
                    respuesta={error:true, code:200, message: `No existe la película con id ${id}`};
                }
                response.send(respuesta);  
            })
            .catch((err)=>{
                respuesta={error:true, code:200, message: err};
                response.send(respuesta); 
            })
    }else{
        respuesta={error:true, code:200, message: `id de la película no especificado`};
        response.send(respuesta);
    }
    
})



app.post('/peliculas/director',(request,response)=>{
    let respuesta;
    let id=request.body.idPelicula
    if(id!=null){
        let director=new Profesional({
            name:request.body.name,
            age:request.body.age,
            gender:request.body.gender,
            weight:request.body.weight,
            height:request.body.height,
            hairColor:request.body.hairColor,
            eyeColor:request.body.eyeColor,
            isRetired:request.body.isRetired,
            nationality:request.body.nationality,
            oscarNumber:request.body.oscarNumber,
            profession:request.body.profession 
        })
        
        Profesional.create(director)
            .then((director)=>{
                console.log('director creado correctamente')
                console.log(director)
                return Movie.updateOne({_id:id},{$addToSet:{director:director._id}})
            })
            .then((res)=>{
                if(res.n>0){
                    if(res.nModified>0){
                        respuesta={error:false, code:200, message: `director añadido a la película con id ${id}`};
                    }else{
                        respuesta={error:true, code:200, message: `director ya existía en la película con id ${id}`};
                    }
                }else{
                    respuesta={error:true, code:200, message: `No existe la película con id ${id}`};
                }
                response.send(respuesta);  
            })
            .catch((err)=>{
                respuesta={error:true, code:200, message: err};
                response.send(respuesta); 
            })
    }else{
        respuesta={error:true, code:200, message: `id de la película no especificado`};
        response.send(respuesta);
    }
    
})



app.post('/peliculas/guionista',(request,response)=>{
    let respuesta;
    let id=request.body.idPelicula
    if(id!=null){
        let writer=new Profesional({
            name:request.body.name,
            age:request.body.age,
            gender:request.body.gender,
            weight:request.body.weight,
            height:request.body.height,
            hairColor:request.body.hairColor,
            eyeColor:request.body.eyeColor,
            isRetired:request.body.isRetired,
            nationality:request.body.nationality,
            oscarNumber:request.body.oscarNumber,
            profession:request.body.profession 
        })
        
        Profesional.create(writer)
            .then((writer)=>{
                console.log('guionista creado correctamente');
                console.log(writer);
                return Movie.updateOne({_id:id},{$addToSet:{writer:writer._id}});
            })
            .then((res)=>{
                if(res.n>0){
                    if(res.nModified>0){
                        respuesta={error:false, code:200, message: `guionista añadido a la película con id ${id}`};
                    }else{
                        respuesta={error:true, code:200, message: `guionista ya existía en la película con id ${id}`};
                    }
                }else{
                    respuesta={error:true, code:200, message: `No existe la película con id ${id}`};
                }
                response.send(respuesta);  
            })
            .catch((err)=>{
                respuesta={error:true, code:200, message: err};
                response.send(respuesta); 
            })
    }else{
        respuesta={error:true, code:200, message: `id de la película no especificado`};
        response.send(respuesta);
    }
    
})




app.put('/peliculas',(request,response)=>{
    let respuesta;
    let id=request.body.idPelicula;
    if(id!=null){
        Movie.updateOne({_id:id},{title: request.body.title,
                    releaseYear: request.body.releaseYear,
                    nationality: request.body.nationality,
                    genre: request.body.genre,
                    director:request.body.director, 
                    writer: request.body.writer,
                    language: request.body.language,
                    isMCU: request.body.isMCU,
                    mainCharacterName: request.body.mainCharacterName,
                    producer: request.body.producer,
                    distributor: request.body.distributor,
                    actor: request.body.actor },
                    {omitUndefined:true})
            .then((res)=>{
                if(res.n>0){
                    if(res.nModified>0){
                        respuesta={error:false, code:200, message: `película con id ${id} modificada`};
                    }else{
                        respuesta={error:true, code:200, message: `Ningún dato ha cambiado respecto al original`};
                    }
                }else{
                    respuesta={error:true, code:200, message: `No existe la película con id ${id}`};
                }
                response.send(respuesta);  
            })
            .catch((err)=>{
                respuesta={error:true, code:200, message: err};
                response.send(respuesta); 
            })
    }else{
        respuesta={error:true, code:200, message: `id de la película no especificado`};
        response.send(respuesta);
    }       
    })
    
    
    
app.delete('/peliculas',(request,response)=>{
    let respuesta;
    let id=request.body.idPelicula;
    if(id!=null){
        Movie.deleteOne({_id:id})
            .then((res)=>{
                if(res.n>0){
                    console.log(res)
                    if(res.deletedCount>0){
                        respuesta={error:false, code:200, message: `película con id ${id} eliminada`};
                    }else{
                        respuesta={error:true, code:200, message: `la película con id ${id} NO ha sido eliminada`};
                    }
                }else{
                    respuesta={error:true, code:200, message: `No existe la película con id ${id}`};
                }
                response.send(respuesta);  
            })
            .catch((err)=>{
                respuesta={error:true, code:200, message: err};
                response.send(respuesta); 
            })
    }else{
        respuesta={error:true, code:200, message: `id de la película no especificado`};
        response.send(respuesta);
    }       
})
    


    app.delete('/peliculas/actor',(request,response)=>{
        let respuesta;
        let id=request.body.idPelicula;
        let idA=request.body.idActor;
        if(id!=null){
            if(idA!=null){
                Movie.updateOne({_id:id},{$pull:{actor:idA}})
                .then((res)=>{
                    if(res.n>0){
                        if(res.nModified>0){
                            respuesta={error:false, code:200, message: `Actor con id ${idA} de la película con id ${id} eliminado`};
                        }else{
                            respuesta={error:true, code:200, message: `Actor con id ${idA} no existe en la película con id ${id}`};
                        }
                    }else{
                        respuesta={error:true, code:200, message: `No existe la película con id ${id}`};
                    }
                    response.send(respuesta);  
                })
                .catch((err)=>{
                    respuesta={error:true, code:200, message: err};
                    response.send(respuesta); 
                })
            }else{
                respuesta={error:true, code:200, message: `id del actor no especificado`};
                response.send(respuesta);
            }       
            
        }else{
            respuesta={error:true, code:200, message: `id de la película no especificado`};
            response.send(respuesta);
        }       
    })
        
    
    app.delete('/peliculas/director',(request,response)=>{
        let respuesta;
        let id=request.body.idPelicula;
        let idD=request.body.idDirector;
        if(id!=null){
            if(idD!=null){
                Movie.updateOne({_id:id},{$pull:{director:idD}})
                .then((res)=>{
                    if(res.n>0){
                        if(res.nModified>0){
                            respuesta={error:false, code:200, message: `director con id ${idD} de la película con id ${id} eliminado`};
                        }else{
                            respuesta={error:true, code:200, message: `director con id ${idD} no existe en la película con id ${id}`};
                        }
                    }else{
                        respuesta={error:true, code:200, message: `No existe la película con id ${id}`};
                    }
                    response.send(respuesta);  
                })
                .catch((err)=>{
                    respuesta={error:true, code:200, message: err};
                    response.send(respuesta); 
                })
            }else{
                respuesta={error:true, code:200, message: `id del director no especificado`};
                response.send(respuesta);
            }       
            
        }else{
            respuesta={error:true, code:200, message: `id de la película no especificado`};
            response.send(respuesta);
        }       
    })



    app.delete('/peliculas/guionista',(request,response)=>{
        let respuesta;
        let id=request.body.idPelicula;
        let idG=request.body.idGuionista;
        if(id!=null){
            if(idG!=null){
                Movie.updateOne({_id:id},{$pull:{writer:idG}})
                .then((res)=>{
                    if(res.n>0){
                        if(res.nModified>0){
                            respuesta={error:false, code:200, message: `guionista con id ${idG} de la película con id ${id} eliminado`};
                        }else{
                            respuesta={error:true, code:200, message: `guionista con id ${idG} no existe en la película con id ${id}`};
                        }
                    }else{
                        respuesta={error:true, code:200, message: `No existe la película con id ${id}`};
                    }
                    response.send(respuesta);  
                })
                .catch((err)=>{
                    respuesta={error:true, code:200, message: err};
                    response.send(respuesta); 
                })
            }else{
                respuesta={error:true, code:200, message: `id del guionista no especificado`};
                response.send(respuesta);
            }       
            
        }else{
            respuesta={error:true, code:200, message: `id de la película no especificado`};
            response.send(respuesta);
        }       
    })
    
    
    
    //Llamadas sin ruta específica:
    app.all('/',(request,response,next)=>{
        console.log('petición recibida desde inicio');
        let respuesta={error:true, code:200, message:'Punto de inicio'};
        response.send(respuesta);
        next();
    })
    
    app.use((request,response,next)=>{
        console.log('petición recibida');
        let respuesta={error:true, code:404, message:'oye que esta URL no vale'};
        response.send(respuesta);
        next();
    })
    
    
    
    app.listen(3000)