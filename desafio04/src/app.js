import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import productRouter from './routers/product.router.js';
import cartRouter from './routers/cart.router.js';
import viewsRouter from './routers/views.router.js';
import { Server } from 'socket.io';
import { productManager } from './Managers/index.js';


const app = express();
const PORT = 8080;

const httpServer = app.listen(8080, () => {
    console.log(`Server up and running on port ${PORT}`);
});

const io = new Server(httpServer) // Se crea el servidor Socket


// Socket por middleware???
app.use((req, res, next) => {
    req.io = io;
    return next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta Static
app.use(express.static(__dirname + '/public'));

// Handlebars 
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// RUTAS
// Products
app.use('/api/products', productRouter);

// Cart
app.use('/api/carts', cartRouter);

// Views
app.use('/', viewsRouter);


io.on('connection', async(socket) => {
    console.log(`New client connected,  ID:`, socket.id);

    socket.on('message', data => {
        console.log(`From Client:`, data);
    })

    socket.emit('message', `Esto viene desde app.js`)

    const products = await productManager.getProducts();

    socket.emit('getProducts', products); // Productos van hacía index.js - socket.on


    socket.on('newProduct', async (product) => {
        console.log(`From newProduct:`, product); // Productos vienen DESDE el front
    })
})