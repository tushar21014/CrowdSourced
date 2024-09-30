const { authMiddleware } = require("../middleware/middleware");

const { PrismaClient } = require("@prisma/client");
const Router = require("express");
const ethers = require("ethers");
const router = Router();

require("dotenv").config();

const abi = require("../contracts/ParentWalletV2.json");
const { S3Client } = require('@aws-sdk/client-s3')
const { createPresignedPost } = require('@aws-sdk/s3-presigned-post')
const jwt = require('jsonwebtoken')
const { google } = require('googleapis');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const refreshToken = process.env.REFRESH_TOKEN;

// Create a Google Forms API client
const auth = new google.auth.OAuth2(clientId, clientSecret, refreshToken);
auth.setCredentials({ refresh_token: refreshToken });

const s3Client = new S3Client({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID ?? "",
        secretAccessKey: process.env.ACCESS_SECRET ?? "",
    },
    region: "ap-south-1"
})

const prisma = new PrismaClient();

router.post("/login", async (req, res) => {
    console.log("Login request received");
    const { address } = req.body;
    console.log("Address:", address);

    console.log(process.env.JWT_SECRET)
    try {
        // Find the user with the provided wallet address using Prisma
        let user = await prisma.company.findFirst({
            where: { walletAddress: address },
        });

        if (user) {
            const token = jwt.sign({
                userId: user.id
            }, process.env.JWT_SECRET)
            
            console.log("I am existing user")
            console.log("I am token", token)
            res.json({
                message: "Login successful",
                token, userId: user.id
            })
            // console.log("I am existing user " + token)
        } else {
            const user = await prisma.company.create({
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


router.post("/createForm",authMiddleware ,async (req, res) => {
    // Create a new form
    // google.forms('v1').forms.create
    const userId = req.userId;
    const {title,description} = req.body;

    try{

        const form = await google.forms('v1').forms.create({
            auth,
            requestBody: {
                "info": {
                    "title": title || "Untitled Form",
                }
            },
        });
        
        const formId = form.data.formId;

        const companyUpdate = await prisma.questionForm.create({
            data:{
                QuestionFormId: formId,
                companyId: userId,
                voteLimit: 100, // Baad m change krna h vote limit
                totalReward: 100,
                totalVotes: 100,
                rewardPerVote : 100
            }
        })

        if(companyUpdate)
        {
            console.log("Form created in db")
        } else{
            console.log("Form not created in db")

        }

        console.log("Form Created Sucessfully")
        res.status(200).json({
            message:"Form created Successfully",    
            formid: formId,
            formLink : "https://docs.google.com/forms/d/"+ formId
        })
    } catch (e) {
        console.log(e);
    }
})


router.post("/createQuestionsUpdated",authMiddleware, async (req, res) => {
    try {
        const { formId, newTitle, questions} = req.body; // Extracting details from the request body
        
        // Prepare the requests for batchUpdate
        const requests = [
            {
                "updateFormInfo": {
                    "info": {
                        "title": newTitle || "new Untitled Form", // Updating the form title
                    },
                    "updateMask": "title"
                }
            }
        ];

        // Add each question to the requests array
        questions.forEach((question, index) => {
            requests.push({
                "createItem": {
                    "item": {
                        "title": question.title,
                        "questionItem": {
                            "question": {
                                "required": true,
                                "choiceQuestion": {
                                    "type": question.type,
                                    "options": question.options.map(option => ({ "value": option })),
                                    "shuffle": false // Optional, you can get this from frontend if needed
                                }
                            }
                        }
                    },
                    "location": {
                        "index": index // Ensures each question is added sequentially
                    }
                }
            });
        });

        // Perform the batchUpdate to add questions and update the title
        await google.forms('v1').forms.batchUpdate({
            auth,
            formId: formId,
            requestBody: {
                requests: requests
            }
        });
        console.log("Questions added Sucessfully")
        res.status(200).json({ message: "Questions added and title updated successfully", formId: formId });
    } catch (e) {
        console.error('Error adding questions or updating title:', e);
        res.status(500).json({ error: 'Error adding questions or updating title' });
    }
});


router.get("/totalMoneySpent", authMiddleware, async(req,res) => {
    try {
        
        const userId = req.userId;

        const response = await prisma.company.findUnique({
            where: {
                id: userId
            },
            select:{
                totalMoneySpent: true
            }
        })

        res.status(200).json({
            response
        })

    } catch (error) {
        
    }
})

router.get("/totalVotes",authMiddleware, async(req,res) => {
    try {
        const userId = req.userId;

        const response = await prisma.questionForm.findMany({
            where:{
                companyId: userId
            },
            select:{
                totalVotes: true
            }
        })

        console.log(response);

        res.status(200).json({
            response
        })

    } catch (error) {
        
    }
})

// router.get("/totalVotes",authMiddleware, async(req,res) => {
//     try {
//         const userId = req.userId;

//     } catch (error) {
        
//     }
// })

router.get("/getResponses/:id",authMiddleware, async (req, res) => {
    try {
        // Extract the form ID from the URL parameters
        const { id } = req.params;

        // Use the Google Forms API to fetch responses for the form
        const response = await google.forms('v1').forms.responses.list({
            auth,
            formId: id
        });

        if(!response){
            console.log("No form found");
            res.status(204).json("No form found")
        }

        // Extract the responses data
        const responseData = response.data;

        // Log the number of responses
        const numberOfResponses = responseData.responses ? responseData.responses.length : 0;
        console.log(`Number of responses: ${numberOfResponses}`);

        // Send the responses back to the client
        res.status(200).json(responseData);
    } catch (error) {
        // Log the error and send a 500 status with an error message
        console.error('Error fetching responses:', error);
        res.status(500).json({ message: 'Failed to fetch responses' });
    }
});


router.get("/getForms", authMiddleware, async (req, res) => {
    const userId = req.userId; // Assuming userId is obtained from the middleware

    try {
        // Fetch question forms where companyId matches userId
        const getForms = await prisma.questionForm.findMany({
            where: {
                companyId: userId
            }
        });

        // Send the fetched forms back to the client
        res.status(200).json({
            forms: getForms
        });
    } catch (error) {
        console.error('Error fetching forms:', error);
        res.status(500).json({ message: 'Failed to fetch forms' });
    }
});


router.get("/presignedUrl", authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;

        const { url, fields } = await createPresignedPost(s3Client, {
            Bucket: 'mycrowdsourced',
            Key: `myfolder/${userId}/${Math.random()}/image.jpg`,
            Conditions: [
                ['content-length-range', 0, 5 * 1024 * 1024] // 5 MB max
            ],
            Expires: 3600
        });

        console.log("I am presignedURL", url); // Remove the + sign

        res.json({
            preSignedUrl: url,
            fields
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error generating presigned URL" });
    }
});


router.get("/company/:id/rewards", async (req, res) => {
    const userId = parseInt(req.params.id); // Ensure userId is an integer

    try {
        // Fetch the user's total rewards earned using Prisma
        const company = await prisma.company.findUnique({
            where: {
                id: userId
            },
            select: {
                totalMoneySpent: true,  // Only select the total rewards earned field
            },
        });

        if (!voter) {
            return res.status(404).json({ error: "Company not found" });
        }

        // console.log("Voter's rewards", voter.totalRewardsEarned);

        // Return the total rewards earned in the response
        res.json({ totalMoneySpent: company.totalMoneySpent });
    } catch (error) {
        console.error("Error fetching rewards:", error);
        res.status(500).json({ error: error.message });
    }
});


// Get image questions
router.get("/getImageQuestions",authMiddleware, async(req,res) => {
    
    const userId = req.userId;
    try {
       const response = await prisma.company.findUnique({
        where:{
            id: userId
        },
        select:{
            questions: true
        }
       })

       res.status(200).json(response);
        
    } catch (error) {
        console.log(error)
    }
})

// Get Recent Projects
router.get("/getRecentProjects", authMiddleware, async (req, res) => {
    const userId = req.userId;
    try {
        // Fetch questionForms for the user
        const questionForms = await prisma.questionForm.findMany({
            where: {
                companyId: userId
            }
        });

        // Add a label 'form' to each questionForm
        const labeledQuestionForms = questionForms.map(form => ({
            ...form,
            type: 'Survey Form'  // Adding the label
        }));

        // Fetch questions for the user
        const questions = await prisma.question.findMany({
            where: {
                companyId: userId
            }
        });

        // Add a label 'image' to each question
        const labeledQuestions = questions.map(question => ({
            ...question,
            type: 'Image'  // Adding the label
        }));

        // Merge labeled questionForms and questions
        const recentProjects = [...labeledQuestionForms, ...labeledQuestions];

        // Sort by timestamp (assuming both have a 'createdAt' field)
        recentProjects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Send the sorted result back to the client
        res.status(200).json({ projects: recentProjects });
    } catch (error) {
        console.error('Error fetching recent projects:', error);
        res.status(500).json({ message: 'Failed to fetch recent projects' });
    }
});


router.post("/deposit", authMiddleware, async (req, res) => {
    const { userId, amount, signature } = req.body;

    // Transfer POL to smart contract vault
    const provider = new ethers.providers.JsonRpcProvider(
        "https://polygon-amoy.g.alchemy.com/v2/6qrXqHEqPnslW1FEzYETKG7FSXzKfBJL"
    );
    const signer = new ethers.Wallet(
        "a36c19b21764b204d1b1954c571bfdd13a0fd3cfd098c345b897edee6822aaae",
        provider
    );
    const contract = new ethers.Contract(
        "0x7629c33e5a1bd6e48c3c8eff69649f7ea4782db0",
        abi,
        signer
    );

    try {
        console.log('Received deposit request:', userId, amount, signature);
        // Verify the signature
        const message = `Deposit ${amount} POL to vault`;
        const recoveredAddress = ethers.utils.verifyMessage(message, signature);
        console.log("Recovered Address", recoveredAddress);

        // Check if the recovered address matches the user's address
        var userAddress = await prisma.company.findFirst({
            where: {id: userId},
            select: {walletAddress: true}
        })
        console.log("User: ", userAddress);
        console.log("User Address", userAddress.walletAddress);
        if (recoveredAddress.toLowerCase() !== userAddress.walletAddress.toLowerCase()) {
            return res.status(401).json({ error: "Invalid signature" });
        }

        // Check the balance of the signer account
        const balance = await provider.getBalance(signer.address);
        console.log("Signer Balance", ethers.utils.formatEther(balance));

        // Estimate gas fees
        const gasEstimate = await contract.estimateGas.deposit({
            value: ethers.utils.parseUnits(amount.toString(), "ether"),
        });
        const gasPrice = await provider.getGasPrice();
        const maxPriorityFeePerGas = ethers.utils.parseUnits("50", "gwei"); // Example value, adjust as needed
        const maxFeePerGas = gasPrice.add(maxPriorityFeePerGas);
        const gasCost = gasEstimate.mul(maxFeePerGas);
        console.log("Estimated Gas Cost", ethers.utils.formatEther(gasCost));

        // Check if the signer has enough funds
        const totalCost = ethers.utils
            .parseUnits(amount.toString(), "ether")
            .add(gasCost);

        if (balance.lt(totalCost)) {
            const requiredAmount = ethers.utils.formatEther(totalCost.sub(balance));
            return res.status(400).json({
                message: `Insufficient funds for transaction. Need additional ${requiredAmount} POL.`,
            });
        }

        console.log("Depositing to vault...");
        console.log("Amount:", amount);

        // Send the transaction
        const tx = await contract.deposit({
            value: ethers.utils.parseUnits(amount.toString(), "ether"),
            maxPriorityFeePerGas,
            maxFeePerGas,
            gasLimit: gasEstimate,
        });
        console.log("Transaction Hash:", tx.hash);
        await tx.wait();

        console.log("Deposit successful");

        const company = await prisma.company.findUnique({
            where: {
                id: userId
            },
            select: {
                totalMoneySpent: true
            }
        });

        const newTotalMoneySpent = parseFloat(company.totalMoneySpent || 0) + parseFloat(amount);

        const updatedCompany = await prisma.company.update({
            where: {
                id: userId
            },
            data: {
                totalMoneySpent: newTotalMoneySpent
            }
        });

        res.json({ message: "Deposit successful", success: true });
    } catch (error) {
        console.error("Error depositing to vault:", error);
        res.status(500).json({ error: error.message });
    }
});

// Create a new question
router.post("/questions", authMiddleware, async (req, res) => {
    const { title, options, voteLimit, totalReward, file } = req.body; // Assuming 'file' is part of the request
    let { userId } = req.body;
    userId = parseInt(userId);

    

// const newTotalMoneySpent = parseFloat(company.totalMoneySpent || 0) + parseFloat(amount);
    try {
        let s3FileURL = null;

        console.log(options)
        // If a file is provided, upload it to S3
        if (file) {
            const params = {
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: `myfolder/${userId}/${Math.random()}/image.jpg`, // Unique file name
                Body: file.data, // Assuming the file content is in req.body.file.data
                ContentType: file.mimetype,
                ACL: 'public-read',

            };

            const uploadResult = await s3.upload(params).promise();
            s3FileURL = uploadResult.Location; // Get the file URL
        }

        // Save question to Prisma (PostgreSQL) with the S3 file URL (if any)
        const result = await prisma.question.create({
            data: {
                companyId: userId,
                title,
                options,
                voteLimit,
                totalReward,
                rewardPerVote: totalReward / voteLimit,
                // fileUrl: s3FileURL, // Store the S3 URL in the database
            },
        });

        res.json(result);
    } catch (error) {
        console.error("Error posting question:", error);
        res.status(500).json({ error: error.message });
    }
});


// Referral system
router.post("/referral", async (req, res) => {
    const { referrerId, referredUserId, reward } = req.body;

    try {
        // Add referral using Prisma
        await prisma.referral.create({
            data: {
                referrerId: referrerId,
                referredCompanyrId: referredUserId,
                referralReward: reward,
            },
        });

        res.json({ success: true });
    } catch (error) {
        console.error("Error creating referral:", error);
        res.status(500).json({ error: error.message });
    }
});

// Company-related: Create a new company
router.post("/company", async (req, res) => {
    const { walletAddress, referralCode, totalMoneySpent } = req.body;

    try {
        const company = await prisma.company.create({
            data: {
                walletAddress,
                referralCode,
                totalMoneySpent,
            },
        });

        res.json(company);
    } catch (error) {
        console.error("Error creating company:", error);
        res.status(500).json({ error: error.message });
    }
});

// Get company details
router.get("/company/:id", async (req, res) => {
    const companyId = parseInt(req.params.id);

    try {
        const company = await prisma.company.findUnique({
            where: { id: companyId },
            include: {
                referralsSent: true,
                referralsReceived: true,
                questions: true,
            },
        });

        if (!company) {
            return res.status(404).json({ error: "Company not found" });
        }

        res.json(company);
    } catch (error) {
        console.error("Error fetching company details:", error);
        res.status(500).json({ error: error.message });
    }
});





module.exports = router;


// const newTotalMoneySpent = parseFloat(company.totalMoneySpent || 0) + parseFloat(amount);