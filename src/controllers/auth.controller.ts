import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { AppDataSource } from "../config/data-source.js";
import { User } from "../entities/User.js";
import jwt from "jsonwebtoken";
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    console.log("REQUEST BODY:", req.body);

    // Basic validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const userRepository = AppDataSource.getRepository(User);

    // Check if user already exists
    const existingUser = await userRepository.findOneBy({ email });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User();
    user.name = name;
    user.email = email;
    user.password = hashedPassword;

    await userRepository.save(user);

    console.log("User created:", user);

    return res.status(201).json({
      Success: true,
      Code: 201,
      Message: "Signup successful",
      Data: {
        Id: user.id,
        Name: user.name,
        Email: user.email,
      },
      MetaData:{
        CreatedAt: user.createdAt
      }
    });
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  // Login logic to be implemented
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "15min",
    });
    return res.status(200).json({
      Success: true,
      Code: 200,
      Message: "Login successful",
      Data: {
        AccessToken: accessToken,
        User: {
          Id: user.id,
          Name: user.name,
          Email: user.email,
        },
      },
      MetaData: {
        CreatedAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
