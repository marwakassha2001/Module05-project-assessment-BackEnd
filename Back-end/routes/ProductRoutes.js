import {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
  } from "../controllers/ProductControllers.js";
  import express from "express";
  import upload from "../middleware/Multer.js";
  
  const productRouter = express.Router();
  
  productRouter.get('/' , getProducts)
  productRouter.get("/get", getProduct);
  productRouter.post("/create", upload.single("image"), createProduct);
  productRouter.patch("/update", upload.single("image"), updateProduct);
  productRouter.delete('/delete' , upload.single('image') , deleteProduct)
  
  
  export default productRouter;