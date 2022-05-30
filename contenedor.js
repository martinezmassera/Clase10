const fs = require('fs')
let countId = 1
class Contenedor {
    constructor(archivo) {
        this.archivo = archivo
        this.productos = []
    }

    async leer() {
        try {
            const datos = await fs.promises.readFile(this.archivo)
            const datosParse = JSON.parse(datos)
            this.productos = datosParse
            return this.productos
        } catch (error) {
            return { error: 'archivo no encontrado' }
        }
    }

    async write() {
        const stringProd = JSON.stringify(this.productos)
        await fs.promises.writeFile(this.archivo, stringProd)
    }

    async getId(id) {
        try {
            const leer = await this.leer()
            const item = leer.find(i => i.id == id)
            console.log(item)
            if (!item) {
                return { error: 'producto no encontrado' }
            } else {
                return item
            }
        } catch (error) {
            return { error: 'producto no encontrado' }
        }
    }

    countId() {

        const id = countId++;
        return id
    }

    async addItem(body) {
        const id = this.countId()
        body['id'] = id
        this.productos.push(body)
        console.log(body)
        await this.write()
    }

    async addItemForm(title, price, thumbnail) {
        const id = this.countId()
        this.productos.push({ "title": title, "price": price, "thumbnail": thumbnail,"id": id })
        console.log(this.productos)
        await this.write()

    }




    async deleteById(number) {
        try {
            const index = this.productos.findIndex((item) => item.id == number)
            if (index != -1) {
                this.productos.splice(index, 1)
                await this.write()
            }
         
        }
        catch (error) {
            return { error: 'producto no encontrado' }
        }
    }

    async editById(number, body) {
        const aEditar = [...this.productos]
        try {
            const index = this.productos.findIndex((item) => item.id == number)
            aEditar[index] = { ...aEditar[index], ...body }
            this.productos = aEditar
            console.log(this.productos)
            await this.write()
        } catch (error) {
            return { error: 'producto no encontrado' }
        }
    }
}

module.exports = Contenedor