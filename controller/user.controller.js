import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

export const userLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username && !password) {
    return res
      .status(400)
      .json({ message: "Username and Password are required!" });
  }
  try {
    const usernameExists = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!usernameExists) {
      return res.status(400).json({ message: "Username doesn't exists" });
    }

    const match = await bcrypt.compare(password, usernameExists.password);

    if (!match) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    const user = {
      id: usernameExists.id,
      fullname: usernameExists.fullname,
      username: usernameExists.username,
      role: usernameExists.role,
    };

    // TAMBAHKAN BARIS INI UNTUK DEBUGGING
    console.log("Mencoba membuat token dengan secret:", process.env.JWT_SECRET);

    const token = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Success Signin",
      status: 200,
      token: token,
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.json({ message: "Error", error: error, status: 403 });
  }
};

export const userRegister = async (req, res) => {
  const { username, password, fullname } = req.body;

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  try {
    const usernameExists = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (usernameExists) {
      return res.status(400).json({ message: "Username already taken" });
    }

    await prisma.user.create({
      data: {
        username: username,
        password: hashPassword,
        fullname,
      },
    });

    res.json({ message: "Signup success", status: 200 });
  } catch (error) {
    console.log(error);
    res.json({ message: "Error", error: error, status: 403 });
  }
};

export const Me = (req, res) => {
  res.json({
    id: req.user.id,
    fullname: req.user.fullname,
    username: req.user.username,
    role: req.user.role,
  });
};
