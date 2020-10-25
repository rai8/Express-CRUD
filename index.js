const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv').config()
const app = express()
const path = require('path')
const PORT = process.env.PORT || 4000
const connection = require('./db')
//const routers = require('./api/apps')

//initializing the database
require('./db')

//setting up the middlewares
//app.use('/new', routers)
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//setting up the view engine template
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.set('view options', { layout: false })

//defining the root route
app.get('/', (req, res) => {
  let sql = `SELECT * FROM application`
  connection.query(sql, (err, rows) => {
    if (err) throw err
    res.render('index', { apps: rows })
  })
})

//add records to database
app.post('/new', (req, res, next) => {
  let sql = `INSERT INTO application(name, thumbnail, description, url) VALUES(?)`
  let values = [req.body.name, req.body.thumbnail, req.body.description, req.body.url]
  connection.query(sql, [values], (err, data, fields) => {
    if (err) throw err
    console.log('record added successfully')
    res.redirect('/')
  })
})

//listening to the server
app.listen(PORT, () => {
  console.log(`------server is running on port ${PORT}------`)
})
