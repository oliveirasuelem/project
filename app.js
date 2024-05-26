const express = require('express');
const mysql = require('mysql2/promise');
const { check, validationResult } = require('express-validator');
const methodOverride = require('method-override');
const https = require('https');
const fs = require('fs');

const session = require('express-session')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const path = require('path');
const bcrypt =  require('bcrypt');
const { result } = require('lodash');
const saltRounds = 10
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();
const axios = require('axios');
const qs = require('qs');

const crypto = require('crypto');
const passwordResetTokens = new Map();// Creating a map to store password reset tokens
function generateToken() {
    return crypto.randomBytes(32).toString('hex'); // Function generating a random token
}

require('dotenv').config();
app.use(methodOverride('_method'));



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

// Your domain URL without the port
const allowedOrigins = ["http://suelem.westeurope.cloudapp.azure.com:3000/admin/cases"];

// CORS configuration
app.use(
    cors({
        origin: allowedOrigins,
        methods: ["GET", "POST", "DELETE", "PUT"],
        credentials: true,
    })
);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true}));

app.use(
    session({
        key: "userId",
        secret: "nailStudio",
        resave: false,
        saveUninitialized: false,
        cookie: {
            express: 60 * 60 * 24,
        },
    })
);

  

app.use(express.static('public'));

app.set('view engine', 'ejs');

// Define routes
app.get('/', (req, res) => {
    const loginUsername = req.session.user ? req.session.user.username : null; // Check if the user is logged in and get the username
    res.render('index', { loginUsername });
});

app.get('/welcome', (req, res) => {
    // Check if the welcome message exists in the session
    const welcomeMessage = req.session.welcomeMessage;

    // Check if the user is logged in and get the username
    const loginUsername = req.session.user ? req.session.user.username : null;

    // Render the welcome page and pass the welcome message and login username
    res.render('welcome/welcome', { welcomeMessage, loginUsername });
});


app.get('/about', (req, res) => {
    const loginUsername = req.session.user ? req.session.user.username : null; // Check if the user is logged in and get the username
    res.render('about/about', { loginUsername });
});

app.get('/basket', (req, res) => {
    res.render('basket/basket');
});



app.get('/booking', (req, res) => {
    const loginUsername = req.session.user ? req.session.user.username : null; // Check if the user is logged in and get the username
    res.render('booking/booking', { loginUsername });
});

//CRUD
// Route to fetch products and render admin page
app.get('/admin/products', async (req, res) => {
    const loginUsername = req.session.user ? req.session.user.username : null;
    try {
        const [products] = await connection.execute('SELECT * FROM products'); // Fetch all products from the database
        res.render('admin/products', { products, loginUsername });
    } catch (err) {
        console.error('Error fetching products:', err); // Log the error details
        res.status(500).send('Error fetching products');
    }
});

// Route to render the create product form
app.get('/admin/products/create', (req, res) => {
    // Render the create product form
    res.render('admin/create');
});


// Route to handle the creation of a new product
app.post('/admin/create', async (req, res) => {
    try {
        const { name, description, price, urlImg, keywords } = req.body;

              // Validate input (ensure all fields are provided)
              if (!name || !description || !price || !urlImg || !keywords) {
                return res.status(400).send('All fields are required');
            }
    
  
        // Insert the new product into the database
        const [result] = await connection.execute(
            'INSERT INTO products (name, description, price, urlImg, keywords) VALUES (?, ?, ?, ?, ?)',
            [name, description, price, urlImg, keywords]
        );

        if (result.affectedRows > 0) {
            // Product added successfully
            res.redirect('/admin/products');
        } else {
            res.status(500).send('Failed to add product');
        }
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).send('Error creating product');
    }
});

  
// Route to render the edit product form and pass the product data
app.get('/admin/products/edit/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const [productRows] = await connection.execute('SELECT * FROM products WHERE id = ?', [productId]);
        const product = productRows[0]; // Assuming there's only one product with this ID
      
        if (!product) {
            return res.status(404).send('Product not found');
        }
      
        // Render the edit product form and pass the product data
        res.render('admin/edit', { product });
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).send('Error fetching product');
    }
});

