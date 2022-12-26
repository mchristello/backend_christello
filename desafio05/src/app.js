// importar el dirname para las rutas
import __dirname from './dirname.js';
// imports de express y handlebars 
import express from 'express';
import handlebars from 'express-handlebars';
// import socket
import { Server } from 'socket.io';
// import de routers
import viewsRouter from './routers/views.router.js';
// Import de Classes.
import { productManager } from './Managers/index.js';
// Import de Mongoose
import mongoose from 'mongoose';


const app = express();
const PORT = 8080;

const httpServer = app.listen(PORT, console.log(`Server up and running in port ${PORT}`))

const io = new Server(httpServer) // Servidor para socket

// Conectando mongoose
mongoose.connect('mongodb+srv://mchristello:matinho87@codercluster.e396lxc.mongodb.net/?retryWrites=true&w=majority', error => {
    if (error) {
        console.log(`We have a problem trying to access the DB, ${error}`);
        process.exit()
    }
})
mongoose.set('strictQuery', true);


// config de express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Config ruta static 
app.use(express.static(__dirname + '/public'));

// Config handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');


// app.engine(
//     "hbs",
//     handlebars.engine({
//         extname: ".hbs",
//         defaultLayout: "main.hbs",
//     })
// );

// app.use(express.static("public"));

// app.set("view engine", "hbs");
// app.set("views", `${__dirname}/views`);






// RUTAS PARA Server
// Products
// app.use('/api/products', productsRouter);

// Cart 
// app.use('/api/carts', cartRouter);

// Views
app.use('/', viewsRouter);



// Inicialize io Server
io.on('connection', async (socket) => {
    console.log(`A new client has connected`);

    const products = await productManager.getProducts();
    socket.emit('getProducts', products)
})