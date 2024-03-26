const express = require('express');
const sharp = require('sharp');
const multer = require('multer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

// Multer configuration for handling file uploads
const upload = multer();

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// Define a route to handle image compression and download
app.post('/compress-image', upload.single('image'), async (req, res) => {
    try {
        // Get the image file from the request
        const imageFile = req.file;

        // Check if an image file was uploaded
        if (!imageFile) {
            return res.status(400).send('No image file uploaded');
        }

        // Compress the image
        const compressedImageBuffer = await compressImage(imageFile.buffer);

        // Set headers for file download
        res.setHeader('Content-Disposition', 'attachment; filename=compressed_image.jpg');
        res.setHeader('Content-Type', 'image/jpeg');

        // Send the compressed image buffer in the response
        res.end(compressedImageBuffer);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Function to compress the image buffer
async function compressImage(imageBuffer) {
    // Perform image compression using Sharp
    const compressedImageBuffer = await sharp(imageBuffer)
        .jpeg({ quality: 50 }) // Adjust quality as needed
        .toBuffer();

    return compressedImageBuffer;
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
