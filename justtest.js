import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import os from 'os';
console.log(os.networkInterfaces().en0[1].address);

const app = express();

app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadDir = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Serve uploaded files
app.use('/uploads', express.static(uploadDir));

// Test upload API
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: 'No image uploaded',
    });
  }

  res.status(201).json({
    message: 'Image uploaded successfully',
    filename: req.file.filename,
    imageUrl: `http://${os.networkInterfaces().en0[1].address}/uploads/${req.file.filename}`,
  });
});

app.listen(5000, '0.0.0.0', () => {
  console.log('Server running on port 5000');
});
