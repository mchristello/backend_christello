// Se llama al File System
const fs = require('fs');


// Se una el ProductManager del desafío anterior
class ProductManager {

    constructor() {
        this.path = './database.json'
    }

    getNextId = async() => {
        const databaseJson = await fs.promises.readFile(this.path, 'utf-8');
        const databaseObj = JSON.parse(databaseJson);
        const index = databaseObj.length;
        const id = index === undefined ? index + 1 : 1;
        return id;
    }

    // Validación de inputs se mantiene igual.
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

    // Function para checkear el código de los productos
    checkProductCode = async(productCode) => {
        const databaseJson = await fs.promises.readFile(this.path, 'utf-8');
        const databaseObj = JSON.parse(databaseJson);
        const checkCode = databaseObj.some((product) => product.code === productCode);
        return checkCode;
    }

    // Function para agregar los productos
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
        if (!this.inputsCheck({ ...product })) {
            console.error(`There's some input missing for ${product.title}, please check again.`);
        }
        const codeCheck = await this.checkProductCode(product.id)
        if (codeCheck) {
            console.log(`The product ${product.title} it's already in the array.`);
        }
        await fs.promises.writeFile(this.path, JSON.stringify([ product ]));
        console.log(`The product ${product.title} has been added to the database.`);
    }

    // Function para traer los productos desde database
    getProducts = async () => {
        try {
            const resolve = await fs.promises.readFile(this.path, "utf-8");
            if (resolve.length === 0) throw new Error();
            return resolve;
        } catch {
            await fs.promises.writeFile(this.path, JSON.stringify([]));
            const resolve = await fs.promises.readFile(this.path, "utf-8");
            return resolve;
        }
    }

    // Function buscar los productos mediante el ID
    getProductById = async (productId) => {
            const databaseJson = await fs.promises.readFile(this.path, "utf-8");
            const databaseObj = JSON.parse(databaseJson);
            const productSearch = databaseObj.find((product) => product.id === productId);
            return productSearch !== undefined ? productSearch : console.log(`The product ${product.title} is not in the database`);
    };

    // Nueva function para actualizar la propiedades del produccto, sin modificar el ID
    updateProduct = async (productId, changes) => {
            const databaseJson = await fs.promises.readFile(this.path, "utf-8");
            const databaseObj = JSON.parse(databaseJson);
            const productToUpdate = databaseObj.find((product) => product.id === productId);
            const productSearch = databaseObj.filter((product) => product.id !== productId);
            const productWithChanges = { id: productToUpdate.id, ...changes };
            filteredProducts.push(productWithChanges);
            await fs.promises.writeFile(this.path, JSON.stringify(productSearch));
    };
    
    // Nueva function para borrar un producto
    deleteProduct = async (productId) => {
            const databaseJson = await fs.promises.readFile(this.path, "utf-8");
            const databaseObj = JSON.parse(databaseJson);
            const productSearched = databaseObj.filter((product) => product.id !== productId);
            await fs.promises.writeFile(this.path, JSON.stringify(productSearched));
    };

}


    // Prueba de Funcionabilidad
    const test = new ProductManager();


    // Se pide que traiga el array de productos

// test.getProducts()
//     .then((products) => {
//         if (products !== undefined) {
//             const result = JSON.parse(products);
//             console.log(result);
//         }
//     });

    
    // Se agrega un nuevo producto

    // test.addProduct(
    //     "NOX AT10 18k",
    //     "La pala de Agustin Tapia",
    //     95000,
    //     "No hay imagen",
    //     "CodigoPrueba",
    //     3
    // );

    // Se vuelve a pedir que traiga el array de productos para comprobar que se haya agregado el paso anterior

    // test.getProducts()
    //  .then((products) => {
    //     const result = JSON.parse(products);
    //     console.log(result);
    // });

    // Se busca el producto por ID

    // test.getProductById(1)
    //  .then((product) => {
    //     console.log(product);
    // });

    // Se hacen cambios en el producto y se muestran por log.

    // const objModified = {
    //     title: "NOX AT10 12k - Blanda",
    //     description: "La pala de Agus Tapia version 12k",
    //     price: 91500,
    //     thumbnail: "No hay imagen",
    //     code: "AT1012K",
    //     stock: 2,
    // };
    // test.updateProduct(1, objModified);

    // Se borra el producto

    // test.deleteProduct(1);