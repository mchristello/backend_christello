import { Router } from 'express';
import { ERRORS } from '../consts/errors.js';
import { cartManager } from '../Managers/index.js';


const router = Router();

// GET
router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const id = Number(cid);

        if(Number.isNaN(id) || id < 0) {
            return res.send({Success: false, error: `The id must be a valid number. Please try again.`});
        }

        const searchedCart = await cartManager.getCartById(id);
        return res.send({ Success: true, Cart: searchedCart })

    } catch (error) {
        console.log(error);

        if (error.name === ERRORS.NOT_FOUND_ERROR) {
            return res.send({ Success: false, error: `${error.name}: ${error.message}`})
        }

        return res.send({ Success: false, Error: `An error has ocurred.`})
    }
});


// POST
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();

        return res.send({ Success: true, Cart: newCart });

    } catch (error) {
        console.log(error);
        return res.send({ Success: false, Error: `An error has ocurred.`})
    }
})

router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cartId = Number(cid);

        if (Number.isNaN(cartId) || cartId < 0) {
            return res.send({ Success: false, error: `The Cart Id must be a valid number.`})
        }

        const { pid } = req.params;
        const prodId = Number(pid)

        if (Number.isNaN(prodId) || prodId < 0) {
            return res.send({ Success: false, error: `The Product Id must be a valid number.`})
        }

        const addProduct = await cartManager.addProductToCart(cartId, prodId);
        return res.send({ Success: true, Product: addProduct })

    } catch (error) {
        console.log(error);

        if (error.name === ERRORS.NOT_FOUND_ERROR) {
            return res.send({ Success: false, error: `${error.name}: ${error.message}`})
        }

        if (error.name === ERRORS.NO_STOCK_ERROR) {
            return res.send({ Success: false, error: `${error.name}: ${error.message}`})
        }

        return res.send({ Success: false, Error: `An error has ocurred.`})
    }
})

export default router;