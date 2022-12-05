const ProductManager = require('./app.js')

const manager = new ProductManager()


const tester = async () => {
    // await manager.addProduct2({
    //     title: 'Head Desta Motion',
    //     description: 'La pala de Paula Josemaría',
    //     price: 119000
    // });
    
    // const toModify = {        
    //     title: 'Bullpadel VertexCMF',
    //     description: 'La pala de Martin Di Nenno',
    //     price: 109000
    // }
    
    // await manager.updateProduct(1, toModify)

    console.log(await manager.getProductByTitle('head'));

    // console.log(await manager.getProducts());
}

tester();