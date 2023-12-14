const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage').GridFsStorage;
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

//image upload to mongodb
const storage = new GridFsStorage({
  url: `${process.env.MONGODB}`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  file: function (req, file) {
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${file.fieldname}-${Date.now()}${ext}`;
    //by default grid bucketName is `fs`.
    return { filename: filename, bucketName: 'image' };
  },
});

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.gif') {
    return cb(null, true);
  }
  return cb(
    new Error(`The image with extension ${ext} is not permitted.`),
    false
  );
}

const upload = multer({ storage: storage, fileFilter: fileFilter });
router.post('/files/upload', upload.single('image'), function (req, res) {
  res.json(req.file);
});

//---------------------------------------------------------------------
// image retrieved from mongodb
let gfs;

//establishing connection to mongodb server
const conn = mongoose.createConnection(process.env.MONGODB, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
conn.once('open', function () {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('image'); //name has to be same as during upload
});

//showing all images metadata
router.get('/files', function (req, res) {
  gfs.files.find().toArray(function (err, files) {
    if (err) {
      return res.status(404).json({
        err: 'Something went wrong, please try again later',
      });
    }
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist',
      });
    }
    //if files exists
    return res.json(files);
  });
});

//showing single image metadata
router.get('/files/:filename', function (req, res) {
  gfs.files.findOne({ filename: req.params.filename }, function (err, file) {
    if (err) {
      return res.status(404).json({
        err: 'Something went wrong, please try again later',
      });
    }
    if (!file) {
      return res.status(404).json({
        err: 'No such file exists',
      });
    }
    //if files exists
    return res.json(file);
  });
});

//showing single image
router.get('/image/:filename', function (req, res) {
  gfs.files.findOne({ filename: req.params.filename }, function (err, file) {
    if (err) {
      return res.status(404).json({
        err: 'Something went wrong, please try again later',
      });
    }
    if (!file) {
      return res.status(404).json({
        err: 'No such file exists',
      });
    }
    //show image
    const readstream = gfs.createReadStream(file.filename);
    readstream.pipe(res);
  });
});

module.exports = router;
