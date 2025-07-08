import User from '../models/user.model.js';
import Preference from '../models/preference.model.js';
import bcrypt from 'bcryptjs';
import { sendVerificationToken } from '../nodemailer/email.js';

export const createAccout = async (req, res) => {
    const { firstName, lastName, gender, birthday, email, password } = req.body;
    const role = "user"
    let status = "Unverified";

    const checkExists = await User.findOne({ email: email });

    if (checkExists) {
        return res.status(400).json({ success: false, message: "An account with that Email already exists." });
    };

    if (!firstName || !lastName || !gender || !birthday || !email || !password || !role) {
        return res.status(400).json({ success: false, message: "There is an empty field." });
    };

    if (role === "admin" || role === "super admin") {
        status = "Verified";
    };

    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const encryptedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await User.create({ firstName: firstName, lastName: lastName, gender: gender, birthday: birthday, email: email, password: encryptedPassword, status: status, role: role, verificationToken: verificationToken });
        if (status !== "Verified") {
            sendVerificationToken(email, verificationToken);
        };
        res.status(201).json({ success: true, message: "User created successfully.", data: { ...user.toObject(), password: undefined } });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Cannot create user.", error: error.message });
    }
};

export const fetchUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ success: false, message: "An account with that ID does not exist." });
        };
        return res.status(200).json({ success: true, message: "User fetched successfully.", data: { ...user.toObject(), password: undefined } })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Cannot fetch user.", error: error.message })
    }
};

export const updateUserProfile = async (req, res) => {
    const { data, email } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ success: false, message: "An account with that Email does not exist." });
        };
        if (data.firstName && data.firstName.trim() !== '') {
            user.firstName = data.firstName;
        }
        if (data.lastName && data.lastName.trim() !== '') {
            user.lastName = data.lastName;
        }
        if (data.gender && data.gender.trim() !== '') {
            user.gender = data.gender;
        }
        if (data.birthday && data.birthday.trim() !== '') {
            user.birthday = data.birthday;
        }
        if (data.profileIcon && data.profileIcon.trim() !== '') {
            user.profileIcon = data.profileIcon;
        }
        await user.save();
        return res.status(200).json({ success: true, message: "Profile updated successfully.", data: user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Cannot update user profile.", error: error.message });
    }
}

export const fetchPreferences = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ success: false, message: "An account with that ID does not exist." });
        };
        let preference = await Preference.findOne({ userId: user._id });
        if (!preference) {
            preference = new Preference({
                userId: user._id,
                preferredName: `${user.firstName} ${user.lastName}`,
                preferredTone: 'formal',
                toolFamiliarity: 'unfamiliar',
                skillLevel: 'beginner'
            });
            await preference.save();
        }
        return res.status(200).json({ success: true, message: "User preference fetched successfully.", data: preference });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Cannot fetch user preference.", error: error.message });
    }
}

export const updatePreferences = async (req, res) => {
    const { data, email } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ success: false, message: "An account with that Email does not exist." });
        };
        let preference = await Preference.findOne({ userId: user._id });
        if (!preference) {
            preference = new Preference({
                userId: user._id,
                preferredName: data.preferredName.trim() || `${user.firstName} ${user.lastName}`,
                preferredTone: data.preferredTone.trim() || 'formal',
                toolFamiliarity: data.toolFamiliarity.trim() || 'unfamiliar',
                skillLevel: data.skillLevel.trim() || 'beginner',
            });
        } else {
            if (data.preferredName && data.preferredName.trim() !== '') {
                preference.preferredName = data.preferredName;
            }
            if (data.preferredTone && data.preferredTone.trim() !== '') {
                preference.preferredTone = data.preferredTone;
            }
            if (data.toolFamiliarity && data.toolFamiliarity.trim() !== '') {
                preference.toolFamiliarity = data.toolFamiliarity;
            }
            if (data.skillLevel && data.skillLevel.trim() !== '') {
                preference.skillLevel = data.skillLevel;
            }
            if (data.searchTerm && data.searchTerm.trim() !== '') {
                const term = data.searchTerm.trim();
                if (!preference.previousSearches) {
                    preference.previousSearches = [];
                }
                preference.previousSearches = preference.previousSearches.filter(t => t !== term);
                preference.previousSearches.unshift(term);
                if (preference.previousSearches.length > 5) {
                    preference.previousSearches = preference.previousSearches.slice(0, 5);
                }
            }
            if (data.removeSearch && data.removeSearch.trim() !== '') {
                const toRemove = data.removeSearch; 
                const newSearches = preference.previousSearches.filter(t => t !== toRemove);
                preference.previousSearches = newSearches;
            }
            if (data.removeAll === 'yes') {
                preference.previousSearches = []
            }
        }
        await preference.save();
        return res.status(200).json({ success: true, message: "Preferences updated successfully.", data: preference });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Cannot update preference user.", error: error.message });
    }
}


