import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { sendVerificationToken } from '../nodemailer/email.js';

export const createAccout = async (req, res) => {
    const {firstName, lastName, gender, birthday, email, password} = req.body;
    const role = "user"
    let status = "Unverified";
    
    const checkExists = await User.findOne({email: email});
    
    if (checkExists) {
        return res.status(400).json({success: false, message: "An account with that Email already exists."});
    };

    if (!firstName || !lastName || !gender || !birthday || !email || !password || !role) {
        return res.status(400).json({success: false, message: "There is an empty field."});
    };

    if (role === "admin" || role === "super admin") {
        status = "Verified";
    };

    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const encryptedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await User.create({firstName: firstName, lastName: lastName, gender: gender, birthday: birthday,email: email, password: encryptedPassword,status: status, role: role, verificationToken: verificationToken});
        if (status !== "Verified"){
            sendVerificationToken(email, verificationToken);
        };
        res.status(201).json({success: true, message: "User created successfully.", data:{ ...user.toObject(), password: undefined}});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Cannot create user.", error: error.message});
    }
}