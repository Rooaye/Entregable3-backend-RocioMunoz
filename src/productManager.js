const { promises: fs } = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async addProduct(product) {
        const { title, description, price, thumbnail, code, stock } = product;
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error('Todos los campos son obligatorios.');
        }
        const products = await this.getProducts();
        if (products.some((p) => p.code === code)) {
            console.log(`Ya se encuentra agregado el código: ${code}`);
        } else {
            const id = this.creoID();
            const newProduct = { id, title, description, price, thumbnail, code, stock };
            products.push(newProduct);
            await this.saveJSONToFile(products);
        }
    }

    creoID = () => parseInt(Math.random() * 100000);

    async getProducts() {
        return await this.getJSONFromFile(this.path);
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const index = products.findIndex((p) => p.id === id);
        if (index > -1) {
            products.splice(index, 1);
            await this.saveJSONToFile(products);
            console.log("producto borrado");
        } else {
            console.log('no se ha podido borrar el producto');
        }
    }

    async getProductById(id) {
        const products = await this.getProducts();
        const product = products.find((p) => p.id === id);
        if (!product) {
            console.log("producto no encontrado");
        } else {
            console.log("producto encontrado", product);
        }
    }

    async updateProduct(id, newTitle, newDescription, newPrice, newThumbnail, newCode, newStock) {
        const products = await this.getProducts();
        const productIndex = products.findIndex((p) => p.id === id);
        if (productIndex === -1) {
            console.log(`producto no encontrado, id: ${id}`);
        } else {
            products[productIndex] = {
                id,
                title: newTitle,
                description: newDescription,
                price: newPrice,
                thumbnail: newThumbnail,
                code: newCode,
                stock: newStock
            };
            await this.saveJSONToFile(products);
            console.log("producto actualizado correctamente", products[productIndex]);
        }
    }

    async saveJSONToFile(data) {
        const content = JSON.stringify(data, null, '\t');
        try {
            await fs.writeFile(this.path, content, 'utf-8');
        } catch (error) {
            throw new Error(`El archivo ${this.path} no pudo ser escrito.`);
        }
    }

    async getJSONFromFile(path) {
        try {
            await fs.access(path);
        } catch (error) {
            return [];
        }
        const content = await fs.readFile(path, 'utf-8');
        try {
            return JSON.parse(content);
        } catch (error) {
            throw new Error(`El archivo ${path} no tiene un formato JSON válido.`);
        }
    }
}

module.exports = ProductManager


const desafio = async () => {
    try {
        const productManager = new ProductManager("./products.json");
        await productManager.addProduct({
            title: "producto prueba",
            description: "Este es un producto prueba",
            price: 200,
            thumbnail: "sin imagen",
            code: "abc123",
            stock: 25
        });
        const products = await productManager.getProducts();
        console.log("getProducts", 'Acá los productos:', products);
        await productManager.getProductById(products[0].id); 
        await productManager.updateProduct(products[0].id, "Actualizado", "Actualizado", 300, "Actualizado", "Actualizado", 10); 
        await productManager.deleteProduct(products[0].id); 
    } catch (error) {
        console.error('Ha ocurrido un error: ', error.message);
    }
};

desafio();


