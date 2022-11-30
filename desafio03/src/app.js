const fs = require('fs');


class ProductManager {
    constructor() {
        this.path = './database.json'
    }

    
    getProducts = async () => {
        try {
            const resolve = await fs.promises.readFile(this.path, "utf-8");
            const resolveObj = JSON.parse(resolve)
            if (resolveObj.length === 0) throw new Error();
            return resolveObj;
        } catch {
            await fs.promises.writeFile(this.path, JSON.stringify([]));
            const resolve = await fs.promises.readFile(this.path, "utf-8");
            return resolve;
        }
    }
    
    addProduct = async (title, description, price, thumbnail, code, stock) => {
        const id = await this.getNextId()
        .then((id) => id)
        const product = {
            id: id,
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock
        }
        const db = await fs.promises.readFile(this.path, 'utf-8');
        const dbObj = JSON.parse(db);
        dbObj.push(product);
        if (!this.inputsCheck({ ...product })) {
            console.error(`There's some input missing for ${product.title}, please check again.`);
        }
        const codeCheck = await this.checkProductCode(product.id)
        if (codeCheck) {
            console.log(`The product ${product.title} it's already in the array.`);
        }
        await fs.promises.writeFile(this.path, JSON.stringify(dbObj));
        console.log(`The product ${product.title} has been added to the database`);
    }

    updateProduct = async (productId, changes) => {
        const databaseJson = await fs.promises.readFile(this.path, "utf-8");
        const databaseObj = JSON.parse(databaseJson);
        const productToUpdate = databaseObj.find((product) => product.id === productId);
        const productSearch = databaseObj.filter((product) => product.id !== productId);
        const productWithChanges = { id: productToUpdate.id, ...changes };
        filteredProducts.push(productWithChanges);
        await fs.promises.writeFile(this.path, JSON.stringify(productSearch));
    };

    deleteProduct = async (productId) => {
            const databaseJson = await fs.promises.readFile(this.path, "utf-8");
            const databaseObj = JSON.parse(databaseJson);
            const productSearched = databaseObj.filter((product) => product.id !== productId);
            await fs.promises.writeFile(this.path, JSON.stringify(productSearched));
    };
    
    getNextId = async() => {
        const databaseJson = await fs.promises.readFile(this.path, 'utf-8');
        const databaseObj = JSON.parse(databaseJson);
        const index = databaseObj.length;
        const id = index !== undefined ? index + 1 : 1;
        return id;
    }

    inputsCheck = ({title, description, price, thumbnail, code, stock}) => {
        return (
            title.trim().length > 0 &&
            description.trim().length > 0 &&
            thumbnail.trim().length > 0 &&
            code.trim().length > 0 &&
            price.toString().trim().length > 0 &&
            stock.toString().trim().length > 0 &&
            price > 0 &&
            stock > 0
        );
    }

    checkProductCode = async(productCode) => {
        const databaseJson = await fs.promises.readFile(this.path, 'utf-8');
        const databaseObj = JSON.parse(databaseJson);
        const checkCode = databaseObj.some((product) => product.code === productCode);
        return checkCode;
    }

    getProductById = async (productId) => {
            const databaseJson = await fs.promises.readFile(this.path, "utf-8");
            const databaseObj = JSON.parse(databaseJson);
            const productSearch = databaseObj.find((product) => product.id === productId);
            return productSearch !== undefined ? productSearch : console.log(`The product you're looking for is not in the database`);
    };

    getProductBytitle = async (title) => {
        const databaseJson = await fs.promises.readFile(this.path, "utf-8");
        const databaseObj = JSON.parse(databaseJson);
        const productSearched = databaseObj.filter((product) => product.title.toLowerCase() === title.toLowerCase());
        return productSearched.length > 0 ? productSearched : console.log(`The brand you're looking for is not in the database`);
    }

    getProductByPrice = async (price) => {
        const databaseJson = await fs.promises.readFile(this.path, "utf-8");
        const databaseObj = JSON.parse(databaseJson);
        const filteredPrice = databaseObj.filter((products) => products.price <= price);
        return filteredPrice.length > 0 ? filteredPrice : console.log(`There is no product matching the price you're looking for`);
    }

}

module.exports = { ProductManager };

const tester = new ProductManager();

// tester.getProductBytitle('hEaD')
//     .then((product) => {
//         console.log(product);
//     })

// tester.getProductByPrice(170000)
//     .then((product) => {
//         console.log(product);
//     })