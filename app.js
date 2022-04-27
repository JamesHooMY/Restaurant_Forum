if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const { create } = require('express-handlebars')
const methodOverride = require('method-override')
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000
const hbs = create({ defaultLayout: 'main', extname: '.hbs' })
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(routes)

app.listen(port, () => {
  console.info(`App listening on port ${port}!`)
})

module.exports = app
