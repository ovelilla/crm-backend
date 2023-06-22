export const validateSchema = (schema) => (req, res, next) => {
    const data = {
        ...req.body,
        ...req.params,
        ...req.query,
    };

    try {
        schema.parse(data);
        next();
    } catch (error) {
        const errors = {};
        error.errors.forEach((validationError) => {
            const key = validationError.path[0];
            const message = validationError.message;
            errors[key] = message;
        });

        return res.status(400).json({ errors });
    }
};
