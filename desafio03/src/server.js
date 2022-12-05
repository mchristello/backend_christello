const ProductManager = require('./app');
const express = require('express');


const app = express();
const PORT = 8080;
const manager = new ProductManager()

app.use(express.urlencoded({extended: true}));

// Todos los productos
app.get('/products', async (req, res) => {
    const db = await manager.getProducts(); 
    const limit = Number(req.query.limit);
    if(limit){
        const reqLimit = db.slice(0, limit);
        res.send({reqLimit});
    } else {
        res.send({db});
    }
})

// Productos por ID
app.get('/products/:pid', async (req, res) => {
    const db = await manager.getProducts();
    const { pid } = req.params;
    const reqId = db.find((product) => product.id === Number(pid));

    if (!reqId) {
        return res.send(`<h2 style="text-align:center; margin-top:10rem; color:red;"><u>The product you searched was not found in our Database</u></h2>`);
    } else {
        // const productById = await manager.getProductById(Number(pid));
        res.send({reqId})
    }
})

// Productos por title
app.get('/products/title/:title', async (req, res) => {
    const db = await manager.getProducts();
    const { title } = req.params;
    const reqTitle = db.filter((product) => product.title.toLowerCase() === title.toLowerCase());

    if(reqTitle.length > 0) {
        // const productByTitle = await manager.getProductByTitle(reqTitle);
        return res.send({reqTitle});
    } else {
        return res.send(`<h2 style="text-align:center; margin-top:10rem; color:red;"><u>The brand you searched was not found in our Database</u></h2>`);
    }
})


// POST 
app.post('/products', async (req, res) => {

})



// Se escucha el puerto e imprime mensaje por consola de que el puerto está funcionando
app.listen(PORT, () => {
    console.log(`Server up & running in ${PORT}`);
})

