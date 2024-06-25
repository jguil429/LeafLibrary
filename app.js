// if(process.env.Node_ENV !== 'production'){
//     require('dotenv').config();
// }
//
// const express = require('express');
// const session = require('express-session');
// const flash = require('connect-flash');
// const path = require('path');
// const mongoose = require('mongoose');
// const ejsMate = require('ejs-mate');
// const ExpressError = require('./utils/ExpressError');
// const methodOverride = require('method-override');
// const passport = require('passport');
// const LocalStrategy = require('passport-local');
// const User = require('./models/user');
// const mongoSanitize = require('express-mongo-sanitize');
// const helmet = require('helmet');
//
// const userRoutes = require('./routes/users');
// const plantRoutes = require('./routes/plants');
// const updateRoutes = require('./routes/updates');
// const MongoStore = require('connect-mongo');
// const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/plantlib';
//
//
//
// mongoose.connect(dbUrl);
//
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', () => {
//     console.log("Connected")
// });
//
// const app = express();
//
// const dateHelper = require('./utils/dateHelper');
// app.locals.dateHelper = dateHelper;
//
// app.engine('ejs', ejsMate);
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));
//
// app.use(express.urlencoded({extended: true}));
// app.use(methodOverride('_method'));
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(mongoSanitize());
// app.use(helmet({ contentSecurityPolicy: false }));
//
// const secret = process.env.SECRET || 'secret!'
//
// const store = MongoStore.create({
//     mongoUrl: dbUrl,
//     touchAfter: 24 * 60 * 60,
//     crypto: {
//         secret
//     }
// });
//
// const sessionConfig = {
//     store,
//     name: 'sesh',
//     secret,
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         httpOnly: true,
//         // secure: true,
//         expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
//         maxAge: 1000 * 60 * 60 * 24 * 7,
//     }
// }
// app.use(session(sessionConfig));
// app.use(flash());
//
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
//
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
//
// app.use((req, res, next) => {
//     res.locals.currentUser = req.user;
//     res.locals.success = req.flash('success');
//     res.locals.error = req.flash('error');
//     next();
// });
//
// app.locals.currentYear = new Date().getFullYear();
//
// app.use('/', userRoutes);
// app.use('/plants', plantRoutes);
// app.use('/plants/:id/updates', updateRoutes);
//
// app.get('/', (req, res) => {
//     res.render('home');
// });
//
// app.use((err, req, res, next) => {
//     const { statusCode = 500 } = err;
//         if(!err.message) err.message = "Problem Detected";
//     res.status(statusCode).render('error', {err});
// });
//
// app.all('*', (req, res, next) => {
//     next(new ExpressError('Page Not Found', 404))
// });
//
// const port = process.env.PORT || 3030;
//
// //for Jordan's local
// app.listen(port, () => {
//     console.log(`Port ${port}`)
// });

//for Jennie's local
// app.listen(3000, () => {
//     console.log('Port 3000')
// });

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const userRoutes = require('./routes/users');
const plantRoutes = require('./routes/plants');
const updateRoutes = require('./routes/updates');
const MongoStore = require('connect-mongo');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/plantlib';

mongoose.connect(dbUrl)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Error connecting to MongoDB:", err));

const app = express();

const dateHelper = require('./utils/dateHelper');
app.locals.dateHelper = dateHelper;

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());
app.use(helmet({ contentSecurityPolicy: false }));

const secret = process.env.SECRET || 'secret!';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});

const sessionConfig = {
    store,
    name: 'sesh',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.locals.currentYear = new Date().getFullYear();

app.use('/', userRoutes);
app.use('/plants', plantRoutes);
app.use('/plants/:id/updates', updateRoutes);

app.get('/', (req, res) => {
    res.render('home');
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Problem Detected";
    res.status(statusCode).render('error', { err });
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

const port = process.env.PORT || 3030;

app.listen(port, () => {
    console.log(`Port ${port}`);
});
