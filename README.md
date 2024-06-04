# All Nails Salon Website

# Overview 
All Nails Studio is a web application specifically designed for a nail salon, offering an easy and engaging experience for customers. Users can browse various services and products, book appointments, contact the salon for support, create a profile and manage their password.

This version is an enhanced version of the website which we've added an Admin Portal. This allows admin users to see products from the database, edit product information, create new products and delete products. The same CRUD is available for users contacts created in the portal. We have also added an integration with Salesforce for Chat funcionality in the Home page, and in the Admin Portal we have a dedicated page retrieving Cases created in Salesforce by the customers.

# Features
- User Authentication and Authorization
- Product Management (CRUD)
- User Management (CRUD)
- Booking System
- Salesforce Integration with Cases and Embedded Chat funcionality
- Password Reset Functionality
- User Sessions and Cookies
- CORS enabled for frontend integration
- Email notifications with Nodemailer

# Technologies Used
- Node.js
- Express.js
- MySQL
- EJS (Embedded JavaScript templating)
- Axios
- bcrypt for password hashing
- Nodemailer for email services
- jsforce for Salesforce integration
- CORS
- Session management with express-session
- Body parsing with body-parser
- Cookie parsing with cookie-parser

# Prerequisites
- Node.js and npm installed
- MySQL database or MarinaMB
- Salesforce account for integration
- .env file for environment variables

# Installation

1. Clone the repository:
git clone https://github.com/yourusername/all-nails-studio.git
cd all-nails-studio

2. Install dependencies:
npm install

3. Set up the MySQL database:

Create a database named project.
Import the SQL schema provided in the repository to create the required tables.

(or you can use the SQL schema to create a database in MarinaMB if using VM).

4. Configure environment variables:

Create a .env file in the root directory with the following variables:
SALESFORCE_URL=<your_salesforce_url>
SALESFORCE_CLIENT_ID=<your_salesforce_client_id>
SALESFORCE_CLIENT_SECRET=<your_salesforce_client_secret>
SALESFORCE_USERNAME=<your_salesforce_username>
SALESFORCE_PASSWORD=<your_salesforce_password>

5. Start the application:
node app.js

---
If you wish to login in the website as admin, follow these steps:
 - Start application using node app.js
 - Click in Hello, Sign in - Sign in
   Use the following admin credentails
   Username: suelem24
   Email: oliveira.suelem@hotmail.com
   Password: 15384Sj@

Once you are authenticated, you will be able to open the admin portal URL: admin/products
   
# Usage
# User Authentication
- Registration: Users can register with their details.
- Login: Users can log in with their username and password.
- Forgot Password: Users can request a password reset link via email.

# Admin Functionality
- Product Management: Admins can add, edit, delete, and view products.
- User Management: Admins can add, edit, delete, and view users.
- Salesforce Cases: Admins can view cases fetched from Salesforce.

# Routes
/: Home page
/welcome: Welcome page
/about: About page
/basket: Basket page
/booking: Booking page
/admin/products: View products (Admin only)
/admin/products/create: Create product (Admin only)
/admin/products/edit/:id: Edit product (Admin only)
/admin/users: View users (Admin only)
/admin/createuser: Create user (Admin only)
/admin/users/edituser/:id: Edit user (Admin only)
/admin/cases: View Salesforce cases (Admin only)
/contact: Contact page
/catalogue: Catalogue page
/login: Login page
/forgotPassword: Forgot password page
/resetPassword: Reset password page
/search: Search page

# Security
- Passwords are hashed using bcrypt.
- Sessions are managed securely.
- Access control implemented for admin routes.
