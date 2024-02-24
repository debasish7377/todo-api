const express = require("express");
const auth = require("../middleware/user_jwt");
const Todo = require("../models/Todo");
const { route } = require("./user");

const router = express.Router();

router.post("/", auth, async (req, res, next) => {
  try {
    const toDo = await Todo.create({
      title: req.body.title,
      description: req.body.description,
      user: req.user.id,
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

// get perticular user
router.get("/", auth, async (req, res, next) => {
  try {
    const toDo = await Todo.find({ user: req.user.id, finished: false });
    if (!toDo) {
      return res.status(400).json({
        success: false,
        msg: "Something went wrong",
      });
    }

    res.status(200).json({
      success: true,
      count: toDo.length,
      todo: toDo,
      msg: "Successfully finshed.",
    });
  } catch (error) {
    next(error);
  }
});

//update todo by put method
router.put("/:id", async (req, res, next) => {
  try {
    let toDo = await Todo.findById(req.params.id);
    if (!toDo) {
      return res.status(400).json({
        success: false,
        msg: "Task todo not exist",
      });
    }

    toDo = await Todo.findById(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      todo: toDo,
      msg: "Successfully updated.",
    });
  } catch (error) {
    next(error);
  }
});

//delete todo by delete method
router.delete("/:id", async (req, res, next) => {
  try {
    let toDo = await Todo.findById(req.params.id);
    if (!toDo) {
      return res.status(400).json({
        success: false,
        msg: "Task todo not exist",
      });
    }

    toDo = await Todo.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      msg: "Successfully deleted task.",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

