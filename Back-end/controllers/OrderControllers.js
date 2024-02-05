import Order from "../models/OrderModel.js";
import User from "../models/UserModel.js";
import Product from "../models/ProductModel.js";

export const addOrder = async (req, res) => {
  const { status, userId, orderDetails,quantity,totalPrice} =
    req.body;

  try {
    if ((!userId, !orderDetails, !quantity,!totalPrice)) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const allOrders = await Order.find();

    const number = allOrders.length + 1;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const productIds = orderDetails.map((item) => item.id);
    const products = await Product.find({ _id: { $in: productIds } });

    // Calculate the total price for each product
    const updatedProducts = products.map((product) => {
      const orderItem = orderDetails.find(
        (item) => item.id.toString() === product._id.toString()
      );

      if (!orderItem) {
        return res.status(404).json({ error: "Product not found" });
      }

      return {
        ...product.toObject(),
        quantity: orderItem.quantity,
        totalPrice: orderItem.totalPrice,
      };
    });
    const totalPrice = updatedProducts.reduce(
      (total, product) => total + product.totalPrice,
      0
    );

    const order = await Order.create({
      number: number,
      status: "Approved" || status,
      userId: userId,
      orderDetails: updatedProducts,
      totalPrice: totalPrice ,
      quantity:quantity,
    });

    res.status(200).json({ message: "Order added successfully", data: order });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", msg: error.message });
  }
};


// Edit Order
export const editOrder = async (req, res) => {
    const id = req.body.id;
    const { status, userId, orderDetails,quantity} = req.body;
  
    try {
      if (!id) {
        return res.status(400).json({ error: "No id" });
      }
  
      const existingOrder = await Order.findById(id);
      if (!existingOrder) {
        return res.status(404).json({ error: "Order not found" });
      }
  
      if (orderDetails) {
        const productIds = orderDetails.map((item) => item.id);
        const products = await Product.find({ _id: { $in: productIds } });
  
        var updatedProducts = products.map((product) => {
          const orderItem = orderDetails.find(
            (item) => item.id.toString() === product._id.toString()
          );
  
          if (!orderItem) {
            return res.status(404).json({ error: "Product not found" });
          }
  
          return {
            ...product.toObject(),
            quantity: orderItem.quantity,
            totalPrice: orderItem.totalPrice,
          };
        });
  
        var totalPrice = updatedProducts.reduce(
          (total, product) => total + product.totalPrice,
          0
        );
      }
  
      existingOrder.status = status || existingOrder.status;
      existingOrder.orderDetails = updatedProducts || existingOrder.orderDetails;
      existingOrder.totalPrice = totalPrice + deliveryFee || existingOrder.totalPrice + deliveryFee;
      existingOrder.quantity = quantity || existingOrder.quantity;
  
      const updatedOrder = await existingOrder.save();
  
      res
        .status(200)
        .json({ message: "Order updated successfully", data: updatedOrder });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Internal Server Error", msg: error.message });
    }
  };