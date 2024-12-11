import Joi from "joi";

const signupValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        // confirmPassword: Joi.string().valid(Joi.ref('password')).required()
    })

    const { error } = schema.validate(req.body)
    if(error){
        return res.status(400).json({error})
    }
    next()
}

const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    })

    const {error} = schema.validate(req.body)
    if(error){
        return res.status(400).json({error: error})
    }
    next()
}

export {signupValidation, loginValidation}