import { Router } from "express";
import { ERRORS } from "../consts/errors.js";
import { productManager } from "../Managers/index.js";



const router = Router();

// GET 
router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        const user = {
            name: 'Matias',
            lastname: 'Chirstello', 
            status: true
        }

        res.render('home', {
            user: user,
            style: 'style.css',
            isLogged: user.status === true,
            products,
        })
        
    } catch (error) {
        console.log(error);

        res.send({ Succes: false, error: "We're experimenting some kind of error. Please try again later." });
    }
})

// Ruta para uso de Socket - realTimeProducts
// GET
router.get("/realtimeproducts", async (req, res) => {
    try {

        const user = {
            name: 'Matias',
            lastname: 'Chirstello', 
            status: true
        }
        
        return res.render("realTimeProducts", {
                style: "style.css",
                user: user,
                isLogged: user.status === true
                })

    } catch (error) {
        console.log(error);

        res.send({ Succes: false, error: "We're experimenting some kind of error. Please try again later." });
    }
});

// POST
// Crear nuevo producto
router.post("/realtimeproducts", async (req, res) => {
    try {
        const user = {
            name: 'Matias',
            lastname: 'Chirstello', 
            status: true
        }

        // req.io.socket.emit('realTimeProducts', newProduct) // Enviar peticion dentro del POST
        
        return res.render("realTimeProducts", {
                style: "style.css",
                user: user,
                isLogged: user.status === true
                })

    } catch (error) {
        console.log(error);

        if (error.name === ERRORS.VALIDATION_ERROR) {
            return res.send({Succes: false, error: `${error.name}: ${error.message}` });
        }

        res.send({ Succes: false, error: "We're experimenting some kind of error. Please try again later." });
    }
});

router.delete("/realtimeproducts/:pid", async (req, res) => {
    try {
        
    } catch (error) {
        
    }
});









export default router