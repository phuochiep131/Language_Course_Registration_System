const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/jwt');

const randomid = async () => {    
    let userid;
    let isUnique = false;

    while(!isUnique){
        const randomNumber = Math.floor(Math.random() * 100000)
        const formattedId = `8386${randomNumber.toString().padStart(6, '0')}`;

        const existingId = await User.findOne({ userid: formattedId });
        if (!existingId) {
            userid = formattedId;
            isUnique = true;
        }
    }
    return userid
}

const register = async (req, res) => {
    const { username, password, fullname, email, role, avatar } = req.body;

    try {        
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        const userid = await randomid()
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            userid,
            username,
            password: hashedPassword,
            email,
            fullname,
            role: role ? role : 'Student',
            avatar: avatar ? avatar : "https://cdn-icons-png.flaticon.com/512/8792/8792047.png"
        });

        await newUser.save();

        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


const login = async (req, res) => {
    const { username, password } = req.body;

    //console.log("Login attempt:", username)

    try {
        const user = await User.findOne({ username });

        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const secretKey = "LangCourse";

        const token = jwt.sign({ user: { id: user._id, username: user.username, role: user.role} }, secretKey, {
            expiresIn: '6h',
        });
        
        res.cookie('token', token, { httpOnly: true });
        res.json({ token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const logout = async (req, res) => {
    try {
        // Gỡ bỏ token từ cookie
        res.clearCookie('token');

        res.json({ message: 'Logout successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    register,
    login,
    logout,
};
