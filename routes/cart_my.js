const express = require("express");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { route } = require("./user");

const router = express.Router();

router.post("/cart", async (req, res, next) => {
  try {
    const toDo = await Cart.create({
      title: req.body.title,
      description: req.body.description,
    });
    if (!toDo) {
      return res.status(400).json({
        success: false,
        msg: "Something went wrong",
      });
    }

    res.status(200).json({
      success: true,
      todo: toDo,
      msg: "Successfully created.",
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/cart_product/:id", async (req, res, next) => {
  try {
    // Use findOneAndUpdate to find and update a single document
    const cart = await Cart.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: {
          products: {
            product: req.body.products.product,
            // Add other properties if needed
          },
        },
      },
      { new: true }
    );

    if (!cart) {
      return res.status(400).json({
        success: false,
        msg: "Cart not found",
      });
    }

    res.status(200).json({
      success: true,
      count: cart.products.length,
      cart: cart,
      msg: "Successfully finished.",
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/cart_product/:id/:productId", async (req, res, next) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { _id: req.params.id },
      {
        $pull: {
          products: { _id: req.params.productId },
        },
      },
      { new: true }
    );

    if (!cart) {
      return res.status(400).json({
        success: false,
        msg: "Cart not found",
      });
    }

    res.status(200).json({
      success: true,
      count: cart.products.length,
      cart: cart,
      msg: "Product deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/cart_product_remove/:id", async (req, res, next) => {
  try {
    const cartId = req.params.id;

    // Fetch the cart by ID
    const cart = await Cart.findOne({ _id: cartId });

    if (!cart) {
      return res.status(400).json({
        success: false,
        msg: "Cart not found",
      });
    }

    const cartProducts = cart.products || [];

    const deletePromises = cartProducts.map(async (item) => {

      Product.create({
        product: item.product
      });

      
    await Cart.findOneAndUpdate(
      { _id: cartId },
      {
        $pull: {
          products: { _id: item._id },
        },
      },
      { new: true }
    );

    })

    res.status(200).json({
      success: true,
      count: cartProducts.length,
      cartProducts: cartProducts,
      msg: "Cart products retrieved successfully.",
    });
  } catch (error) {
    next(error);
  }
});

// get perticular user
router.get("/carttoorder", async (req, res, next) => {
  try {
    const cart = await Cart.find({ });
    if (!cart) {
      return res.status(400).json({
        success: false,
        msg: "Something went wrong",
      });
    }

    const deletePromises = cart.map(async (item) => {

      Order.create({
        title: item.title,
        description: item.description,
      });

      
    await Cart.findByIdAndDelete(item._id);

    })

    await Promise.all(deletePromises);

    res.status(200).json({
      success: true,
      count: cart.length,
      cart: cart,
      msg: "Successfully finshed.",
    });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
