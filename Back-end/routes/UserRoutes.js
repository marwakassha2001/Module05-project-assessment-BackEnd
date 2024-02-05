import {
    SignUp,
    addUser,
    deleteUser,
    getAllUsers,
    getOneUser,
    logIn,
    loggedInUser,
    logOut,
  } from "../controllers/UserControllers.js";
  import express from "express";
//   import upload from "../middleware/Multer.js";
  import { authenticate } from "../middleware/Auth.js";
  
  const userRouter = express.Router();
  
  userRouter.post("/signup", SignUp);
  userRouter.post("/byId", getOneUser);
  userRouter.get("/", getAllUsers);
  userRouter.post("/", addUser);
  userRouter.delete("/", deleteUser);
  userRouter.post("/login", logIn);
  userRouter.post("/logout", logOut);
  userRouter.get("/logged-in-user", authenticate, loggedInUser);
  
  export default userRouter;