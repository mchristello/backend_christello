// const fs = require('fs');

import fs from 'fs';
import { NotFoundError, ValidationError } from '../utils/index.js';


export class ProductManager {

    constructor(path) {
        this.path = path;
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
    }
    
    addProduct2 = async (product) => {
        const list = await this.read();

        const checkCode = await this.checkCode(product.code)
        if (checkCode) {
            throw new ValidationError(`The product code ${product.code} already exists`)
        }

        const id = this.getNextID(list);
        product.id = id;

        list.push(product)

        await this.write(list)
    }

    updateProduct = async (obj) => {
        const db = await this.read();

        const productToUpdate = db.find((product) => product.id === obj.id);
        if(!productToUpdate){
            throw new NotFoundError(`The product ${obj.title} ${obj.description} is not in our database`)
        }
        const productSearch = db.filter((product) => product.id !== obj.id);

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

        const checkCode = db.some((product) => product.code === productCode);

        return checkCode;
    }

    getProductById = async (productId) => {
        const db = await this.read();

        const productSearch = db.find((product) => product.id === productId);

        return productSearch !== undefined ? productSearch : `The product you're looking for is not in the database`;
    };

    getProductByTitle = async (title) => {
        const db = await this.read();

        const productSearched = db.filter((products) => products.title.toLowerCase() === title);

        return productSearched != undefined ? productSearched : `The brand you're looking for is not in the database`;
    }

    getProductByPrice = async (price) => {
        const db = await this.read();

        const filteredPrice = db.filter((products) => products.price <= price);

        return filteredPrice.length > 0 ? filteredPrice : `There is no product matching the price you're looking for`;
    }

}
