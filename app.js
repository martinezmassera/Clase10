const { Router } = require('express')
const express = require('express')
const multer = require('multer')
const Contenedor = require('./contenedor')
const prod = new Contenedor('./productos.json')

const app = express()

const PORT = process.env.PORT || 8080
app.set('views','./views')
app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/file')
    },
    filename: (req, file, cb) => {

        cb(null, file.originalname)

    }
})

const upload = multer({ storage })

app.post('/productos', upload.single('file'), (req, res) => {
    const name = req.body.name;
    const price = req.body.price;
    const thumbnail = req.body.thumbnail;
    const img = req.file.filename;
    console.log(img)
    prod.addItemForm(name, price, img)
    res.render('products.ejs')
})

const router = Router()
router.get('/', async (req, res) => {
    const leer = await prod.leer()
    res.render('viewProducts.ejs',{ leer })
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
   
    res.send( await prod.editById(req.params.id, req.body))
})

router.delete('/:id', async (req, res) => {
    res.send(await prod.deleteById(req.params.id))
})

app.use('/api/productos', router)

const server = app.listen(PORT, () => {
    console.log(`Servidor http en el puerto ${PORT}`)
})
server.on("error", error => console.log(`Error en el servidor! - ${error}`))