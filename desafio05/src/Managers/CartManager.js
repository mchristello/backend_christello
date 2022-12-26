import fs from 'fs';
import { NoStockError, NotFoundError } from '../utils/error.utils.js';
import { productManager } from './index.js';


export class CartManager {

    constructor(path){
        this.path = path;
    }

    #read = () => {
        try {
            if(fs.existsSync(this.path)) {
                return fs.promises.readFile(this.path, 'utf8')
                    .then(data => JSON.parse(data))
            }
            return []
        } catch (error) {
            console.log(error);
        }
    }

    #write = (data) => {
        return fs.promises.writeFile(this.path, JSON.stringify(data, null, 3));
    }

    cartId = () => {
        const allCarts = this.allCarts();
        const count = allCarts.length;

        return (count > 0) ? allCarts[count-1].id +1 : 1
    }

    allCarts = async () => {
        const allCarts = await this.#read();
        return allCarts
    }

    getCartById = async (cartId) => {
        const allCarts = await this.allCarts();
        const cartSearched = allCarts.find((c) => c.id === cartId);

        return cartSearched !== undefined ? cartSearched : `There's no cart matching the id ${cartId}. Please, check again.`;
    }

    createCart = async () => {
        const allCarts = await this.allCarts();
        const id = this.cartId();

        const newCart = {
            id: id,
            products: []
        }

        allCarts.push(newCart);

        await this.#write(allCarts)

        return newCart;
    }

    addProductToCart = async (cartId, productId) => {
        const allCarts = await this.allCarts();
        const searchedCart = allCarts.find(c => c.id === cartId);

        if (searchedCart === undefined) {
            throw new NotFoundError(`The Cart with id ${cartId} does not exist in our database, please check again.`)
        }

        // Checkeamos que el producto exista
        const products = await productManager.getProducts();
        const selectedProduct = products.find(p => p.id === productId);

        if(!selectedProduct) {
            throw new NotFoundError(`The Product with id ${productId} does not exist in our database, please check again.`)
        }
        // Checkeamos si el producto ya está en el carrito
        const searchDuplicate = searchedCart.products.find(p => p.id === productId);

        if(searchDuplicate !== undefined) {
            if(selectedProduct.stock > 0) {
                searchDuplicate.quantity++;
                selectedProduct.stock--;

                // Usamos el ProductManager para actulizar el stock del producto elegido
                productManager.updateProduct(selectedProduct);

                await this.#write(allCarts);

                return selectedProduct;
            }
            throw new NoStockError(`We have no stock left of the product you wanted.`)
        }

        // Agregamos el producto al carrito - Solo enviamos id y quantity
        searchedCart.products.push({
            id: selectedProduct.id,
            quantity: 1
        })

        selectedProduct.stock--;
        productManager.updateProduct(selectedProduct);
        
        await this.#write(allCarts);

        return searchedCart

    }
}