if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const path = require('path')

const Redis = require('ioredis')
const redisClient = new Redis({
  port: process.env.REDIS_SERVER_PORT,
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
  db: 0,
  // tls: {
  //   host: process.env.REDIS_HOST,
  // },
})

const { create } = require('express-handlebars')
const { getUser } = require('./helpers/auth-helpers')

const handlebarsHelpers = require('./helpers/handlebars-helpers')
const passport = require('./config/passport')
const { pages, apis } = require('./routes')

const app = express()
const port = process.env.PORT || 3000
const hbs = create({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: handlebarsHelpers,
})
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use(methodOverride('_method'))
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
)
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = getUser(req)
  next()
})
app.use(pages)
app.use('/api', apis)

app.listen(port, () => {
  console.info(`App listening on port ${port}!`)
})

module.exports = app
