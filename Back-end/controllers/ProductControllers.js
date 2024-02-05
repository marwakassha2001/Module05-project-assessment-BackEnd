import mongoose from "mongoose";
import Product from "../models/ProductModel.js";
import fs from "fs";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getProduct = async (req, res) => {
  const id = req.body.id;

  try {
    const product = await Product.findById(id)

    if (!product) {
      return res.status(404).json({ error: "No such a product" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const createProduct = async (req, res) => {
    const {
      name,
      description,
      price,
    } = req.body;
  
    if (!req.file) {
      return res.status(400).json({ error: "Please upload an image" });
    }
    const image = req.file.filename;
  
    try {
      const newProduct = new Product({
        name,
        description,
        image,
        price,
      });
      await newProduct.save();
      res
        .status(201)
        .json({ message: "Product created successfully", product: newProduct });
    } catch (error) {
      const imagePath = `public/images/${req.file.filename}`;
      fs.unlinkSync(imagePath);
      console.log(error);
      res.status(500).json("Internal server error");
    }
  };

// update a product

export const updateProduct = async (req, res) => {
  const id = req.body.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      error: "Product not found",
    });
  }

  const oldProduct = await Product.findById(id);

  try {
    const updatedData = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
    };
    const oldImagePath = `public/images/${oldProduct.image}`;

    if (req.file) {
      updatedData.image = req.file.filename;

      fs.unlink(oldImagePath, (err) => {
        if (err) {
          return res.status(500).json({
            error: `error deleting the old image`,
          });
        }
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: id },
      updatedData,
      {
        new: true,
      }
    );

    return res.json(updatedProduct);
  } catch (error) {
    return res.status(500).json({
      error: `Error, ${error.message}`,
    });
  }
};

// Delete a Product
export const deleteProduct = async (req, res) => {
  const id = req.body.id;

  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await Product.findById(id);

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    const imagePath = `public/images/${product.image}`;
    fs.unlinkSync(imagePath);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error", msg: error });
  }
};