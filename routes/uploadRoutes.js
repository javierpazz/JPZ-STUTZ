const express = require ('express');
const multer = require ('multer');
const streamifier = require ('streamifier');
const { v2 : cloudinary } = require ('cloudinary');

const upload = multer();

const uploadRouter = express.Router();

uploadRouter.post(
  '/',
  upload.single('file'),
  async (req, res) => {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    const result = await streamUpload(req);
    const imageUrl = result.secure_url;
    res.status(200).json({ message: imageUrl });
    // res.send(result);
  }
);

module.exports = uploadRouter;
