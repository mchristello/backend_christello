
const socket = io()

// Almacenamos productos en array del dalo del front
let products = [];

// DOM
let cardContainer = document.getElementById('card__container');

// Sockets del lado del front para generar los productos en tiempo real.
    socket.emit('message', `Esto viene desde el front`)

    socket.on('message', data =>{
        console.log(data);
    })

    // Socket que recibre productos y actualiza el front
    socket.on('getProducts', (productsFromBack) => {
        let cardContainer = document.getElementById('card__container');

        let card = document.createElement('div')
        card.setAttribute(`class`, `cards`)
        
        cardContainer.innerHTML = '';

        productsFromBack.map((p) => {
            card.innerHTML += `<div class="card__item-socket">
                                    <img class="card__img" src="${p.thumbnail}">
                                    <hr>
                                    <div class="card__body">
                                        <p>${p.title} (ID: ${p.id})</p>
                                        <p><b>${p.description}</b></p>
                                        <p>Price: <i>${p.price}</i></p>
                                        <p>Stock Available: ${p.stock}</p>
                                    </div>
                                </div>`;
            cardContainer.appendChild(card);
        })
    })

    // Enviar productos para hacer un POST
    // Elementos del DOM
    let btnNewProduct = document.getElementById('btn_new-product');
    let sectionNewProduct = document.getElementById('new_product');
    let form = document.createElement('form');
    form.setAttribute('class', 'new_product-form');
    form.setAttribute('action', '/api/products');
    form.setAttribute('method', 'POST');

    let sendBtn = document.getElementById('send-btn')

    // Evento que mostrar el formulario
    btnNewProduct.addEventListener('click', () =>{
        form.innerHTML = `
                            <input type="text" name="title" placeholder="Titulo" />
                            <input type="text" name="description" placeholder="Description" />
                            <input type="number" name="price" placeholder="Price" />
                            <input type="text" name="category" placeholder="Category" />
                            <input type="text" name="code" placeholder="Code" />
                            <input type="number" name="stock" placeholder="Stock" />
                            <input type="url" name="thumbnail" placeholder="Img Url" />
                            <button class="send-btn" id="send-btn" >Send New Prod</button>
                            `;

        sectionNewProduct.appendChild(form);
    });

    sendBtn.addEventListener('click', (e) => {
        // Cancelamos evento para que se actualice la página al enviar form
        e.preventDefault();

        // Guardamos los datos del formulario
        const formData = new FormData(form);

        const newProduct = {};

        for(const inputField in formData.entries()){
            newProduct[inputField[0]] = field[1];
        }

        socket.emit('addProduct', newProduct);
    })