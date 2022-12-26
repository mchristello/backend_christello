const socket = io();


console.log(`Esto es desde el index.js que maneja el Front`);

socket.on('getProducts', (products) => {
    console.log(products);
    
})