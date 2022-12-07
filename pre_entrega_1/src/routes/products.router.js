import { Router } from 'express';
import { ERRORS } from '../consts/errors.js';
import { productManager } from '../Managers/index.js';

const router = Router();

// GET

// Todos los productos
router.get('/', async (req, res) => {
    try {
        const db = await productManager.getProducts(); 
        const limit = Number(req.query.limit);
    
        if(limit){
            const reqLimit = db.slice(0, limit);
            return res.send({ Success: true, Products: reqLimit });
        } else {
            return res.send({ Success: true, Products: db });
        }
    } catch (error) {
        console.log(error);
    }
})

// Productos por ID
router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const id = Number(pid)
    
        if (Number.isNaN(id) || id < 0) {
            return res.send({Success: false, error: `The id must be a valid number. Please try again.`});
        } else {
            const productById = await productManager.getProductById(id);
            
            return res.send({Success: true, product: productById})
        }
    } catch (error) {
        console.log(error);
    }
})

// Productos por title
router.get('/title/:title', async (req, res) => {
    try {
        const db = await productManager.getProducts();
        const { title } = req.params;
        const reqTitle = db.filter((product) => product.title.toLowerCase() === title.toLowerCase());
    
        if(reqTitle.length > 0) {
            // const productByTitle = await productManager.getProductByTitle(reqTitle);
            return res.send({reqTitle});
        } else {
            return res.send(`<h2 style="text-align:center; margin-top:10rem; color:red;"><u>The brand you searched was not found in our Database</u></h2>`);
        }
    } catch (error) {
        console.log(error);
    }
})

// POST
// Crear nuevo producto 

router.post("/", async (req, res) => {
    try {
        const { title, description, category, price, code, stock } = req.body;

        const addedProduct = {
            title: title,
            description: description,
            category: category,
            price: price,
            code: code,
            stock: stock
        }

        await productManager.addProduct({ ...addedProduct });
        return res.send({Success:true, Product: addedProduct});

    } catch (error) {
        console.log(error);
        if (error.name === ERRORS.VALIDATION_ERROR) {
            return res.send({ Success: false, Error: `${error.name}: ${error.message}`})
        }

        if (error.name === ERRORS.MISSING_INPUTS) {
            return res.send({ Success: false, error: `${error.name}: ${error.message}`});
        }
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