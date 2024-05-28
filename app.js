const express = require('express');
const mysql = require('mysql2/promise');
const { check, validationResult } = require('express-validator');
const methodOverride = require('method-override');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const fs = require('fs');
const https = require('https');
const axios = require('axios');
const qs = require('qs');
const jsforce = require('jsforce');
const salesforceAuth = require('./salesforceAuth');
require('dotenv').config();

const app = express();

const passwordResetTokens = new Map(); // Map to store password reset tokens

function generateToken() {
    return crypto.randomBytes(32).toString('hex'); // Function generating a random token
}

const connection = mysql.createPool({
    host: 'localhost',
    user: 'web',
    password: 'webPass',
    database: 'project'
});

connection.getConnection()
  .then(() => console.log('Connected to MySQL database'))
  .catch(err => {
    console.error('Error connecting to MySQL database:', err);
    process.exit(1);
  });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors({
    origin: ["http://suelem.westeurope.cloudapp.azure.com:3000"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
}));

app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const sessionStore = new MySQLStore({}, connection.promise());

app.use(session({
    key: "userId",
    secret: "nailStudio",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 24 * 1000,
    },
}));

app.set('view engine', 'ejs');

// Middleware to check if user is admin
function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === 'admin') {
        console.log('User is admin:', req.session.user);
        next();
    } else {
        console.log('User is not admin or not logged in:', req.session.user);
        res.status(403).send('Forbidden');
    }
}

// Define routes
app.get('/', (req, res) => {
    const loginUsername = req.session.user ? req.session.user.username : null;
    res.render('index', { loginUsername });
});

app.get('/welcome', (req, res) => {
    const welcomeMessage = req.session.welcomeMessage;
    const loginUsername = req.session.user ? req.session.user.username : null;
    res.render('welcome/welcome', { welcomeMessage, loginUsername });
});

app.get('/about', (req, res) => {
    const loginUsername = req.session.user ? req.session.user.username : null;
    res.render('about/about', { loginUsername });
});

app.get('/basket', (req, res) => {
    res.render('basket/basket');
});

app.get('/booking', (req, res) => {
    const loginUsername = req.session.user ? req.session.user.username : null;
    res.render('booking/booking', { loginUsername });
});

// CRUD Routes
app.get('/admin/products', isAdmin, async (req, res) => {
    const loginUsername = req.session.user ? req.session.user.username : null;
    try {
        const [products] = await connection.execute('SELECT * FROM products');
        res.render('admin/products', { products, loginUsername });
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).send('Error fetching products');
    }
});

app.get('/admin/products/create', isAdmin, (req, res) => {
    res.render('admin/create');
});

app.post('/admin/create', isAdmin, async (req, res) => {
    try {
        const { name, description, price, urlImg, keywords } = req.body;

        if (!name || !description || !price || !urlImg || !keywords) {
            return res.status(400).send('All fields are required');
        }

        const [result] = await connection.execute(
            'INSERT INTO products (name, description, price, urlImg, keywords) VALUES (?, ?, ?, ?, ?)',
            [name, description, price, urlImg, keywords]
        );

        if (result.affectedRows > 0) {
            res.redirect('/admin/products');
        } else {
            res.status(500).send('Failed to add product');
        }
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).send('Error creating product');
    }
});

app.get('/admin/products/edit/:id', isAdmin, async (req, res) => {
    try {
        const productId = req.params.id;
        const [productRows] = await connection.execute('SELECT * FROM products WHERE id = ?', [productId]);
        const product = productRows[0];

        if (!product) {
            return res.status(404).send('Product not found');
        }

        res.render('admin/edit', { product });
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).send('Error fetching product');
    }
});

app.post('/admin/products/edit/:id', isAdmin, async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, description, price, urlImg, keywords } = req.body;

        const [result] = await connection.execute(
            'UPDATE products SET name = ?, description = ?, price = ?, urlImg = ?, keywords = ? WHERE id = ?',
            [name, description, price, urlImg, keywords, productId]
        );

        if (result.affectedRows > 0) {
            res.redirect('/admin/products');
        } else {
            res.status(500).send('Failed to update product');
        }
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).send('Error updating product');
    }
});

