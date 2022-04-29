const fs = require('fs') // node.js default module

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

module.exports = {
  localFileHandler,
}
