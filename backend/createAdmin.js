const mongoose = require('mongoose');
const User = require('./models/user');
require('dotenv').config();

console.log('User model:', User);
console.log('User.findOne:', typeof User.findOne);

async function createAdmin() {
    try {
        await mongoose.connect(process.env.CONNECTION_STRING);

        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log('Admin već postoji:', existingAdmin.username);
            process.exit();
        }

        const adminUser = new User({
            username: 'sarabudimir',
            password: '123456', // plain text
            role: 'admin',
        });

        await adminUser.save();
        console.log('Admin korisnik kreiran!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

createAdmin();
