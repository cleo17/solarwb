import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { randomBytes } from 'crypto';
import { Request } from 'express';

// Ensure upload directories exist
const uploadDirs = [
  'public/uploads/products',
  'public/uploads/blog',
  'public/uploads/profiles'
];

for (const dir of uploadDirs) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Access the upload type from the request params
    const uploadType = req.params.uploadType;
    let destPath = 'public/uploads/';
    
    if (['products', 'blog', 'profiles'].includes(uploadType)) {
      destPath += uploadType;
    } else {
      // Default to a general uploads folder
      destPath += 'general';
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
    }
    
    cb(null, destPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = randomBytes(8).toString('hex');
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${uniqueSuffix}${extension}`);
  }
});

// File filter to allow only images
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// Create the multer instance
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Interface for image processing options
interface ImageProcessingOptions {
  width?: number;
  height?: number;
  quality?: number;
}

// Process images with sharp (resize, optimize)
export const processImage = async (
  filePath: string, 
  options: ImageProcessingOptions = { quality: 80 }
) => {
  const { width, height, quality = 80 } = options;
  
  try {
    const image = sharp(filePath);
    
    if (width || height) {
      image.resize(width, height, { fit: 'inside', withoutEnlargement: true });
    }
    
    const outputPath = filePath;
    await image.jpeg({ quality }).toFile(outputPath + '.processed');
    
    // Replace original with processed
    fs.unlinkSync(filePath);
    fs.renameSync(outputPath + '.processed', filePath);
    
    return path.basename(filePath);
  } catch (error) {
    console.error('Image processing error:', error);
    throw error;
  }
};

// Helper to get the public URL of an uploaded file
export const getUploadedFileUrl = (filename: string, uploadType: string): string => {
  if (!filename) return '';
  return `/uploads/${uploadType}/${filename}`;
};