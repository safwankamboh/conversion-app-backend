import bcrypt from "bcryptjs";
import { AppDataSource } from "../config/data-source.js";
import { User } from "../entities/User.js";
export const signup = async (req, res) => {
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
                UserId: user.id,
                UserName: user.name,
                UserEmail: user.email,
            },
        });
    }
    catch (error) {
        console.error("SIGNUP ERROR:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
