const jsforce = require('jsforce');
require('dotenv').config();

const salesforceAuth = async () => {
    const conn = new jsforce.Connection();

    try {
        // Login to Salesforce
        await conn.login(process.env.SALESFORCE_USERNAME, process.env.SALESFORCE_PASSWORD + process.env.SALESFORCE_TOKEN);

        console.log('Successfully authenticated with Salesforce');
        return conn.accessToken;
    } catch (error) {
        console.error('Error authenticating with Salesforce:', error);
        throw error;
    }
};

module.exports = salesforceAuth;
