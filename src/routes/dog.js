const { Router } = require('express');
const router = Router();
const {Breed} = require('../db');


router.post("/", async (req, res, next) => { // /dog
    const {name, min_height, max_height, min_weight, max_weight, life_span, image, temperament} = req.body; 
    const height = min_height + " - " + max_height
    const weight = min_weight + " - " + max_weight
    let newBreed = {}
    try{
        if(name, height, weight){
            newBreed = await Breed.create({
                name, height, weight, life_span: life_span ? life_span : null, image: image ? image : null 
            })
        }
        if(temperament){
            await newBreed.addTemperaments(temperament) 
            return res.json(newBreed)
            }
            res.json(newBreed)
    }catch(error){
        next(error)
    }
}) 


module.exports = router;