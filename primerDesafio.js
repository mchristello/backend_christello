

class ProductManager {

    constructor() {
        this.products = [];
    }

    getNextId = () => {
        const index = this.products.length;
        const id = index > 0 ? index + 1 : 1;
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

    checkProductCode = (productCode) => {
        const checkCode = this.products.some(
            (product) => product.code === productCode
        );
        return checkCode;
    }

    addProduct = (title, description, price, thumbnail, code, stock) => {
        const product = {
            id: this.getNextId(),
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock
        }
        if (this.checkProductCode(product.code)) {
            console.error(`The product ${product.code} it's in the array.`);
            return;
        }
        if (!this.inputsCheck({ ...product })) {
            console.error(`There's some input missing for ${product.title}, please check again.`);
        } else {
            this.products.push(product);
            console.log(`The product ${product.title} has been added succesfully.`);
        }
    }

    getProducts = () => {
        return this.products;
    }

    getProductById = (id) => {
        const productsCopy = [...this.products];
        const productSearched = productsCopy.find((product) => product.id === id);
        productSearched ? console.log(productSearched) : console.error(`Product: ${id} NOT FOUND`);
    }

    validateInputs = ({ title, description, price, thumbnail, code, stock }) => {
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
    };

}



// Prueba
const testCheck = new ProductManager();

console.log(testCheck.getProducts());
testCheck.addProduct(
    'producto de prueba',
    'este es un producto de prueba',
    200,
    'Sin imágen',
    'abc123',
    25
)
console.log(testCheck.getProducts());
testCheck.addProduct(
    'producto de prueba',
    'este es un producto de prueba',
    200,
    'Sin imágen',
    'abc123',
    25
)
console.log(testCheck.getProducts());

testCheck.getProductById(2)

// console.log("Productos en la base de datos:", testCheck.getProducts());
// console.log("--------------------------------------------------------");
// testCheck.addProduct(
//     "Test",
//     "This is a test Product",
//     200,
//     "No pict",
//     "AS1324987",
//     2
// );
// testCheck.addProduct(
//     'Pala Nox',
//     'AT10 Luxury Genius Arena',
//     95500,
//     'no picture',
//     'AT1095JFzz',
//     4
// );
// console.log("--------------------------------------------------------");
// console.log("Productos en la base de datos:", testCheck.getProducts());
// console.log("--------------------------------------------------------");
// // Se agrega un producto pero sin precio, lo cual debería dar error.
// testCheck.addProduct(
//     "Pala Bullpadel", 
//     "Vertex03", 
//     "", 
//     "Sin imagen", 
//     "BULLVER030023", 
//     5
// );
// console.log("Productos en la base de datos:", testCheck.getProducts());
// console.log("--------------------------------------------------------");
// testCheck.addProduct(
//     "Pala Babolat", 
//     "Technical Viper", 
//     120000, 
//     "Sin imagen", 
//     "TECHVIP0023", 
//     8
// );
// console.log("--------------------------------------------------------");
// console.log("Productos en la base de datos:", testCheck.getProducts());
// console.log("--------------------------------------------------------");
// testCheck.getProductById(45);
// console.log("--------------------------------------------------------");
// testCheck.getProductById(2)