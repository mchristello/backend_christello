import fs from 'fs';
import { productManager } from '../Managers/index.js';
import { NoStockError, NotFoundError } from '../utils/errorUtils.js';


export class CartManager {

    constructor(path) {
        this.path = path;
    }

    #read = () => {
        try {
            if (fs.existsSync(this.path)) {
                return fs.promises.readFile(this.path, 'utf8')
                    .then((data) => JSON.parse(data))
            }
            return JSON.stringify([]);
        } catch (error) {
            console.log(error);
        }
    }

    #write = (info) => {
        return fs.promises.writeFile(this.path, JSON.stringify(info, null, 3));
    }

    allCarts = async () => {
        const data = await this.#read();
        return data;
    }
    
    getCartById = async (cartId) => {
        const database = await this.allCarts();
        const serchedCart = database.find((cart) => cart.id === cartId);

        return serchedCart !== undefined ? serchedCart : `There's no cart matching the id ${cartId}. Please, check again.`
    }
    
    createCart = async () => {
        const database = await this.allCarts();
        const id = await this.cartId();

        // Se crea el carrito con Id y array de productos
        const createdCart = {
            id: id,
            products: []
        }

        database.push(createdCart);

        await this.#write(database)
    }

    addProductToCart = async (cartId, productId) => {
        const allCarts = await this.allCarts();
        const searchedCart = allCarts.find(c => c.id === cartId)

        if (searchedCart === undefined) {
            throw new NotFoundError(`There has been an error with the Cart ID, please check.`)
        }

        // Checkeamos el id del producto para comprobar que exista 
        const searchedProduct = await productManager.getProducts();
        const chosenProduct = searchedProduct.find(p => p.id === productId);
        console.log(`This is  chosenProduct from addProductToCart:`, chosenProduct);

        if(!chosenProduct) {
            throw new NotFoundError(`There has been an error with the Product ID, please check.`)
        }

        // Buscamos si el producto ya se encuentra en el carrito
        const searchDuplicate = searchedCart.products.find(p => p.id === productId);
        console.log(`This is searchDuplicate from addProductToCart:`, searchDuplicate);

        if(searchDuplicate !== undefined) {
            if(chosenProduct.stock > 0){
                searchDuplicate.quantity++;
                chosenProduct.stock--;
    
                // Agregar updateProduct para impactar cambio en stock
                productManager.updateProduct(chosenProduct);
                
                await this.#write(allCarts)
    
                return searchedCart;
            }
            throw new NoStockError(`We have no stock left of the product you wanted.`)
        }

        // Agregamos el producto al carrito, solo id y cantidad
        searchedCart.products.push({
            id: chosenProduct.id,
            quantity: 1
        })

        chosenProduct.stock--;
        productManager.updateProduct(chosenProduct);

        await this.#write(allCarts)

        return searchedCart;
    }

    cartId = async () => {
        const database = await this.allCarts();
        const count = database.length;

        return (count > 0) ? database[count-1].id +1 : 1
    }

}