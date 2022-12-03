const ProductManager = require('./app.js')

const manager = new ProductManager()


const tester = async () => {

    // console.log(await manager.getProducts());

    // await manager.updateProduct(1, { title: "NOX",
    // description: "AT10 18k - Hard",
    // price: 60500,
    // thumbnail: "/img/AT10_18k.webp",
    // code: 2023,
    // stock: 10});

    // console.log(await manager.getProducts());

    // console.log(await manager.getProductById(1));

    // console.log(await manager.getProductByTitle('HeAd'));

    // console.log(await manager.getProductByPrice(50000));
}

tester();