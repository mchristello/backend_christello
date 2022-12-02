const fs = require('fs');


class ProductManager {
    constructor() {
        this.path = './database2.json'
    }

    read = () => {
        if (fs.existsSync(this.path)) {
            return fs.promises.readFile(this.path, 'utf-8')
                .then(result => JSON.parse(result))
        }
        return []
    }

    write = (list) => {
        return fs.promises.writeFile(this.path, JSON.stringify(list));
    }
    
    getProducts = async () => {
        const database = await this.read()
        return database;
        
        // try {
        //     const resolve = await this.read()
        //     const resolveObj = JSON.parse(resolve)
        //     if (resolveObj.length === 0) throw new Error();
        //     return resolveObj;
        // } catch {
        //     await fs.promises.writeFile(this.path, JSON.stringify([]));
        //     const resolve = await fs.promises.readFile(this.path, "utf-8");
        //     return resolve;
        // }
    }
    
    // addProduct = async (title, description, price, thumbnail, code, stock) => {
    //     const db = this.read();
    //     const id = await this.getNextID(db)
    //     const product = {
    //         id: id,
    //         title: title,
    //         description: description,
    //         price: price,
    //         thumbnail: thumbnail,
    //         code: code,
    //         stock: stock
    //     }
    //     db.push(product)
    //     if (!this.inputsCheck({ ...product })) {
    //         console.error(`There's some input missing for ${product.title}, please check again.`);
    //     }
    //     const codeCheck = await this.checkProductCode(product.id)
    //     if (codeCheck) {
    //         console.log(`The product ${product.title} it's already in the array.`);
    //     }
    //     await this.write(db)
    //     console.log(`The product ${product.title} has been added to the database`);
    // }

    addProduct2 = async (product) => {
        const list = await this.read();
        const id = this.getNextID(list);
        product.id = id;

        list.push(product)

        await this.write(list)
    }

    updateProduct = async (id, obj) => {
        const db = await this.read();
        const productToUpdate = db.find((product) => product.id === id);
        const productSearch = db.filter((product) => product.id !== id);
        const productWithChanges = { id: productToUpdate.id, ...obj };
        productSearch.push(productWithChanges);

        await this.write(productSearch)
    };

    deleteProduct = async (productId) => {
        const db = await this.read();
        const productSearched = db.filter((product) => product.id !== productId);
        await this.write(productSearched);
    };
    
    // getNextId = async() => {
    //     const db = await this.read();
    //     const databaseObj = JSON.parse(db);
    //     const index = databaseObj.length;
    //     const id = index !== undefined ? index + 1 : 1;
    //     return id;
    // }

    getNextID = (list) => { 
        const count = list.length
        return (count > 0) ? list[count-1].id +1 : 1 
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
        const db = await this.read();
        const databaseObj = JSON.parse(db);
        const checkCode = databaseObj.some((product) => product.code === productCode);
        return checkCode;
    }

    getProductById = async (productId) => {
        const db = await this.read();
        const databaseObj = JSON.parse(db);
        const productSearch = databaseObj.find((product) => product.id === productId);
        return productSearch !== undefined ? productSearch : console.log(`The product you're looking for is not in the database`);
    };

    getProductByTitle = async (title) => {
        const db = await this.read();
        const databaseObj = JSON.parse(db);
        const productSearched = databaseObj.filter((product) => product.title === title);
        return productSearched.length > 0 ? productSearched : console.log(`The brand you're looking for is not in the database`);
    }

    getProductByPrice = async (price) => {
        const db = await this.read();
        const databaseObj = JSON.parse(db);
        const filteredPrice = databaseObj.filter((products) => products.price <= price);
        return filteredPrice.length > 0 ? filteredPrice : console.log(`There is no product matching the price you're looking for`);
    }

}

module.exports = ProductManager;