import { Router } from "express";
import { productModel } from "../models/products.model.js";


const router = Router();


// GET 
router.get('/', async (req, res) => {

    const product = await productModel.find()

    res.send({ Success: true, payload: product });

    res.render('realTimeProducts', {
        style: 'style.css'
    })
})

// POST
router.post('/', async (req, res) => {
    const { title, description, thumbnail, category, price, code, status, stock } = req.body;

    if(!title || !description || !thumbnail || !category || !price || !code || !status || !stock) {
        res.send({ Success: false, message: `There's/are some inputs missing, please check again.`})
    }

    const result = await productModel.create(
        title,
        description,
        thumbnail,
        category, 
        price, 
        code, 
        status, 
        stock
    )

    res.send({ Status: true, payload: result })

    res.render('realTimeProducts', {
        style: 'style.css'
    })

})





export default router;