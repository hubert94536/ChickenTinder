const { Accounts } = require('./models.js')
const AWS = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
  region: 'us-west-1',
})

// positively this code breaks all conventions known to mankind...
// Look into error handling middleware
// https://expressjs.com/en/guide/error-handling.html
const upload = (req, res, next) =>
  multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.AWS_BUCKET,
      acl: 'public-read',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: async function (req, file, cb) {
        // TODO: id must be supplied first in the request... see if this is fixable
        try {
          req.validContent = true
          const uid = req.body.id
          if (!uid) throw new Error('no id given')
          let user = await Accounts.findOne({ where: { id: uid } })
          if (!user) {
            throw new Error('user does not exist')
          } else {
            req.user = user
            const ext = (function (file) {
              if (file.mimetype == 'image/png') return '.png'
              if (file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') return '.jpg'
            })(file)
            cb(null, uid + ext)
          }
        } catch (error) {
          console.log(error)
          return res.status(500).send(error.message)
        }
      },
    }),
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype == 'image/png' ||
        file.mimetype == 'image/jpg' ||
        file.mimetype == 'image/jpeg'
      ) {
        cb(null, true)
      } else {
        return res.status(400).send('invalid file format')
      }
    },
    limits: {
      fields: 1,
      files: 1,
      fileSize: 150 * 1024, // change later
    },
  }).single('avatar')(req, res, next)

const uploadHandler = async (req, res) => {
  try {
    if (!req.validContent) throw new Error('invalid content')
    if (!req.file) throw new Error('no file received')
    if (!req.user) throw new Error('user does not exist')
    await req.user.update({ photo: req.file.location })
    return res.status(200).send(req.file.location)
  } catch (error) {
    console.log(error)
    return res.status(500).send(error.message)
  }
}

const deletePhoto = async (req, res) => {
  try {
    const uid = req.body.id;
    if (!uid) throw new Error('no id given');
    let user = await Accounts.findOne({ where: { id: uid } });
    if (!user) {
      throw new Error('user does not exist');
    }
    
    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: req.body.key
    }

    s3.deleteObject(params, function(err, data) {
      try {
        if (err) throw err;
        await user.update({photo: req.body.replacement});
        return res.status(200).send("photo deleted")
      } catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
      }
    })
    
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
}

module.exports = {
  upload,
  uploadHandler,
  deletePhoto
}
