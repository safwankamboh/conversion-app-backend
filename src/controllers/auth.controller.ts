import { Request, Response } from "express";
// import prisma from "../config/prisma";
import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check if user already exists
    const existingUser = await prisma?.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma?.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      Success: true,
      Code: 201,
      Message: "Signup successful",
      Data: {
        UserId: user?.id,
        UserName: user?.name,
        UserEmail: user?.email,
      },
    });
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
