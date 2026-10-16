
import Product from '../models/Product.js';
import fs from 'fs';
import path from 'path';

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
    } = req.body;

    const image = req.file
      ? `/uploads/${req.file.filename}`
      : '';

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      image,
    });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { search, minPrice, maxPrice, sort } = req.query;

    const filter = {};

    if (search) {
      filter.name = {
        $regex: search,
        $options: 'i',
      };
    }

    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    let query = Product.find(filter);

    if (sort === 'priceAsc') {
      query = query.sort({ price: 1 });
    }

    if (sort === 'priceDesc') {
      query = query.sort({ price: -1 });
    }

    const products = await query;

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const updateProduct = async (req, res) => {
  try {
    // Get existing product first
    const existingProduct = await Product.findById(req.params.id);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const updateData = {
      ...req.body
    };
    console.log("Flow reached request body", req.body);
    
    // Remove image coming from req.body
    // We only want to update image using req.file
    delete updateData.image;

    // If a new image is uploaded
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    // Update product in MongoDB
    console.log(updateData);
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    // Delete old image only if a new image was uploaded
    if (req.file && existingProduct.image) {
      const oldImagePath = path.join(
        process.cwd(),
        existingProduct.image
      );

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    // 1. Find the product first
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // 2. Delete product from MongoDB
    await Product.findByIdAndDelete(req.params.id);

    // 3. Delete associated image from uploads folder
    if (product.image) {
      const imagePath = path.join(process.cwd(), product.image);
       console.log(imagePath);
       
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // 4. Send success response
    res.status(200).json({
      success: true,
      message: 'Product and image deleted successfully',
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
