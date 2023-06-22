import User from "../models/user.model.js";
import generateToken from "../helpers/generateToken.js";
import generateJWT from "../helpers/generateJWT.js";
import registerEmail from "../helpers/registerEmail.js";
import recoverEmail from "../helpers/recoverEmail.js";

export const register = async (req, res) => {
    const { email, password } = req.body;

    try {
        const foundUser = await User.findOne({ email });

        if (foundUser) {
            const error = new Error("User already exists");
            return res.status(400).json({ email: error.message });
        }

        const newUser = new User({
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
        const user = await User.findOne({ token });

        if (!user) {
            const error = new Error("Token is not valid");
            return res.status(403).json({ message: error.message });
        }

        user.token = "";
        user.confirmed = true;

        await user.save();

        res.status(200).json({ message: "User confirmed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            const error = new Error("El usuario no existe");
            errors.email = error.message;
            return res.status(404).json({ errors });
        }

        if (!user.confirmed) {
            const error = new Error("Tu cuenta no ha sido confirmada");
            errors.email = error.message;
            return res.status(404).json({ errors });
        }

        if (!(await user.comparePassword(password))) {
            const error = new Error("El password es incorrecto");
            errors.password = error.message;
            return res.status(404).json({ errors });
        }

        await User.findByIdAndUpdate(user._id, {
            lastConnection: Date.now(),
            isConnected: true,
        });

        const token = generateJWT(user.id);

        res.cookie("access_token", token, {
            expires: new Date(Date.now() + 24 * 3600000),
            sameSite: "none",
            secure: true,
            httpOnly: true,
        });

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } catch (error) {
        console.log(error);
    }
};

export const logout = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, { isConnected: false });

        res.clearCookie("access_token", {
            expires: new Date(Date.now() - 1),
            sameSite: "none",
            secure: true,
            httpOnly: true,
        });

        res.status(200).json({ message: "Sesión cerrada correctamente" });
    } catch (error) {
        console.log(error);
    }
};

export const recover = async (req, res) => {
    const { email } = req.body;

    const errors = {};

    if (!email) {
        const error = new Error("El email es obligatorio");
        errors.email = error.message;
    }

    if (email && !isValidEmail(email)) {
        const error = new Error("El email no es válido");
        errors.email = error.message;
    }

    if (Object.keys(errors).length) {
        return res.status(400).json({ errors });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            const error = new Error("El usuario no existe");
            errors.email = error.message;
            return res.status(400).json({ errors });
        }

        user.token = generateToken();

        await user.save();

        recoverEmail({ name: user.name, email: user.email, token: user.token });

        res.status(200).json({
            message: "Hemos enviado un email con las instrucciones",
        });
    } catch (error) {
        console.log(error);
    }
};

export const checkToken = async (req, res) => {
    const { token } = req.body;

    const user = await User.findOne({ token });

    if (!user) {
        const error = new Error("Token no válido");
        return res.status(403).json({ message: error.message });
    }

    res.status(200).json({ message: "Introduce tu nuevo password" });
};

export const restore = async (req, res) => {
    const { password, token } = req.body;

    const errors = {};

    if (!password) {
        const error = new Error("El password es obligatorio");
        errors.password = error.message;
    }

    if (password && password.length < 6) {
        const error = new Error(
            "El password debe contener al menos 6 caracteres"
        );
        errors.password = error.message;
    }

    if (Object.keys(errors).length) {
        return res.status(400).json({ errors });
    }

    try {
        const user = await User.findOne({ token });

        if (!user) {
            const error = new Error("Token no válido");
            return res.status(400).json({ message: error.message });
        }

        user.token = "";
        user.password = password;

        await user.save();

        res.status(200).json({ message: "Password actualizado correctamente" });
    } catch (error) {
        console.log(error);
    }
};

export const auth = async (req, res) => {
    const { user } = req;
    res.status(200).json(user);
};
