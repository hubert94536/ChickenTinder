const { Sequelize } = require('sequelize');
const { Accounts } = require('./models.js')
const { AWS } = require('aws-sdk');
const { fs } = require('fs');
// TODO: Upload Models to support storing image link

const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
    region: 'foo' // change later
});

const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'foo', // change latre
      acl: 'public-read',
      key: function (req, file, cb) {
        console.log(file);
        const uid = req.params.id;
        cb(null, uid);
      }
    })
});  

const uploadPhoto = upload.single('avatar');

const uploadHandler = (req, res) => {
    try{
        const uid = req.params.id; // temp, change based on data format or auth token
        
        const user = await Accounts.findOne({ where: { id: uid } })
        if (!user) return res.status(404).send('User does not exist');


        uploadPhoto(req, res, function(error) {
            if (error) return res.status(500).send(error.message)
        })
        
        const updated = await user.update({ photo: req.file.location });
        if (updated) {
            return res.status(200).send('Uploaded photo')
        }
        return res.status(500).send('Error uploading photo')
    } catch (error) {
        return res.status(500).send(error.message)
    }
}

module.exports = {
    upload,
    uploadPhoto,
    uploadHandler
}