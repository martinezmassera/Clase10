const { Router } = require('express')
const express = require('express')
const multer = require('multer')
const Contenedor = require('./contenedor')
const prod = new Contenedor('./productos.json')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/file/')
    },
    filename: (req, file, cb) => {
        const t = Date.now()
        cb(null, t + file.originalname)

    }
})

const upload = multer({ storage })

app.post('/upload', upload.single('file'),(req, res) => {
    const name = req.body.name;
    const price = req.body.price;
    const thumbnail = req.body.thumbnail;
    const img = req.file.filename;
    console.log(img)
    prod.addItemForm(name, price, img)
    res.send(`<h1>${name}</h1><br><h1>$ ${price}</h1><br><h1>${thumbnail}</h1><br><img src=/file/${img} />`)
})


const router = Router()
router.get('/', async (req, res) => {
    res.send(await prod.leer())
})

router.get('/:id', async (req, res) => {
    const id = req.params.id
    res.send(await prod.getId(id))
})

router.post('/', (req, res) => {
    const body = req.body
    prod.addItem(body)
    res.send('producto agregado')
})

router.put('/:id', async (req, res) => {
    await prod.editById(req.params.id, req.body)
    res.send('producto actualizado')
})

router.delete('/:id', async (req, res) => {
    await prod.deleteById(req.params.id)
    res.send('producto eliminado')
})

app.use('/api/productos', router)
const PORT = process.env.PORT || 8080
const server = app.listen(PORT, () => {
    console.log(`Servidor http en el puerto ${PORT}`)
})
server.on("error", error => console.log(`Error en el servidor! - ${error}`))