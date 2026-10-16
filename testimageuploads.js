import fs from 'fs';
import path from 'path';

const uploadsFolder = path.join(process.cwd(), 'uploads');
const testImagesFolder = path.join(process.cwd(), 'test-images');

const image1Path = path.join(testImagesFolder, 'image1.jpg');
const image2Path = path.join(testImagesFolder, 'image2.jpg');

const uploadedImagePath = path.join(uploadsFolder, 'Lordganeha.jpg');


// ========================================
// CREATE
// ========================================

function createImage() {
    console.log('\n--- CREATE ---');

    // Make sure uploads folder exists
    if (!fs.existsSync(uploadsFolder)) {
        fs.mkdirSync(uploadsFolder);
        console.log('uploads folder created');
    }

    // Copy image1 into uploads
    fs.copyFileSync(image1Path, uploadedImagePath);

    console.log('Image created in uploads folder');
}


// ========================================
// UPDATE
// ========================================

function updateImage() {
    console.log('\n--- UPDATE ---');

    // Check whether old image exists
    if (fs.existsSync(uploadedImagePath)) {
        fs.unlinkSync(uploadedImagePath);

        console.log('Old image deleted');
    } else {
        console.log('Old image not found');
    }

    // Copy new image
    fs.copyFileSync(image2Path, uploadedImagePath);

    console.log('New image added');
}


// ========================================
// DELETE
// ========================================

function deleteImage() {
    console.log('\n--- DELETE ---');

    if (fs.existsSync(uploadedImagePath)) {
        fs.unlinkSync(uploadedImagePath);

        console.log('Image deleted successfully');
    } else {
        console.log('Image not found');
    }
}


// ========================================
// RUN OPERATIONS
// ========================================

createImage();

//updateImage();

//deleteImage();