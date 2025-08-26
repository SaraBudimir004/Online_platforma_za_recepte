const UserProfile = require('../models/profilUser');

// Profil korisnika
exports.getUserProfile = async (req, res) => {
    try {
        const profile = await UserProfile.findOne({ userId: req.user.id });
        res.json(profile || {});
    } catch (error) {
        res.status(500).json({ message: 'Greška pri dohvaćanju profila' });
    }
};

// Spremanje profila
exports.updateUserProfile = async (req, res) => {
    try {
        const { fullName, birthYear, city, contactEmail, bio } = req.body;

        let profile = await UserProfile.findOne({ userId: req.user.id });

        if (profile) {
            // update
            profile.fullName = fullName;
            profile.birthYear = birthYear;
            profile.city = city;
            profile.contactEmail = contactEmail;
            profile.bio = bio;
            await profile.save();
        } else {
            // create
            profile = new UserProfile({
                userId: req.user.id,
                fullName,
                birthYear,
                city,
                contactEmail,
                bio
            });
            await profile.save();
        }

        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Greška pri spremanju profila' });
    }
};
