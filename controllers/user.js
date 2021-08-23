const Users = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userCtrl = {
    register,
    refreshToken,
    login
}

async function register(req, res) {
    try {
        const { name, email, password } = req.body;
        console.log(req.body)
        console.log(name)
        console.log(email)
        console.log(password)
        const user = await Users.findOne({ email })
        if (user) return res.status(400).json({ msg: "The email already exists" })

        if (password.length < 6)
            return res.status(400).json({ msg: "Password is at least 6 characters long" })

        //Password Encryption
        const passwordHash = await bcrypt.hash(password, 10)

        //Create new user instance
        const newUser = new Users({
            name, email, password: passwordHash
        })
        // Save mongodb
        await newUser.save()

        //Create jsonwebtoken for authentication
        const accesstoken = createAccessToken({ id: newUser._id })
        const refreshtoken = createRefreshToken({ id: newUser._id })

        res.cookie('refreshtoken', refreshtoken, {
            httpOnly: true,
            path: '/api/user/refresh_token'
        })
        // res.json({ password, passwordHash })
        res.json({ accesstoken })
        // res.json({ msg: "Register Successful" })

    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
}

function refreshToken(req, res) {
    try {
        const rf_token = req.cookies.refreshtoken;
        if (!rf_token) return res.status(400).json({ msg: "Please Login or Register" })

        jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(400).json({ msg: "Please Login or Register" })

            const accesstoken = createAccessToken({ id: user.id })

            res.json({ accesstoken })
        })
        res.json({ rf_token })
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body

        const user = await Users.findOne({ email })
        if (!user) return res.status(400).json({ msh: "User does not exist." })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ msh: "Invalid password" })

        const accesstoken = createAccessToken({ id: user._id })
        const refreshtoken = createRefreshToken({ id: user._id })

        res.cookie('refreshtoken', refreshtoken, {
            httpOnly: true,
            path: '/api/user/refresh_token'
        })
        res.json({ accesstoken })
        // res.json({ msg: "Login successful" })

    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
}

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}
const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

module.exports = userCtrl