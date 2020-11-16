const { Sequelize } = require('sequelize');
const { Accounts } = require('./models.js')
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
    region: 'us-west-1'
});

const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.AWS_BUCKET,
      acl: 'public-read',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
        // TODO: id will only be populated if sent first in the request... see if this is fixable
        const uid = req.body.id;
        console.log(1)
        Accounts.findOne({ where: { id: uid } })
            .then((user) => {
                console.log(2)
                if (!user) {
                    req.error = new Error('user does not exist')
                    cb(new Error('user does not exist'))
                } else {
                    req.user = user;
                    const ext = (function(file){
                        if (file.mimetype == "image/png") return ".png";
                        if (file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") return ".jpg";
                    })(file);
                    console.log(3)
                    cb(null, uid + ext);
                }
            })
            .catch((error) => {
                req.error = error;
                cb(error);
            });
      }
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
          cb(null, true);
        } else {
          cb(null, false);
          return cb(new Error('file not .png, .jpg or .jpeg'));
        }
      }
});  

const uploadPhoto = upload.single('avatar');

const uploadHandler = async (req, res) => {
    try{
        // await uploadPhoto(req, res, function(error) {
        //     if (error) req.error = error; // to handle errors outside of the block
        // })
        console.log(4)
        if (req.error) throw req.error;
        console.log(5)
        if (req.user) {
            console.log(6)
            req.user.update({ photo: req.file.location })
                .then((response) => { 
                    console.log(7)
                    console.log("Location: " + req.file.location);
                    return res.status(200).send('Uploaded photo at ' + req.file.location ) })
                .catch((error) => {
                    console.log(8) 
                    return res.status(500).send(error.message); } );
        } else throw new Error('user does not exist');
    } catch (error) {
        return res.status(500).send(error.message)
    }
}

module.exports = {
    upload,
    uploadPhoto,
    uploadHandler
}