import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/JWT.js";
import mongoose from "mongoose";


export const addUser = async (req, res) => {
  const { firstName, lastName, email, password, role, phoneNumber } = req.body;

  try {
    if (!firstName || !lastName || !email || !password || !phoneNumber) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);


    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "Admin",
      phoneNumber,
    });


    res.status(200).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ err: "Internal Server Error", msg: error });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.body.id;

  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findOne({ _id: id });

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error", msg: error });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
   return  res.json(users);
  } catch (error) {
    console.error(error);
   return  res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getOneUser = async (req, res) => {
  const id = req.body.id;

  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error", msg: error });
  }
};

export const logIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "all fields are required" });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = generateToken(user);

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .status(200)
      .json({ message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const SignUp = async (req, res) => {
  const { firstName, lastName, email, password, role, phoneNumber } = req.body;

  try {
    if (!firstName || !lastName || !email || !password || !phoneNumber) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {  
      return res.status(400).json({ error: "Email already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "Customer",
      phoneNumber,
    });


    const token = generateToken(newUser);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.status(200).json(newUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: "Internal Server Error", msg: error });
  }
};

export const loggedInUser = (req, res) => {
  return res.json({ user: req.user }).status(200);
};

export const logOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};