// routes/image.js
const express = require('express');
const router = express.Router();
const Image = require('../models/image');
const multer = require('multer');

// Configure Multer storage
const storage = multer.memoryStorage(); // Store the file in memory as a Buffer
const upload = multer({ storage });

// POST endpoint to upload the image and save it to the database
router.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    // Extract image data and content type from the uploaded file
    const imageData = req.file.buffer;
    const contentType = req.file.mimetype;

    // Create a new image record and save it to the database
    const image = new Image({
      filename: req.file.originalname,
      path: '',
      image: { data: imageData, contentType },
    });

    await image.save();

    res.json({ message: 'Image uploaded and saved successfully' });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Error uploading image' });
  }
});

// GET endpoint to retrieve and serve an image
router.get('/image/:imageId', async (req, res) => {
  try {
    const { imageId } = req.params;

    // Find the image by its unique identifier
    const image = await Image.findById(imageId);

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Send the image data and content type as a response
    res.set('Content-Type', image.image.contentType);
    res.send(image.image.data);
  } catch (error) {
    console.error('Error retrieving image:', error);
    res.status(500).json({ message: 'Error retrieving image' });
  }
});

module.exports = router;