const socket = io()

// DOM
let cardContainer = document.getElementById('card__container');


// Maping de los productos para enviarlos al DOM
function database(data) {
    console.log(data);

    data.forEach((element) => {
        let card = document.createElement('div')
        card.innerHTML += `<div class="card__item" style="background: grey;">
                                <hr>
                                <p>${element.title}</p>
                                <p><b>${element.description}</b></p>
                                <p>Price: <i>${element.price}</i></p>
                                <p>Stock Available: ${element.stock}</p>
                                <hr>
                            </div>`;
        cardContainer.appendChild(card);
    });
}



    socket.emit('message', `Esto viene desde el front`)

    socket.on('getProducts', (productsFromBack) => {
        console.log(`Creando tarjetas para productos`);
        console.log(data);

        database(productsFromBack)
    })
