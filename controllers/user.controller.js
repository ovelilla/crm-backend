import User from "../models/user.model.js";
import generateToken from "../helpers/generateToken.js";
import generateJWT from "../helpers/generateJWT.js";
import registerEmail from "../helpers/registerEmail.js";
import recoverEmail from "../helpers/recoverEmail.js";

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const foundUser = await User.findOne({ email });

        if (foundUser) {
            const error = new Error("User already exists");
            return res.status(400).json({ email: error.message });
        }

        const newUser = new User({
            name,
            email,
            password,
            token: generateToken(),
        });

        const savedUser = await newUser.save();

        await registerEmail(savedUser);

        res.status(200).json({
            message: "User registered successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const confirm = async (req, res) => {
    const { token } = req.params;

    try {
        const foundUser = await User.findOne({ token });

        if (!foundUser) {
            const error = new Error("Token is not valid");
            return res.status(403).json({ message: error.message });
        }

        foundUser.token = "";
        foundUser.confirmed = true;

        await foundUser.save();

        res.status(200).json({ message: "User confirmed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    const errors = {};

    try {
        const foundUser = await User.findOne({ email });

        if (!foundUser) {
            const error = new Error("User not found");
            errors.email = error.message;
            return res.status(404).json({ errors });
        }

        if (!foundUser.confirmed) {
            const error = new Error("You must confirm your account");
            errors.email = error.message;
            return res.status(404).json({ errors });
        }

        if (!(await foundUser.comparePassword(password))) {
            const error = new Error("Password is not valid");
            errors.password = error.message;
            return res.status(404).json({ errors });
        }

        const updatedUser = await User.findByIdAndUpdate(foundUser._id, {
            new: true,
        });

        const token = generateJWT(updatedUser.id);

        res.cookie("token", token, {
            expires: new Date(Date.now() + 24 * 3600000),
            sameSite: "none",
            secure: true,
            httpOnly: true,
        });

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
        });
    } catch (error) {
        console.log(error);
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            expires: new Date(Date.now() - 1),
            sameSite: "none",
            secure: true,
            httpOnly: true,
        });

        res.status(200).json({ message: "Session closed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const recover = async (req, res) => {
    const { email } = req.body;

    const errors = {};

    try {
        const foundUser = await User.findOne({ email });

        if (!foundUser) {
            const error = new Error("User not found");
            errors.email = error.message;
            return res.status(400).json({ errors });
        }

        foundUser.token = generateToken();

        const savedUser = await foundUser.save();

        recoverEmail(savedUser);

        res.status(200).json({ message: "We sent you an email" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const checkToken = async (req, res) => {
    const { token } = req.params;

    const foundUser = await User.findOne({ token });

    if (!foundUser) {
        const error = new Error("Token not valid");
        return res.status(403).json({ message: error.message });
    }

    res.status(200).json({ message: "Write your new password" });
};

export const restore = async (req, res) => {
    const { password, token } = req.body;

    try {
        const foundUser = await User.findOne({ token });

        if (!foundUser) {
            const error = new Error("Token not valid");
            return res.status(400).json({ message: error.message });
        }

        foundUser.token = "";
        foundUser.password = password;

        const savedUser = await foundUser.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const auth = async (req, res) => {
    const { user } = req;
    user.online = true;
    res.status(200).json(user);
};