// Route to handle updating an existing product
app.post('/admin/products/edit/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, description, price, urlImg, keywords } = req.body;

        // Perform the update operation in the database
        const [result] = await connection.execute(
            'UPDATE products SET name = ?, description = ?, price = ?, urlImg = ?, keywords = ? WHERE id = ?',
            [name, description, price, urlImg, keywords, productId]
        );

        if (result.affectedRows > 0) {
            // Product updated successfully
            res.redirect('/admin/products');
        } else {
            res.status(500).send('Failed to update product');
        }
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).send('Error updating product');
    }
});

// Route to handle delete product

app.delete('/admin/products/:id', async (req, res) => {
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

// Route to render cases page
app.get('/admin/cases', (req, res) => {
    // Render the create product form
    res.render('admin/cases');
});


app.get('/admin/cases', (req, res) => {
    const welcomeMessage = req.session.welcomeMessage;

    const loginUsername = req.session.user ? req.session.user.username : null;
    res.render('/admin/cases', { welcomeMessage, loginUsername });
});
app.get('/contact', (req, res) => {
    const loginUsername = req.session.user ? req.session.user.username : null; // Check if the user is logged in and get the username
    res.render('contact/contact', { loginUsername });
});

app.get('/descriptiongallery/baseCoat', (req, res) => {
    const loginUsername = req.session.user ? req.session.user.username : null; // Check if the user is logged in and get the username
    res.render('descriptiongallery/baseCoat', { loginUsername });
});

app.get('/descriptiongallery/cuticuleOil', (req, res) => {
    const loginUsername = req.session.user ? req.session.user.username : null; // Check if the user is logged in and get the username
    res.render('descriptiongallery/cuticuleOil', { loginUsername });
});
app.get('/descriptiongallery/handCream', (req, res) => {
    const loginUsername = req.session.user ? req.session.user.username : null; // Check if the user is logged in and get the username
    res.render('descriptiongallery/handCream', { loginUsername });
});

app.get('/descriptiongallery/nailgrowth', (req, res) => {
    const loginUsername = req.session.user ? req.session.user.username : null; // Check if the user is logged in and get the username
    res.render('descriptiongallery/nailgrowth', { loginUsername });
});

app.get('/descriptiongallery/Nailstrengthener', (req, res) => {
    const loginUsername = req.session.user ? req.session.user.username : null; // Check if the user is logged in and get the username
    res.render('/descriptiongallery/Nailstrengthener', { loginUsername });
});


app.get('/descriptiongallery/polishremover', (req, res) => {
    const loginUsername = req.session.user ? req.session.user.username : null; // Check if the user is logged in and get the username
    res.render('descriptiongallery/polishremover', { loginUsername });
});


app.get('/catalogue', (req, res) => {
    const loginUsername = req.session.user ? req.session.user.username : null; // Check if the user is logged in and get the username
    res.render('catalogue/catalogue', { loginUsername });
});
app.get('/login', (req, res) => {
    
    const registrationSuccess = false; 
    res.render('login/login', { registrationSuccess });
});


app.get('/forgotPassword', (req, res) => {
    res.render('forgotPassword/forgotPassword');
});

app.get('/resetPassword', (req, res) => {
    res.render('resetPassword/resetPassword');
});


app.get('/search', async (req, res) => {
    try {
        const loginUsername = req.session.user ? req.session.user.username : null; // Set loginUsername
        const searchQuery = req.query.query;
        const searchTerms = searchQuery.split(/\s+/).filter(term => term.length > 0);
        
        const queryConditions = searchTerms.map(term => '(name LIKE ? OR id = ? OR keywords LIKE ?)').join(' OR ');
        const queryParams = searchTerms.flatMap(term => [`%${term}%`, parseInt(term) || 0, `%${term}%`]); // Convert term to integer for id comparison
        const queryString = `SELECT id, name, description, price, urlImg, descriptionGalleryPath FROM products WHERE ${queryConditions}`;
    
        const [rows, fields] = await connection.execute(queryString, queryParams);
        res.render('search/search', { products: rows, loginUsername }); // Pass loginUsername to the view
    } catch (error) {
        console.error('Error fetching products from the database:', error);
        res.status(500).send('Internal Server Error');
    }
});


let registrationInProgress = false;
    registrationSuccess = false;

app.post('/saveData', [
    check('registerUsername', 'Username must start with a lowercase letter, must be 3-15 characters long')
        .matches(/^[a-z][a-z0-9\s]{2,14}$/) 
        .withMessage('Invalid username format'), 

    check('registerEmail', 'Email length should be 10 to 30 characters')
        .isEmail().isLength({ min: 10, max: 30 }),

    check('registerPassword', 'Password length should be 8 to 10 characters')
        .isLength({ min: 8, max: 15 }),

    check('registerConfirmPassword', 'Password length should be 8 to 10 characters')
        .isLength({ min: 8, max: 15 }),

    check('phone', 'Mobile number should contain 10 digits')
        .isLength({ min: 10, max: 10 }),
        
], async (req, res) => {
    // Check if registration is already in progress
    if (registrationInProgress) {
        return res.status(400).json({ error: 'Registration already in progress' });
    }

    // Set registration in progress flag to true
    registrationInProgress = true;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Reset registration in progress flag
        registrationInProgress = false;
        return res.status(400).json({ errors: errors.array() });
    }

    // Extract data from the request
    const { registerUsername, registerEmail, registerPassword, phone, registerGender, registerDob } = req.body;

    try {
        // Check if username or email already exists in the database
        const [existingUsers] = await connection.execute(
            `SELECT * FROM users WHERE username = ? OR email = ?`,
            [registerUsername, registerEmail]
        );

        // If username or email already exists, return an error
        if (existingUsers.length > 0) {
            // Reset registration in progress flag
            registrationInProgress = false;
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(registerPassword, 20);

        // Insert new record
        const insertQuery = `INSERT INTO users (username, email, user_password, phone_number, gender, birth_date) VALUES (?, ?, ?, ?, ?, ?)`;
        await connection.execute(insertQuery, [registerUsername, registerEmail, hashedPassword, phone, registerGender, registerDob]);
        
        console.log(`${registerUsername} Record inserted successfully`);

        // Reset registration in progress flag
        registrationInProgress = false;

        // Set registration success flag to true
        const registrationSuccess = true;

       // Passing the flag to the template.
        res.render('login/login', { registrationSuccess });
    } catch (error) {
        console.error('Error inserting record:', error);
        res.status(500).json({ error: 'Internal Server Error' });

        // Reset registration in progress flag
        registrationInProgress = false;
    }
});


app.post('/login', async (req, res) => {
    const { loginUsername, loginPassword } = req.body;

    try {
        // Fetch user data from the database based on the provided username
        const [rows] = await connection.execute(
            "SELECT * FROM users WHERE username = ?",
            [loginUsername]
        );

        // If no user found with the given username, return an error message
        if (rows.length === 0) {
            console.error(`Login failed: User not found with username: ${loginUsername}`);
            return res.status(400).json({ error: 'User not found' });
        }

        const user = rows[0];

        // Compare the provided password with the hashed password stored in the database
        const passwordMatch = await bcrypt.compare(loginPassword, user.user_password);

        // If passwords don't match, return an error message
        if (!passwordMatch) {
            console.error(`Login failed: Invalid password for username: ${loginUsername}`);
            return res.status(400).json({ error: 'Invalid username/password combination' });
        }

        // Set up the session if login is successful
        req.session.user = user;
        console.log(`User ${user.username} logged in successfully`);

        // Redirect to the welcome page with a welcome message
        req.session.welcomeMessage = `Welcome, ${loginUsername} to All Nails Studio!`;
        res.redirect('/welcome');
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'allnailscustomer@hotmail.com',
        pass: '15384123@A'
    },
    tls: {
        rejectUnauthorized: false
    }
});

app.post('/forgotPassword', async (req, res) => {
    const { email } = req.body;

    // Generate a password reset token
    const token = generateToken();

    // Save the token in a map associated with the email address
    passwordResetTokens.set(email, token);

    try {
        // Logic for sending the email with the password reset link here
        const resetLink = `http://localhost:3000/resetPassword?token=${token}`;
        

        const mailOptions = {
            from: 'allnailscustomer@hotmail.com',
            to: email,
            subject: 'Password Reset Link',
            text: `Click the following link to reset your password: ${resetLink}`
        };

        await transporter.sendMail(mailOptions);
        console.log('Password reset link sent successfully.');

        res.status(200).json({ message: 'Password reset link sent successfully.' });
    } catch (error) {
        console.error('Error sending password reset email:', error);
        res.status(500).json({ error: 'An error occurred while sending the password reset email.' });
    }
});

app.post('/resetPassword', async (req, res) => {
    const { token, newPassword } = req.body;

    // Check if the token is valid and not expired
    console.log("Token received:", token);
    console.log("New password:", newPassword);

    if (passwordResetTokens.has(token)) {
        console.log("Token is valid and not expired");
        // Retrieve the email associated with the token
        const email = passwordResetTokens.get(token);
        console.log("Email associated with the token:", email);

        try {
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
            console.log("Password hashed successfully");

            // Perform database update operation to reset the password
            const resetPasswordQuery = 'UPDATE users SET user_password = ? WHERE email = ?';
            const [result] = await connection.execute(resetPasswordQuery, [hashedPassword, email]);

            if (result.affectedRows > 0) {
                // Password reset successfully
                console.log("Password reset successfully");
                passwordResetTokens.delete(token); // Remove the token from the map after use
                res.redirect('/login');
            } else {
                // Failed to reset password
                console.error("Failed to reset password");
                res.status(500).json({ error: 'Failed to reset password.' });
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            res.status(500).json({ error: 'An error occurred while resetting the password.' });
        }
    } else {
        console.log("Invalid or expired token");
        res.status(400).json({ error: 'Invalid or expired token.' });
    }
});





// New route for handling contact form submission
app.post('/contact', (req, res) => {
    // Handle the form submission here
    const { fullname, email, description } = req.body;
    console.log('Received form submission:', fullname, email, description);

    // Create email message
    const mailOptions = {
        from: 'allnailscustomer@hotmail.com',
        to: 'allnailscustomer@hotmail.com',
        subject: 'New Contact Form Submission',
        text: `Name: ${fullname}\nEmail: ${email}\nMessage: ${description}`
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('Email sent:', info.response);
            // Send a pop-up message to the user
            res.send('<script>alert("Form submitted successfully"); window.location.href="/";</script>');
        }
    });
});



app.get('/logout', (req, res) => {
    // Check if the user is logged in
    if (req.session.user) {
        // Get the username from the session
        const username = req.session.user.username;
        console.log(`User ${username} logged out`);                                    // Log the username who logged out
        const goodbyeMessage = `Goodbye, ${username}. We hope to see you again soon!`; // Create the goodbye message
        req.session.destroy();                                                         // Destroy the session
        res.render('logout/logout', { goodbyeMessage });                               // Pass the goodbye message to the logout page
    } else {
        // If the user is not logged in, redirect to the login page
        res.redirect('/login');
    }
});

app.get('/services', (req, res) => {
    const loginUsername = req.session.user ? req.session.user.username : null; // Check if the user is logged in and get the username
    res.render('services/services', { loginUsername });
});



app.get('/team', (req, res) => {
    const loginUsername = req.session.user ? req.session.user.username : null; // Check if the user is logged in and get the username
    res.render('team/team', { loginUsername });
});


app.get('*', (req, res) => {
    res.status(404).send('Resource not found');
});



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});