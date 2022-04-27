if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const { create } = require('express-handlebars')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')

const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000
const hbs = create({ defaultLayout: 'main', extname: '.hbs' })
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
)
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})
app.use(routes)

app.listen(port, () => {
  console.info(`App listening on port ${port}!`)
})

module.exports = app
