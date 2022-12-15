import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import productRouter from './routers/product.router.js';
import cartRouter from './routers/cart.router.js';
import viewsRouter from './routers/views.router.js';
import { Server } from 'socket.io';


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


io.sockets.on('connection', (socket) => {
    console.log(`New client connected`, socket.id);

    socket.on('message', data => {
        console.log(`From Client:`, data);
    })

    socket.on('getProducts', data => {
        console.log(data);
    })
})