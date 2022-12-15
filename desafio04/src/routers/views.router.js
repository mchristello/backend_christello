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

        if (!products) {
            return res.send({ Succes: false, Message: "There are no products available" });
        }
    
        const { limit } = req.query;

        if(!limit || limit < 0) {
            res.render('home', {
                user: user,
                style: 'style.css',
                isLogged: user.status === true,
                products,
            })
        }

        const limitedProducts = products.slice(0, limit);

        res.render("home", {
            style: "style.css",
            products: limitedProducts,
        });
        
    } catch (error) {
        console.log(error);
    }
})

// Ruta para uso de Socket - realTimeProducts
// GET
router.get("/realTimeProducts", async (req, res) => {
    // try {
        const products = await productManager.getProducts();
        const user = {
            name: 'Matias',
            lastname: 'Chirstello', 
            status: true
        }
        req.io.emit('getProducts', products);

            return res.render("realTimeProducts", {
                user: user,
                isLogged: user.status === true,
                style: "style.css",
                products
            });
        
    //     if (!products) {
    //         return res.send({ Succes: false, Error: "There aren't any products to show." });
    //     }

    //     const { limit } = req.query;

    //     if (!limit || limit < 0) {
    //         req.io.emit('products', products);

    //         return res.render("realTimeProducts", {
    //             user: user,
    //             isLogged: user.status === true,
    //             style: "style.css",
    //             products
    //         });
    //     }

    //     const filteredProducts = products.slice(0, limit);

    //     req.io.emit("products", filteredProducts);

    //     res.render("realTimeProducts", {
    //         style: "style.css",
    //     });
    // } catch (error) {
    //     console.log(error);

    //     res.send({ Succes: false, error: "An unexpected error has ocurred" });
    // }
});

router.post("/realTimeProducts", async (req, res) => {
    try {
        const newProduct = req.body;

        await productManager.addProduct({ ...newProduct });

        const products = await productManager.getProducts();

        req.io.emit("addProduct", products);

        res.send({ Succes: true, New_Product: newProduct })

    } catch (error) {
        console.log(error);

        if (error.name === ERRORS.VALIDATION_ERROR) {
            return res.send({Succes: false, error: `${error.name}: ${error.message}` });
        }

        res.send({ Succes: false, error: "An unexpected error has ocurred" });
    }
});

router.delete("/realTimeProducts/:pid", async (req, res) => {
    try {
        const { pid } = req.params;

        const id = Number(pid);

        if (Number.isNaN(id) || id < 0) {
        return res.send({ Succes: false, error: "Invalid product ID"})
        }

        const deletedProduct = await productManager.deleteProduct(id);

        const products = await productManager.getProducts();

        const io = req.io;

        io.emit("deletedProduct", products);

        res.send(console.log({ Succes: true, deleted_product: deletedProduct }));
    } catch (error) {
        console.log(error);

        if (error.name === ERRORS.NOT_FOUND_ERROR) {
        return res.send({ Succes: false, error: `${error.name}: ${error.message}` });
        }

        res.send({ Succes: false, error: "An unexpected error has ocurred" });
    }
});









export default router