import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  createdAt: true
};

const signToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw Object.assign(new Error("JWT_SECRET is not configured"), { statusCode: 500 });
  }

  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true }
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email is already registered",
        errors: { email: "Email is already registered" }
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword
      },
      select: publicUserSelect
    });

    const token = signToken(user.id);

    return res.status(201).json({ token, user });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    const userWithPassword = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (!userWithPassword) {
      return res.status(401).json({
        message: "Invalid email or password",
        errors: { email: "Invalid email or password" }
      });
    }

    const isPasswordValid = await bcrypt.compare(password, userWithPassword.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
        errors: { password: "Invalid email or password" }
      });
    }

    const { password: _password, ...user } = userWithPassword;
    const token = signToken(user.id);

    return res.status(200).json({ token, user });
  } catch (error) {
    return next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: publicUserSelect
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return next(error);
  }
};
