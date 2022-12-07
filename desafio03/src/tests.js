// const ProductManager = require('./Managers/ProducManager.js')

import { productManager } from "./Managers/index.js";

// const manager = productManager(',,/src/db/database.json')


const tester = async () => {
    await manager.addProduct2({
        title: 'Head Desta Motion',
        description: 'La pala de Paula Josemaría',
        price: 119000
    });
    
    const toModify = {        
        title: 'Bullpadel VertexCMF',
        description: 'La pala de Martin Di Nenno',
        price: 109000
    }
    
    await manager.updateProduct(1, toModify)

    console.log(await manager.getProductByTitle('head'));

    console.log(await productManager.getProducts());
}

// tester();