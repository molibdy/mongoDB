
const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/relaciones',{
    useNewUrlParser:true,useUnifiedTopology:true
})

function checkAnswer(err,res){
    if(err){
        console.log(`Error: ${err}`);
    }
    else{
        console.log('Operación realizada con éxito');
        console.log(res);
    }
}

function error(err){
    console.log(`Error: ${err}`);
}


//One to one:

let parejaSchema=new mongoose.Schema({
    name:String,
    isSuavita:Boolean
})
let Pareja=mongoose.model('Pareja',parejaSchema,'parejas')

let ovejaSchema=new mongoose.Schema({
    color:String,
    isSuavita:Boolean,
    suPareja:{type: mongoose.Schema.Types.ObjectId, ref:'Pareja'}
})
let Oveja=mongoose.model('Oveja',ovejaSchema,'ovejas')



//One to many

let huevoSchema=new mongoose.Schema({
    color:String,
    daysOld:Number
})
let Huevo=mongoose.model('Huevo',huevoSchema,'huevos')


let birdSchema=new mongoose.Schema({
    name:String,
    huevos:[{type:mongoose.Schema.Types.ObjectId,ref:'Huevo'}]
});
let Bird=mongoose.model('Bird',birdSchema,'birds');


//Many to many:
let florSchema=new mongoose.Schema({
    name:String,
    color:String,
    insectos:[{type:mongoose.Schema.Types.ObjectId,ref:'Insect'}]
});
let Flor=mongoose.model('Flor',florSchema,'flores');

let insectSchema=new mongoose.Schema({
    name:String,
    flores:[{type:mongoose.Schema.Types.ObjectId,ref:'Flor'}]
});
let Insect=mongoose.model('Insect',insectSchema,'insects');


  
//CREAR DOCUMENTOS
//onew to many


//one to one
let pareja1=new Pareja({
    name:'Pepa',
    isSuavita: true
})
Pareja.create(pareja1)
    .then(function(res){
        console.log('Documento creado correctamente');
        console.log(res);
        let oveja1=new Oveja({
            color:'marron',
            isSuavita:true,
            suPareja:res._id
        })
        Oveja.create(oveja1,checkAnswer);
    })
    .catch(error)


let huevosArray=[]
let huevo1=new Huevo({
    color:'azul',
    daysOld: 5
})
Huevo.create(huevo1)
    .then(function(res){
        huevosArray.push(res._id);
        let huevo2=new Huevo({
            color:'azul',
            daysOld: 4
        })
        return Huevo.create(huevo2)
    })
    .then(function(res){
        huevosArray.push(res._id);
        let huevo3=new Huevo({
            color:'azul',
            daysOld: 3
        })
        return Huevo.create(huevo3)
    })    
    .then(function(res){
        huevosArray.push(res._id);
        let bluebird=new Bird({
            name:'bluebird',
            huevos:huevosArray
        })
        Bird.create(bluebird,checkAnswer);
    })
    .catch(error);


//many to many
let margarita=new Flor({
    name:'margarita',
    color:'blanco',
    insectos:[]
})

let calendula=new Flor({
    name:'calendula',
    color:'naranja',
    insectos:[]
})

let dandelion=new Flor({
    name:'dandelion',
    color:'amarillo',
    insectos:[]
})

Flor.create([margarita,calendula,dandelion],checkAnswer);

let abeja=new Insect({
    name:'abeja',
    flores:['604a0d5b363e0d4789815336','604a0d5b363e0d4789815338']
})

let mariposa=new Insect({
    name:'mariposa',
    flores:['604a0d5b363e0d4789815336','604a0d5b363e0d4789815337']
})

Insect.create([abeja,mariposa],checkAnswer);



Flor.updateOne({_id:ObjectId('604a0d5b363e0d4789815336')},{$addToSet:{insectos:['604a0d5b363e0d4789815339']}},checkAnswer);
Flor.updateOne({_id:ObjectId('604a0d5b363e0d4789815338')},{$addToSet:{insectos:['604a0d5b363e0d4789815339']}},checkAnswer);

Flor.updateOne({_id:ObjectId('604a0d5b363e0d4789815336')},{$addToSet:{insectos:['604a0d5b363e0d478981533a']}},checkAnswer);
Flor.updateOne({_id:ObjectId('604a0d5b363e0d4789815337')},{$addToSet:{insectos:['604a0d5b363e0d478981533a']}},checkAnswer);



Flor.findOne({name:'margarita'})
    .populate('insectos')
    .exec(function(err,res){
        if(err){console.log(err)}
        else{
            console.log(res.insectos[0])
            console.log(res.insectos[1])
        }
    })


Insect.findOne({name:'abeja'})
    .populate({
        path:'flores',
        populate:{
            path:'insectos'
        }
    })

    .exec(function(err,res){
        if(err){console.log(err)}
        else{
            console.log(res)
            console.log(res.flores[0])
            console.log(res.flores[0].insectos[0])
            // console.log(res.flores[1])
        }
    })
