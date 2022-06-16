const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy

const { User, Restaurant } = require('../models')

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
        return cb(err)
      }
    }
  )
)

//JWT authentication
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
}
passport.use(
  new JWTStrategy(jwtOptions, async (jwtPayload, cb) => {
    try {
      console.log(jwtPayload)
      const user = await User.findByPk(jwtPayload.id, {
        include: [
          { model: Restaurant, as: 'FavoritedRestaurants', attributes: ['id'] },
          { model: Restaurant, as: 'LikedRestaurants', attributes: ['id'] },
          { model: User, as: 'Followers', attributes: ['id'] },
          { model: User, as: 'Followings', attributes: ['id'] },
        ],
      })

      return cb(null, user)
    } catch (err) {
      cb(err)
    }
  })
)

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRECT,
      callbackURL: process.env.FACEBOOK_CALLBACK,
      profileFields: ['email', 'displayName'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { name, email } = profile._json

        let user = await User.findOne({ where: { email } })
        if (user) return done(null, user)

        const randomPassword = Math.random().toString(36).slice(-8)
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(randomPassword, salt)
        // for new user creation
        user = await User.create({
          name,
          email,
          password: hash,
        })
        return done(null, user)
      } catch (err) {
        return done(null, false)
      }
    }
  )
)

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRECT,
      callbackURL: process.env.GOOGLE_CALLBACK,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { name, email } = profile._json

        const user = await User.findOne({ where: { email } })
        if (user) return done(null, user)

        const randomPassword = Math.random().toString(36).slice(-8)
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(randomPassword, salt)
        // for new user creation

        user = await User.create({
          name,
          email,
          password: hash,
        })
        return done(null, user)
      } catch (err) {
        return done(null, false)
      }
    }
  )
)

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser(async (id, cb) => {
  try {
    let user = await User.findByPk(id, {
      include: [
        { model: Restaurant, as: 'FavoritedRestaurants', attributes: ['id'] },
        { model: Restaurant, as: 'LikedRestaurants', attributes: ['id'] },
        { model: User, as: 'Followers', attributes: ['id'] },
        { model: User, as: 'Followings', attributes: ['id'] },
      ],
    })
    user = user.toJSON()

    return cb(null, user)
  } catch (err) {
    cb(err)
  }
})
module.exports = passport
