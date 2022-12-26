import mongoose from 'mongoose';

const productCollection = 'products' // Nombre de la colección en la DB

const productSchema = new mongoose.Schema({
    title: String, 
    description: String,
    thumbnail: String,
    category: String,
    price: Number,
    code:{
        type: String,
        unique: true,
    },
    status: Boolean,
    stock: Number,
})

export const productModel = mongoose.model(productCollection, productSchema) // Para importar en el router.