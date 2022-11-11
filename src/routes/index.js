const { Router } = require('express');
const dogsRoute = require("./dogs");
const temperamentRoute = require("./temperament");
const dogRoute = require("./dog");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

// Separamos en rutas y controladores


const router = Router();

router.use('/dog', dogRoute);
router.use('/dogs', dogsRoute);
router.use('/temperament', temperamentRoute);

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);


module.exports = router;
