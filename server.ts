import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import multer from "multer";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  console.log('--- SERVER STARTING (v2.1 - Cloudinary Fix) ---');
  console.log('Current Time:', new Date().toISOString());

  // Configure Cloudinary inside startServer to ensure env vars are loaded
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn("Cloudinary environment variables are missing. Falling back to local storage.");
    if (!cloudName) console.warn("- Missing CLOUDINARY_CLOUD_NAME");
    if (!apiKey) console.warn("- Missing CLOUDINARY_API_KEY");
    if (!apiSecret) console.warn("- Missing CLOUDINARY_API_SECRET");
  } else {
    console.log(`Cloudinary Config Check: Name=${cloudName.substring(0, 3)}..., Key=${apiKey.substring(0, 3)}...`);
    cloudinary.config({
      cloud_name: cloudName.trim(),
      api_key: apiKey.trim(),
      api_secret: apiSecret.trim(),
    });
  }

  // Configure Cloudinary Storage for Multer
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      return {
        folder: 'birthday-app',
        format: 'png',
        public_id: path.parse(file.originalname).name + '-' + Date.now(),
        tags: ['birthday-app'],
      };
    },
  });

  const upload = multer({ storage });

  // API Route for uploading images to Cloudinary
  app.post("/api/upload", upload.single('image'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // multer-storage-cloudinary adds 'path' (the URL) to the file object
    const fileUrl = (req.file as any).path;
    console.log(`File uploaded to Cloudinary: ${fileUrl}`);
    
    res.json({ 
      message: 'File uploaded successfully to Cloudinary', 
      filename: req.file.filename,
      url: fileUrl
    });
  });

  // API Route to list images from Cloudinary
  app.get("/api/images", async (req, res) => {
    try {
      const publicPath = path.join(process.cwd(), 'public');
      let localImages: string[] = [];
      if (fs.existsSync(publicPath)) {
        localImages = fs.readdirSync(publicPath)
          .filter(file => /\.(webp|png|jpe?g|gif|svg)$/i.test(file))
          .map(f => `/${f}`);
      }

      // If Cloudinary is not configured, return local images
      if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
        return res.json(localImages);
      }

      let imageUrls: string[] = [];
      
      try {
        // Method 1: Search API
        console.log('Attempting Cloudinary Search...');
        const result = await cloudinary.search
          .expression('folder:birthday-app')
          .sort_by('created_at', 'desc')
          .max_results(100)
          .execute();
        imageUrls = result.resources.map((resource: any) => resource.secure_url);
        console.log(`Cloudinary Search found ${imageUrls.length} images`);
      } catch (searchError: any) {
        console.error('Cloudinary Search API Error Details:', JSON.stringify(searchError, null, 2));
        
        // Method 2: Admin API
        try {
          console.log('Attempting Cloudinary Admin API...');
          const result = await cloudinary.api.resources({
            type: 'upload',
            prefix: 'birthday-app/',
            max_results: 100
          });
          imageUrls = result.resources.map((resource: any) => resource.secure_url);
          console.log(`Cloudinary Admin API found ${imageUrls.length} images`);
        } catch (apiError: any) {
          console.error('Cloudinary Admin API Error Details:', JSON.stringify(apiError, null, 2));
        }
      }

      // Combine and remove duplicates
      const allImages = Array.from(new Set([...imageUrls, ...localImages]));
      res.json(allImages);
    } catch (error) {
      console.error('Unexpected error in /api/images:', error);
      // Fallback to local on any unexpected error
      const publicPath = path.join(process.cwd(), 'public');
      if (fs.existsSync(publicPath)) {
        const files = fs.readdirSync(publicPath);
        return res.json(files.filter(file => /\.(webp|png|jpe?g|gif|svg)$/i.test(file)).map(f => `/${f}`));
      }
      res.json([]);
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
