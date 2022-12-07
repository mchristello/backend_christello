import fs from 'fs';
import { MissingInputsError, NotFoundError, ValidationError } from '../utils/index.js';


export class ProductManager {

    constructor(path) {
        this.path = path;
        this.#read()
    }

    #read = () => {
        if (fs.existsSync(this.path)) {
            return fs.promises.readFile(this.path, 'utf-8')
                .then(result => JSON.parse(result))
        }
        return []
    }

    #write = (list) => {
        return fs.promises.writeFile(this.path, JSON.stringify(list, null, 3));
    }
    
    getProducts = async () => {
        const database = await this.#read()
        return database;
    }
    
    addProduct = async ({ title, description, category, price, code, stock }) => {
        const id = await this.getNextID();

        const newProduct = {
            id: id, 
            title: title,
            description: description,
            category: category,
            price: price,
            code: code,
            status: true,
            stock: stock
        }

        const inputsCheck = await this.inputsCheck({...newProduct})
        if (!inputsCheck){
            throw new MissingInputsError(`There is/are some input fields missing`)
        }

        const checkCode = await this.checkProductCode(newProduct.code)
        if (checkCode) {
            throw new ValidationError(`The product code ${newProduct.code} already exists`)
        }

        const list = await this.getProducts();
        list.push(newProduct)

        await this.#write(list)

        return newProduct;
    }

    updateProduct = async (obj) => {
        const db = await this.getProducts();

        const productToUpdate = db.find((product) => product.id === obj.id);
        if(!productToUpdate){
            throw new NotFoundError(`The product with the ID ${obj.id} is not in our database`)
        }
        const productSearch = db.filter((product) => product.id !== obj.id);

        const productWithChanges = { id: productToUpdate.id, ...obj };
        productSearch.push(productWithChanges);

        await this.#write(productSearch)

        return productWithChanges;
    };

    deleteProduct = async (productId) => {
        const db = await this.getProducts();

        const productSearched = db.filter((product) => product.id !== productId);

        await this.#write(productSearched);
        
    };
    
    getNextID = async () => {
        const database = await this.getProducts();
        const count = database.length;

        return (count > 0) ? database[count-1].id +1 : 1 
    }

    inputsCheck = async ({title, description, price, thumbnail, code, stock}) => {

        return (
            title.trim().length > 0 &&
            description.trim().length > 0 &&
            code.trim().length > 0 &&
            price.toString().trim().length > 0 &&
            stock.toString().trim().length > 0 &&
            price > 0 &&
            stock > 0
        );
    }

    checkProductCode = async(productCode) => {
        const db = await this.getProducts();

        const checkCode = db.some((product) => product.code === productCode);

        return checkCode;
    }

    getProductById = async (productId) => {
        const db = await this.getProducts();

        const productSearch = db.find((product) => product.id === productId);

        return productSearch !== undefined ? productSearch : `The product you're looking for is not in the database`;
    };

    getProductByTitle = async (title) => {
        const db = await this.getProducts();

        const productSearched = db.filter((products) => products.title.toLowerCase() === title);

        return productSearched != undefined ? productSearched : `The brand you're looking for is not in the database`;
    }

    getProductByPrice = async (price) => {
        const db = await this.getProducts();

        const filteredPrice = db.filter((products) => products.price <= price);

        return filteredPrice.length > 0 ? filteredPrice : `There is no product matching the price you're looking for`;
    }

}
