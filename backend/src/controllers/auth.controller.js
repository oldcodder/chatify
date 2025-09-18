
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js"
import bcrypt from "bcryptjs"


export const signup = async (req, res) => {

    const { fullName, email, password } = req.body;

    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields required " })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be greater than 6 characters" })
        }
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email address" })
        }
        const user = await User.findOne({ email: email })
        if (user) return res.status(400).json({ message: "User already exists" })
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        if (newUser) {
            generateToken(newUser.id, res)
            await newUser.save();
            res.status(201).json({
                _id: newUser.id,
                email: newUser.email,
                fullName: newUser.fullName
            })
        }
        else {
            return res.status(500).json({ message: "Invalid user data" })
        }
    } catch (error) {
        console.log("Error in sign up controller", error);
        res.status(500).json({ message: "Internal server error" })
    }
} 