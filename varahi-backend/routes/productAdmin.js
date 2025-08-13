const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const verifyToken = require("../middleware/verifyToken");
const upload = require("../utils/multer");
const cloudinary = require("../utils/cloudinary");

// POST /admin/products/add
router.post("/add", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      singlePrice, // optional
      sizes,       // optional
      stockCount,
      tags,
      isActive
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "varahi_boutique",
    });

    // Parse inputs
    const parsedSinglePrice = singlePrice ? JSON.parse(singlePrice) : null;
    const parsedSizes = sizes ? JSON.parse(sizes) : [];

    // Validate: Must have either singlePrice or sizes
    if (!parsedSinglePrice && parsedSizes.length === 0) {
      return res.status(400).json({ message: "Provide either singlePrice or sizes" });
    }

    // Build product object
    const productData = {
      title,
      description,
      category,
      imageUrl: result.secure_url,
      cloudinary_id: result.public_id,
      stockCount: stockCount || 0,
      tags: tags ? JSON.parse(tags) : [],
      isActive: isActive !== undefined ? isActive : true
    };

    // Conditionally add singlePrice or sizes
    if (parsedSinglePrice) {
      productData.singlePrice = parsedSinglePrice;
    } else {
      productData.sizes = parsedSizes;
    }

    const newProduct = new Product(productData);
    await newProduct.save();

    res.status(201).json({ message: "✅ Product added successfully", product: newProduct });

  } catch (error) {
    console.error("❌ Error adding product:", error.message);
    res.status(500).json({ message: "Server error while adding product" });
  }
});

module.exports = router;
