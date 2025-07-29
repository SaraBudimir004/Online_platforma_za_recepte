require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const protect = require('./middlewares/authMiddleware')
const connectDB = require('./config/dbConnection');
connectDB();

const indexRouter = require('./routes/index');
const adminRouter = require('./routes/adminRoutes');
const userRouter = require('./routes/userRoutes');
const guestRouter = require('./routes/guestRoutes');
const recipeRoutes = require("./routes/recipeRoutes");
const profilUser = require("./routes/profilUserRoutes");

const app = express();

const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:5177',
    credentials: true,
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Serviranje uploadanih slika
app.use('/upload', express.static(path.join(__dirname, 'upload'))); // pristup uploadanim slikama

app.use('/', indexRouter);
app.use('/auth', adminRouter);
app.use('/user', userRouter);
app.use('/guest', guestRouter);
app.use('/api/recipes', recipeRoutes);
app.use('/profile', profilUser);

module.exports = app;
