const express= require('express');
const ProductManager = require("./productManager") 
const productsJSON = require("./products.json") 
const productManager = new  ProductManager(productsJSON);
const products = productsJSON
const app = express();

app.use(express.urlencoded({ extended: true }));

app.get("/products", (req, res) => {  
    const {limit} = req.query
    const isLimit = limit && (limit <= 5)
    if (isLimit) {
        prod = products.slice(6)
        res.send({prod}) 
    }else{
        res.send({products})
    }
});

app.get("/products/:prodId", (req, res) => {
    const { prodId } = req.params
    const product = products.find((p) => p.id === parseInt(prodId))
    if (!product) {
        res.send({error:"Producto no encontrado"})
    } else {
        res.send({product})
    }
});

app.listen(8080, () =>{
    console.log("servidor escuchando desde el puerto 8080")
});