import express from 'express';
import productRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';

const app = express();
const PORT = 8080;

// Se escucha el puerto e imprime mensaje por consola de que el puerto está funcionando
app.listen(PORT, () => {
    console.log(`Server up & running in ${PORT}`);
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static('./public'))

app.use('/api/products/', productRouter);
// app.use('/api/products/:pid', productRouter)
// app.use('/api/products/title/:title', productRouter)


app.use('/api/carts', cartRouter)