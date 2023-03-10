const { Router } = require('express');
const router = Router();
const {Temperament, Breed } = require('../db');
const {Op} = require("sequelize");
const axios = require("axios");

const api_key = "d0ca73ad-ed44-4042-800e-7e678dc1959d"


router.get("/", async(req, res, next) => {  // /dogs y /dogs?name=razaDeApi o razaCreada

    const {name} = req.query;

    if(!name){
        const promiseApiDogs = axios.get(`https://api.thedogapi.com/v1/breeds?api_key=${api_key}`)
        const promiseDbDogs = Breed.findAll(
                                {include: Temperament}
                            )
        Promise.all([
            promiseApiDogs,
            promiseDbDogs
        ])
        .then((response) => {
            const [apiDogs, dbDogs] = response

            let allDogs = []

            apiDogs.data.forEach(dog => {
                allDogs.push({
                    id: dog.id,
                    image: dog.image.url,
                    name: dog.name,
                    temperament: dog.temperament || "No temperaments",
                    min_weight: Number(dog.weight.metric.split(" - ")[0]),
                    max_weight: Number(dog.weight.metric.split(" - ")[1])
                })
            })

            dbDogs.forEach(dog => {
                allDogs.push({
                    id: dog.id,
                    name: dog.name,
                    temperament: dog.temperaments ? dog.temperaments.map(e => e.name).join(", ") : "No temperaments",
                    min_weight: Number(dog.weight.split(" - ")[0]),
                    max_weight: Number(dog.weight.split(" - ")[1]),
                    image: dog.image ? dog.image : null
                })
            })


        return res.json(allDogs)
        })
        .catch(error => {
            return next(error)
        })    
    }

    if(name){
        const promiseApiDogs = axios.get(`https://api.thedogapi.com/v1/breeds?api_key=${api_key}`)
        const promiseDbDogs = Breed.findAll({
                                    where: {name: {
                                        [Op.iLike]: `%${name}%`
                                    }},
                                    include: Temperament
                                })
        Promise.all([
            promiseApiDogs,
            promiseDbDogs
        ])
            .then((response) => {
                const [apiDogs, dbDogs] = response

                let dogsWithName = []

                apiDogs.data.forEach(dog => {
                    if(dog.name.toLowerCase().includes(name.toLowerCase())){
                        dogsWithName.push({
                            id: dog.id,
                            image: dog.image.url,
                            name: dog.name,
                            temperament: dog.temperament || "No temperaments",
                            min_weight: Number(dog.weight.metric.split(" - ")[0]),
                            max_weight: Number(dog.weight.metric.split(" - ")[1])
                        })
                    }
                })

                dbDogs.forEach(dog => {
                        dogsWithName.push({
                            id: dog.id,
                            name: dog.name,
                            temperament: dog.temperaments ? dog.temperaments.map(e => e.name).join(", ") : "No temperaments",
                            min_weight: Number(dog.weight.split(" - ")[0]),
                            max_weight: Number(dog.weight.split(" - ")[1]),
                            image: dog.image ? dog.image : null,
                        })
                })

            return res.json(dogsWithName.length > 0 ? dogsWithName : ["We don't have that breed"])
            })
            .catch(error => {
                return next(error)
            })
    }
})


router.get("/:idBreed", async(req, res, next) => { // /dogs/idDeApi o idDb 

    const {idBreed} = req.params;

    if(idBreed.length > 8){

        try{
            const myBreed = await Breed.findByPk(idBreed,{
                include: Temperament
            })

            // console.log("myBreed: ", myBreed)

            const myBreedDetail = Object.assign({},
                {
                id: myBreed.id,
                name: myBreed.name,
                temperament: myBreed.temperaments ? myBreed.temperaments.map(e => e.name).join(", ") : "No temperaments", 
                min_weight: Number(myBreed.weight.split(" - ")[0]),
                max_weight: Number(myBreed.weight.split(" - ")[1]),
                min_height: Number(myBreed.height.split(" - ")[0]),
                max_height: Number(myBreed.height.split(" - ")[1]),
                min_life_span: myBreed.life_span ? myBreed.life_span : null,
                max_life_span: myBreed.life_span ? myBreed.life_span : null,
                image: myBreed.image ? myBreed.image : null    
                } 
            )
            return res.json(myBreedDetail)
        }catch(error){
            next(error)
        }

    } else {

    const idBreedNum = Number(idBreed);

        try{
            const response = await axios.get(`https://api.thedogapi.com/v1/breeds?api_key=${api_key}`);
            const responseFiltrada = response.data.filter(e => e.id === idBreedNum);
            console.log("responseFiltrada: ", responseFiltrada)
            const responseMapeada = responseFiltrada.map(e => {
                let newObj = {
                    id: e.id,
                    image: e.image.url,
                    name: e.name,
                    temperament: e.temperament || "No temperaments",
                    min_weight: Number(e.weight.metric.split(" - ")[0]),
                    max_weight: Number(e.weight.metric.split(" - ")[1]),
                    min_height: Number(e.height.metric.split(" - ")[0]),
                    max_height: Number(e.height.metric.split(" - ")[1]),
                    min_life_span: Number(e.life_span.split(" - ")[0]),
                    max_life_span: Number(e.life_span.split(" ")[2]),
                };
                return newObj;
            })
            res.json(responseMapeada.length > 0 ? responseMapeada[0] : {notFound: "No dogs corresponding with the ID"})
        }catch(error){
            return next(error)
        }
    }
})



module.exports = router;