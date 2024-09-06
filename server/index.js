const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const http = require('http')
const socketIo = require('socket.io')
const cookieParser = require('cookie-parser')

dotenv.config()

const app = express()

const server = http.createServer(app)

const barterRouter = require('./routes/routes')
app.use(cors())
app.use(cookieParser())

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(bodyParser.json())

app.use('/api/barterkuy', barterRouter)

const io = socketIo(server)

const PORT = process.env.PORT || 2020

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
