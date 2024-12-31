const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const { User } = require('../Models/userModel.js');
const secretKey = process.env.SECRET_KEY;
const refreshSecretToken = process.env.REFRESH_SECRET_KEY;

const refreshAccessToken = async(req,res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res.status(403).json({
                success: false,
                message: "No refresh token provided" 
            });
        }

        jwt.verify(refreshToken, refreshSecretToken,async (err,decoded)=>{
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: "Invalid or expired refresh token"
                });
            }

            const userExist = await User.findById(decoded.id);
            if (!userExist) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            const newAccessToken = jwt.sign(
                { 
                    name: userExist.name,
                    email: userExist.email,
                    role: userExist.role 
                },
                secretKey,
                { expiresIn: "1h" }
            );

            res.cookie('token', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "None",
                maxAge: 3600 * 1000, // 1 hour
            });

            res
            .status(200)
            .json({
                success: true,
                accessToken: newAccessToken
            });
        })

    } catch (error) {
        res
        .status(500)
        .json({
            success: false,
            message: "Unable to refresh access token"
        });        
    }
}

const usersController = async (req, res) => {
    try {
        const users = await User.find();
        res
        .status(200)
        .json({
            success: true,
            users
        }); // 200 for successful response
    } catch (error) {
        res
        .status(500)
        .json({ 
                success: false,
                message: "Unable to get users" 
            }); // 500 for server error
    }
};

const registerController = async (req, res) => {
    try {
        const { email, name, password, role } = req.body;

        if (!email || !name || !password) {
            return res
            .status(400)
            .json({ 
                success: false, 
                message: "Incomplete details" 
            });
        }

        // Check if the user already exists
        const userExist = await User.findOne({ email: email });
        if (userExist) {
            return res
            .status(409).
            json({ 
                success: false, 
                message: "User already exists" 
            }); // 409 for conflict
        }

        // Hash the password
        const hashedPass = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({ 
            name, 
            email, 
            password: hashedPass, 
            role: role || "user" 
        });
        const savedUser = await newUser.save();

        const accessToken = jwt.sign(
            { 
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role
            },
            secretKey,
            { expiresIn: "1h" }
        );
        if (!accessToken) {
            return res
            .status(500)
            .json({
                success: false,
                message: "Unable to create token. Try again later"
            });
        }

        // Set access token in cookies
        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
            maxAge: 3600 * 1000, // 1 hour
        });

        // Create a refresh token using savedUser._id
        const refreshToken = jwt.sign({ id: savedUser._id }, refreshSecretToken, { expiresIn: "30d" });
        if (!refreshToken) {
            return res.status(500).json({ success: false, message: "Unable to create refresh token. Try again later" });
        }

        // Set refresh token in cookies
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        // Return response with the new user and token
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token: accessToken,
            user: savedUser
        });

    } catch (error) {
        res
        .status(500)
        .json({
            success: false,
            message: "Unable to register"
        });
    }
};

const loginController = async (req, res) => {
    try {
        // data 
        const { email, password } = req.body;
        if (!email || !password) {
            return res
            .status(400)
            .json({
                success: false,
                message: "Incomplete details"
            });
        }

        // User Exist 

        const userExist = await User.findOne({email:email})
        if (!userExist) {
            return res
            .status(404)
            .json({ 
                success: false, 
                message: "User not found. Please register first" 
            }); // 404 for not found
        }

        // Password Validation
        const isValidPass = await bcrypt.compare(password, userExist.password);
        if (!isValidPass) {
            return res
            .status(401)
            .json({ 
                success: false, 
                message: "Invalid password" 
            }); // 401 for unauthorized
        }

        
        // Creating & Setting Token 
        const accessToken = jwt.sign({
            name: userExist.name,
            email,
            role: userExist.role
        },
        secretKey,
        { expiresIn: "1h" });
        if (!accessToken) {
            return res
            .status(500)
            .json({
                success: false,
                message: "Unable to create token. Try again later"
            }); // 500 for server error
        }
        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
            maxAge: 3600 * 1000,
        });

        const refreshToken = jwt.sign({ id: userExist._id },refreshSecretToken,{ expiresIn: "30d" });
        if(!refreshToken){
            return res
            .status(500)
            .json({
                success: false,
                message: "Unable to create token. Try again later"
            }); // 500 for server err
        }
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        res
        .status(200)
        .json({ 
            token:accessToken, 
            success: true, 
            message: "Successfully logged in"
        }); // 200 for success
    } catch (error) {
        res
        .status(500)
        .json({ 
            success: false, 
            message: "Unable to log in" 
        }); // 500 for server error
    }
};

const logoutController = async (req, res) => {
    try {
        res.clearCookie('token');
        res.clearCookie('refreshToken');
        res
        .status(200)
        .json({
            success: true,
            message: "Successfully logged out"
        }); // 200 for success
    } catch (error) {
        res
        .status(500)
        .json({
            success: false,
            message: "Unable to log out. Try again later" 
        }); // 500 for server error
    }
};

const adminController = async (req,res) => {
    try {
        res.
        status(202)
        .json({
            success:true,
            message: `Welcome (${req.user.name})! The Admin`
        });
    } catch (error) {
        res
        .status(500)
        .json({
            success:false,
            message:"Internal Server Error"
        });
    }
};

const protectedController = async(req,res) => {
    try {
        res
        .status(202)
        .json({
            success:true,
            message: `Welcome ${req.user.name}!`,
        });
    } catch (error) {
        res
        .status(500)
        .json({
            success:false,
            message:"Internal Server Error"
        });
    }
};

module.exports = { refreshAccessToken, adminController,  protectedController, loginController, logoutController ,usersController, registerController };