app.delete('/admin/products/:id', isAdmin, async (req, res) => {
    try {
        const productId = req.params.id;
        const [result] = await connection.execute('DELETE FROM products WHERE id = ?', [productId]);

        if (result.affectedRows > 0) {
            res.redirect('/admin/products');
        } else {
            res.status(404).send('Product not found');
        }
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).send('Error deleting product');
    }
});

// Salesforce Routes
app.get('/admin/cases', isAdmin, async (req, res) => {
    try {
        const accessToken = await salesforceAuth();

        const conn = new jsforce.Connection({
            accessToken: accessToken,
            instanceUrl: process.env.SALESFORCE_URL,
        });

        const cases = await conn.query("SELECT Id, CaseNumber, Subject, Status, Priority, ContactId FROM Case");

        if (cases && cases.records) {
            const loginUsername = req.session.user ? req.session.user.username : null;
            res.render('admin/cases', { cases: cases.records, loginUsername });
        } else {
            res.status(404).json({ error: 'No cases found' });
        }
    } catch (error) {
        console.error('Error fetching cases:', error);
        res.status(500).json({ error: 'An error occurred while fetching cases' });
    }
});

// Other Routes
app.get('/contact', (req, res) => {
    const loginUsername = req.session.user ? req.session.user.username : null;
    res.render('contact/contact', { loginUsername });
});

app.get('/descriptiongallery/:type', (req, res) => {
    const loginUsername = req.session.user ? req.session.user.username : null;
    const type = req.params.type;
    res.render(`descriptiongallery/${type}`, { loginUsername });
});

app.get('/catalogue', (req, res) => {
    const loginUsername = req.session.user ? req.session.user.username : null;
    res.render('catalogue/catalogue', { loginUsername });
});

app.get('/login', (req, res) => {
    const registrationSuccess = false;
    res.render('login/login', { registrationSuccess });
});

app.get('/forgotPassword', (req, res) => {
    res.render('login/forgotPassword');
});

app.post('/forgotPassword', async (req, res) => {
    const { email } = req.body;
    try {
        const [users] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(404).send('User with this email does not exist.');
        }

        const token = generateToken();
        passwordResetTokens.set(token, { email, createdAt: Date.now() });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Password Reset',
            html: `<p>You requested a password reset. Click <a href="${process.env.APP_URL}/reset-password?token=${token}">here</a> to reset your password.</p>`,
        };

        await transporter.sendMail(mailOptions);

        res.send('Password reset link has been sent to your email.');
    } catch (error) {
        console.error('Error in forgotPassword route:', error);
        res.status(500).send('Error sending password reset link.');
    }
});

app.get('/reset-password', (req, res) => {
    const { token } = req.query;
    if (!token || !passwordResetTokens.has(token)) {
        return res.status(400).send('Invalid or expired token.');
    }
    res.render('login/resetPassword', { token });
});

app.post('/reset-password', async (req, res) => {
    const { token, password } = req.body;
    if (!token || !passwordResetTokens.has(token)) {
        return res.status(400).send('Invalid or expired token.');
    }

    const { email } = passwordResetTokens.get(token);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await connection.execute('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);
    passwordResetTokens.delete(token);

    res.send('Password has been reset successfully.');
});

app.get('/register', (req, res) => {
    res.render('register/register');
});

app.post('/register', [
    check('username').isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),
    check('email').isEmail().withMessage('Email is not valid'),
    check('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try {
        const [existingUser] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(409).send('User with this email already exists.');
        }

        const [result] = await connection.execute(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, "customer")',
            [username, email, hashedPassword]
        );

        if (result.affectedRows > 0) {
            req.session.user = {
                id: result.insertId,
                username: username,
                role: 'customer',
            };
            res.render('login/login', { registrationSuccess: true });
        } else {
            res.status(500).send('Error registering user');
        }
    } catch (error) {
        console.error('Error in register route:', error);
        res.status(500).send('Error registering user');
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).send('Invalid email or password.');
        }

        const user = users[0];
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            req.session.user = {
                id: user.id,
                username: user.username,
                role: user.role,
            };
            res.redirect('/welcome');
        } else {
            res.status(401).send('Invalid email or password.');
        }
    } catch (error) {
        console.error('Error in login route:', error);
        res.status(500).send('Error logging in user');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        res.redirect('/');
    });
});

// HTTPS Server Configuration
const options = {
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
};


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});