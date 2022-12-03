const fs = require('fs');


class ProductManager {
    constructor() {
        this.path = './database.json'
    }

    read = () => {
        if (fs.existsSync(this.path)) {
            return fs.promises.readFile(this.path, 'utf-8')
                .then((result) => JSON.parse(result))
        }
        return [];
    }

    write = (products) => {
        return fs.promises.writeFile(this.path, JSON.stringify(products));
    }
    
    getProducts = async () => {
        const db = await this.read();
        return db;
    }

    getNextId = (array) => {
        const id = array.length;
        const nextID = id + 1;
        console.log(nextID);
        return (id > 0) ? array.id = nextID : 1
    }
    
    addProduct = async (product) => {
        const db = await this.read();
        const id = await this.getNextId(db);
        product.id = id;

        db.push(product);

        await this.write(db)
        console.log(`The product ${product.title} has been added to the database`);
    }

    updateProduct = async (productId, obj) => {
        const db = await this.read();

        const productToUpdate = db.find((product) => product.id === productId);
        const productSearch = db.filter((product) => product.id !== productId);
        const productWithChanges = { id: productToUpdate.id, ...obj };

        productSearch.push(productWithChanges);

        await this.write(productSearch)
    };

    deleteProduct = async (productId) => {
        const db = await this.read();

        const productSearched = db.filter((product) => product.id !== productId);

        await this.write(productSearched);
    };

    getProductById = async (productId) => {
        const db = await this.read();

        const productSearch = db.find((product) => product.id === productId);

        return productSearch !== undefined ? productSearch : `The product you're looking for is not in the database`;
    };

    getProductByTitle = async (title) => {
        const db = await this.read();

        const productSearched = db.filter((product) => product.title.toLowerCase() === title.toLowerCase());

        return productSearched.length > 0 ? productSearched : `The brand you're looking for is not in the database`;
    }

    getProductByPrice = async (price) => {
        const db = await this.read();

        const filteredPrice = db.filter((products) => products.price <= price);

        return filteredPrice.length > 0 ? filteredPrice : `There is no product matching the price you're looking for`;
    }

}

module.exports = ProductManager;