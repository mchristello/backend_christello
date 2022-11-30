const { ProductManager } = require('./app');
const express = require('express');


const app = express();
const PORT = 8080;
const clase = new ProductManager('./database.json')

app.use(express.urlencoded({extended: true}));

// Todos los productos
app.get('/products', async (req, res) => {
    const db = await clase.getProducts(); 
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
    const db = await clase.getProducts();
    const { pid } = req.params;
    const checkId = db.find((product) => product.id === Number(pid));
    if (!checkId) {
        return res.send(`<h2 style="text-align:center; margin-top:10rem; color:red;"><u>The product you searched was not found in our Database</u></h2>`);
    } else {
        const productById = await clase.getProductById(Number(pid));
        res.send({productById})
    }
})

// Se escucha el puerto e imprime mensaje por consola de que el puerto está funcionando
app.listen(PORT, () => {
    console.log(`Server up & running in ${PORT}`);
})