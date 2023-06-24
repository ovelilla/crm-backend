import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const checkAuth = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        const error = new Error("Token is required");
        return res.status(401).json({ msg: error.message });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.id;

        req.user = await User.findById(userId).select("_id name email");

        return next();
    } catch (error) {
        const e = new Error("Token is not valid");
        return res.status(401).json({ msg: e.message });
    }
};
