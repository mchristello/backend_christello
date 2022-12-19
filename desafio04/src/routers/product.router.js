import { Router } from "express";
import { ERRORS } from "../consts/errors.js";
import { productManager } from "../Managers/index.js";
import { ValidationError, NotFoundError } from "../utils/errorUtils.js";

const router = Router();

// GET
// Todos los products, y req limit
router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        const limit = Number(req.query.limit);

        if(limit) {
            const reqLimit = products.slice(0, limit);
            
            return res.send ({ Success: true, Products: reqLimit });
        } else {
            return res.send({ Success: true, Products: products });
        }

    } catch (error) {
        console.log(error);
    }
})

// GET por ID
router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const id = Number(pid);

        if(Number.isNaN(id) || id < 0) {
            return res.send({ Success: false, Error: `The Id must be a valid number. Please try again` });
        } else {
            const searchedProduct = await productManager.getProductById(id);

            return res.send({ Success: true, Product: searchedProduct });
        }

    } catch (error) {
        if(error.name === ERRORS.NOT_FOUND_ERROR) {
            return res.send({ Success: false, Error: `${error.name}: ${error.message}` });
        }
        console.log(error);
    }
})

// POST 
// Crear producto
router.post('/', async (req, res) => {
    try {
        const { title, description, category, price, code, stock, thumbnail } = req.body;

        const newProduct = {
            title: title,
            description: description,
            category: category,
            price: Number(price),
            code: code,
            stock: Number(stock),
            thumbnail: thumbnail
        }

        await productManager.addProduct({ ...newProduct });
        return res.send({ Success: true, New_Product: newProduct });

    } catch (error) {
        if(error.name === ERRORS.VALIDATION_ERROR){
            return res.send({ Success: false, Error: `${error.name}: ${error.message}`})
        }
        if(error.name === ERRORS.MISSING_INPUTS){
            return res.send({ Success: false, Error: `${error.name}: ${error.message}`})
        }
        console.log(error);
    }
})

// PUT 
// Modificar Producto
router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const id = Number(pid);

        if(Number.isNaN(id) || id < 0) {
            return res.send({ Success: false, Error: `The ID must be a valid number`})
        }

        const { title, description, category, price, code, stock } = req.body;

        const forUpdate = {
            id: id,
            title: title,
            description: description,
            category: category,
            price: price,
            code: code,
            status: true,
            stock: stock
        }

        await productManager.updateProduct({ ...forUpdate });
        return res.send({ Success: true, Product: forUpdate });


    } catch (error) {
        console.log(error);

        if(error.name === ERRORS.VALIDATION_ERROR) {
            return res.send({ Success: false, Error: `${error.name}: ${error.message}`})
        }
        if(error.name === ERRORS.NOT_FOUND_ERROR) {
            return res.send({ Success: false, Error: `${error.name}: ${error.message}`})
        }
    }
})


// DELETE
// ELiminar Producto
router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const id = Number(pid);

        if(Number.isNaN(id) || id < 0) {
            return res.send({ Success: false, Error: `The ID must be a valid number`})
        }

        await productManager.deleteProduct(id);

        return res.send({ Success: true, Message: `The product has been deleted` });

    } catch (error) {
        console.log(error);

        if(error.name === ERRORS.NOT_FOUND_ERROR) {
            return res.send({ Success: false, Error: `${error.name}: ${error.message}`})
        }
    }
    
})

export default router;