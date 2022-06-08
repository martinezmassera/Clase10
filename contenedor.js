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
            return datosParse
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
            const temp = []
            const leer = await this.leer()
            const item = leer.find(i => i.id == id)
            temp.push(item)
            if (!item) {
                return
            } else {
                return temp
            }
        } catch (error) {
        }
    }

    async countId() {
        const leer = await this.leer()
        if (leer.length < 1) {
            countId = 1
        } else {
            countId++;
        }
        const id = countId;
        return id
    }

    async addItem(body) {
        const id = await this.countId()
        body['id'] = id
        this.productos.push(body)
        console.log(body)
        await this.write()
        return 'Producto Agregad0'
    }

    async addItemForm(title, price, thumbnail) {
        const id = await this.countId()
        this.productos.push({ "title": title, "price": price, "thumbnail": thumbnail, "id": id })
        console.log(this.productos)
        await this.write()
    }

    async deleteById(number) {
        try {
            const index = this.productos.findIndex((item) => item.id == number)
            if (index != -1) {
                this.productos.splice(index, 1)
                await this.write();
                return await this.leer()
            } else {
                return 
            }
        }
        catch (error) {
            return 
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
            if (index != -1) {
                return { ok: 'Producto editado' }
            } else {
                return { error: 'producto no encontrado' }
            }
        } catch (error) {
            return { error: 'producto no encontrado' }
        }
    }
}

module.exports = Contenedor