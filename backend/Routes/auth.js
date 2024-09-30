// import { authMiddleware } from "../middleware/middleware";
const { authMiddleware } = require('../middleware/middleware')
const Router = require("express");
const router = Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken')
const { google } = require('googleapis');
const axios = require('axios')
// Replace with your actual credentials
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const refreshToken = process.env.REFRESH_TOKEN;
const ScriptApp = require('googleapis')
// Create a Google Forms API client
const auth = new google.auth.OAuth2(clientId, clientSecret, refreshToken);
auth.setCredentials({ refresh_token: refreshToken });
// const googleAppsScriptUrl = 'https://script.google.com/macros/s/AKfycbx7lMazUmskl0QAYoZ9YA-7RvVk4ex9tfh_aQrUKXzY/dev';

// Predefined Answers
// const googleAppsScriptUrl = 'https://script.google.com/macros/s/AKfycbw7Z2TB19dsdoWW7fmw8IZAfDA-41zGlkekOICxfGrh_P_MufjR4EBCbJQSjDFFNCbsiw/exec';

// Answers from the body
// const googleAppsScriptUrl = 'https://script.google.com/macros/s/AKfycbwK29a2riZBe0BvTq8WpSCz6IFYPFhsp3eNrTSvGHKB9pHO2kK8RMAqPI2pTsCc2GCBsg/exec';

// Updated Answers from the body
const googleAppsScriptUrl = 'https://script.google.com/macros/s/AKfycbwv33XTp9TBuP7BtYurGR7d6pEcTX35H5A9nGFbPfO8gaFnnJeUuMxX8f2Nta24Xg2R/exec';


// Login route
router.post("/login", async (req, res) => {
    console.log("Login request received");
    const { address } = req.body;
    console.log("Address:", address);

    try {
        // Find the user with the provided wallet address using Prisma
        let user = await prisma.voter.findFirst({
            where: { walletAddress: address },
        });

        if (user) {
            const token = jwt.sign({
                userId: user.id
            }, process.env.JWT_SECRET)

            res.json({
                message: "Login successful",
                token, userId: user.id
            })
            // console.log("I am existing user " + token)
        } else {
            const user = await prisma.voter.create({
                data: {
                    walletAddress: address,
                }
            })

            const token = jwt.sign({
                userId: user.id
            }, process.env.JWT_SECRET)

            res.json({
                message: "Login successful",
                token, userId: user.id
            })
        }

        // Respond with the user ID
        // res.json({ message: "Login successful", userId: user.id });
    } catch (error) {
        console.log("Error logging in:", error);
        res.status(500).json({ error: error.message });
    }
});

// Shareable question link
router.get("/questions/:id/link", async (req, res) => {
    const questionId = req.params.id;
    const link = `http://your-app-url.com/questions/${questionId}`;

    res.json({ link });
});

router.post('/submitPrefilledForm', async (req, res) => {
    const { prefilledUrl } = req.body; // Extract the pre-filled URL from the request body

    try {
        // Submit the form response
        await axios.get(prefilledUrl);
        console.log("Form Submitted")
        res.status(200).json({ message: 'Form response submitted successfully' });
    } catch (error) {
        console.error('Error submitting form response:', error);
        res.status(500).json({ error: 'Error submitting form response' });
    }
});

router.post('/getPrefilledUrl', async (req, res) => {
    const { formId, answers } = req.body; // Extracting formId and answers from the request body
    console.log('Form ID:', formId);
    console.log('Answers:', answers);

    try {
        // var token = ScriptApp.getOAuthToken();
        // Making a POST request to Google Apps Script web app with formId and answers
        const response = await axios.post(
            googleAppsScriptUrl, // Your Google Apps Script web app URL
            {
                formId: formId,
                answers: answers
            },
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}` // Ensure to pass the OAuth token for authorization
                }
            }
        );

        // Check if the response contains valid JSON data
        if (!response.headers['content-type'].includes('application/json')) {
            return res.status(500).json({
                error: 'Unexpected response format. Please check the web app permissions and URL.'
            });
        }

        // Sending the prefilled URL back to the client
        const { prefilledUrl } = response.data; // Destructure to get prefilled URL from response
        res.status(200).json({ prefilledUrl });

    } catch (error) {
        console.error('Error fetching prefilled URL:', error);

        // Handling specific cases for better error messaging
        if (error.response && error.response.status === 401) {
            return res.status(401).json({ error: 'Unauthorized access. Please check your API credentials.' });
        }

        res.status(500).json({ error: 'Error fetching prefilled URL.' });
    }
});

router.post('/proxy', async (req, res) => {
    const { url } = req.body;

    try {
        const response = await axios.post(url);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(201).json({ error: error.message });
    }
});


module.exports = router;
