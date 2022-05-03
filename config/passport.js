const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, email, password, cb) => {
      try {
        const user = await User.findOne({ where: { email } })
        if (!user)
          return cb(
            null,
            false,
            req.flash('error_messages', 'Account or password is incorrect!')
          )

        const res = await bcrypt.compare(password, user.password)
        if (!res)
          return cb(
            null,
            false,
            req.flash('error_messages', 'Account or password is incorrect!')
          )
        return cb(null, user)
      } catch (err) {
        return cb(null, false, req.flash('error_messages', `${err}`))
      }
    }
  )
)

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id)
    .then((user) => {
      user = user.toJSON()
      return cb(null, user)
    })
    .catch((err) => cb(err))
})
module.exports = passport
