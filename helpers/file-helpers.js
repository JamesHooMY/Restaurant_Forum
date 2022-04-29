const fs = require('fs') // node.js default module
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

const localFileHandler = (file) => {
  // "file" from multer processed image
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    const fileName = `upload/${file.originalname}` // multer originalname
    return fs.promises
      .readFile(file.path) // read multer file.path "/temp"
      .then(async (data) => {
        await fs.promises.writeFile(fileName, data) // copy the file to "upload/", file.path using on app.js
        await fs.unlinkSync(file.path) // remove file in /temp after writeFile to upload
      })
      .then(() => resolve(`/${fileName}`))
      .catch((err) => reject(err))
  })
}

const imgurFileHandler = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    return imgur
      .uploadFile(file.path)
      .then(async (img) => {
        await resolve(img || null) // check img.link is exist
        // await resolve(img?.link || null) // check img.link is exist
        // if we want to delete the upload file in imgur, we need to output "img.deleteHash" and add one more attribute of Restaurant.
        /* these three types can get the same results
        img && img.link
        img ? img.link : null
        img?.link || null
        */
        await fs.unlinkSync(file.path)
      })
      .catch((err) => reject(err))
  })
}

module.exports = {
  localFileHandler,
  imgurFileHandler,
}
