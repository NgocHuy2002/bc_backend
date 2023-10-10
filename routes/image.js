// routes/image.js
const express = require("express");
const router = express.Router();
const Image = require("../models/image");
const multer = require("multer");

// Configure Multer storage
const storage = multer.memoryStorage(); // Store the file in memory as a Buffer
const upload = multer({ storage });

// POST endpoint to upload the image and save it to the database
router.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    // Extract image data and content type from the uploaded file
    const imageData = req.file.buffer;
    const contentType = req.file.mimetype;
    const { sendBy, sendTo } = req.body;
    // Create a new image record and save it to the database
    const image = new Image({
      filename: req.file.originalname,
      path: "",
      image: { data: imageData, contentType },
      sendBy,
      sendTo,
    });

    await image.save();

    res.json({ message: "Image uploaded and saved successfully" });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Error uploading image" });
  }
});

// GET endpoint to retrieve and serve an image
router.get('/image', async (req, res) => {
  try {
    const { sendTo } = req.query;

    // Find all images with the provided 'sendTo' value
    const images = await Image.find({ sendTo });

    if (!images || images.length === 0) {
      return res.status(404).json({ message: 'No images found for sendTo: ' + sendTo });
    }

    // Return the array of image objects
    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ message: 'Error fetching images' });
  }
});


// Route to Fetch Individual Images by '_id'
router.get('/image-id/:_id', async (req, res) => {
  try {
    const { _id } = req.params;
    console.log(_id);
    // Find an individual image by its '_id' value
    const image = await Image.findById(_id);

    if (!image) {
      return res.status(404).json({ message: 'Image not found with _id: ' + _id });
    }

    // Send the image data and content type as a response
    res.set('Content-Type', image.image.contentType);
    res.send(image.image.data);
  } catch (error) {
    console.error('Error fetching image by _id:', error);
    res.status(500).json({ message: 'Error fetching image by _id' });
  }
});

module.exports = router;
