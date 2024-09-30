const { google } = require('googleapis');
const { PrismaClient } = require('@prisma/client');
const Router = require('express');
const router = Router();
const ethers = require("ethers");
const prisma = new PrismaClient();
const abi = require("../contracts/ParentWalletV2.json");
const { authMiddleware } = require("../middleware/middleware");
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const refreshToken = process.env.REFRESH_TOKEN;

const auth = new google.auth.OAuth2(clientId, clientSecret);
auth.setCredentials({ refresh_token: refreshToken });

router.get('/getQuestions/:id', authMiddleware, async(req,res) => {

    const { id } = req.params;
    const userId = req.userId;
    try {
        const form = await google.forms('v1').forms.get({
            auth,
            formId: id
        })

        console.log("Form Data: " ,form.data);
        const formData = form.data.items
        res.status(200).json({
            formData
        })
    } catch (error) {
        console.log(error)
    }
})


router.post('/submitForm/:formId', async (req, res) => {
    const { responses } = req.body; // Extract form ID and user responses
    const {formId} = req.params;

    try {
        // Construct the response object
        const responseBody = {
            responses: responses.map((response) => ({
                // Each response should correspond to a question item in the form
                // For example, this assumes responses is an array of {questionId, answer} objects
                questionItem: {
                    question: {
                        questionId: response.questionId,
                        textAnswers: {
                            answers: [
                                { value: response.answer }
                            ]
                        }
                    }
                }
            }))
        };

        // Submit the response to the Google Form
        await google.forms('v1').forms.create({
            auth,
            formId: formId,
            requestBody: responseBody,
        });

        res.status(200).json({ message: 'Form response submitted successfully' });
    } catch (error) {
        console.error('Error submitting form response:', error);
        res.status(500).json({ error: 'Error submitting form response' });
    }
});

router.get("/getTotalEarnings",authMiddleware, async(req,res) => {
    const userId = req.userId
    try {
        const response = await prisma.voter.findUnique({
            where:
            {
                id: userId
            }, select:{
                totalRewardsEarned: true
            }
        })

        res.status(200).json(response);

    } catch (error) {
        console.log(error)
    }
})

router.post('/vote/:formId', authMiddleware, async (req, res) => {
    let { formId } = req.params;
    const { questionId, optionId } = req.body;
    let { userId } = req.body;

    userId = parseInt(userId);
    console.log('Vote request received:', req.body);
    console.log('User ID:', userId);

    try {
        const question = await prisma.question.findUnique({
            where: { id: questionId },
            select: { 
                options: true,
                rewardPerVote: true,
            },
        });
        console.log(question);
        if (!question) {
            console.log('Question not found:', questionId);
            return res.status(404).json({ error: 'Question not found' });
        }

        if (question.totalVotes >= question.voteLimit) {
            console.log('Vote limit reached for question:', questionId);
            return res.status(204).json({ error: 'Vote limit reached' });
        }

        const questionForm = await prisma.questionForm.findUnique({
            where: { id: parseInt(formId) },
        });

        if (!questionForm) {
            console.log('QuestionForm not found:', formId);
            // return res.status(404).json({ error: 'QuestionForm not found' });
        }

        if (!Array.isArray(question.options) || !question.options.some(option => option.hasOwnProperty('imageUrl'))) {
            console.log('QuestionForm has no options with imageURL:', formId);
            return res.status(204).json({ error: 'QuestionForm has no options with imageURL' });
        } else {
            // Record the vote without questionForm
            await prisma.vote.create({
                data: {
                    question: {
                        connect: { id: questionId }
                    },
                    voter: {
                        connect: { id: userId }
                    }
                },
            });
        }

        console.log('Received vote for question:', questionId, 'option:', optionId);

        // Update the vote count
        await prisma.question.update({
            where: { id: questionId },
            data: { totalVotes: { increment: 1 } },
        });

        console.log(`Updated votes for question ${questionId}, option ${optionId}`);

        // Update the votes for the option
        const options = question.options;
        options[optionId].votes += 1;

        await prisma.question.update({
            where: { id: questionId },
            data: { options: options },
        });

        // Reward the voter
        await prisma.voter.update({
            where: { id: userId },
            data: { totalRewardsEarned: { increment: question.rewardPerVote } },
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Error voting:', error);
        res.status(500).json({ error: error.message });
    }
});

// router.post('/vote/:formId', authMiddleware, async (req, res) => {
//     let { formId } = req.params;
//     const { questionId, optionId } = req.body;
//     let { userId } = req.body;

//     userId = parseInt(userId);
//     console.log('Vote request received:', req.body);
//     console.log('User ID:', userId);

//     try {
//         const question = await prisma.question.findUnique({
//             where: { id: questionId },
//             select: { options: true },
//         });
//         console.log(question);
//         if (!question) {
//             console.log('Question not found:', questionId);
//             return res.status(204).json({ error: 'Question not found' });
//         }

//         if (question.totalVotes >= question.voteLimit) {
//             console.log('Vote limit reached for question:', questionId);
//             return res.status(204).json({ error: 'Vote limit reached' });
//         }

//         const questionForm = await prisma.questionForm.findUnique({
//             where: { id: parseInt(formId) },
//         });

//         if (!questionForm) {
//             console.log('QuestionForm not found:', formId);
//             // return res.status(204).json({ error: 'QuestionForm not found' });
//         } else if ( questionForm.options ) {
//             if (!Array.isArray(questionForm.options) || !questionForm.options.some(option => option.hasOwnProperty('imageURL'))) {
//                 console.log('QuestionForm has no options with imageURL:', formId);
//                 return res.status(204).json({ error: 'QuestionForm has no options with imageURL' });
//             } else {
//                 console.log('QuestionForm found:', formId);
//             }
//         }

//         console.log('Received vote for question:', questionId, 'option:', optionId);

//         // Record the vote
//         await prisma.vote.create({
//             data: {
//                 question: {
//                     connect: { id: questionId }
//                 },
//                 voter: {
//                     connect: { id: userId }
//                 },
//                 questionForm: {
//                     connect: { id: parseInt(formId) }
//                 }
//             },
//         });

//         // Update the vote count
//         await prisma.question.update({
//             where: { id: questionId },
//             data: { totalVotes: { increment: 1 } },
//         });

//         console.log(`Updated votes for question ${questionId}, option ${optionId}`);

//         // Update the votes for the option
//         const options = question.options;
//         options[optionId].votes += 1;

//         await prisma.question.update({
//             where: { id: questionId },
//             data: { options: options },
//         });

//         // Reward the voter
//         await prisma.voter.update({
//             where: { id: userId },
//             data: { totalRewardsEarned: { increment: question.rewardPerVote } },
//         });

//         res.json({ success: true });
//     } catch (error) {
//         console.error('Error voting:', error);
//         res.status(500).json({ error: error.message });
//     }
// });

// router.get('/questions/:id', async (req, res) => {
//     const userId = parseInt(req.params.id);

//     try {
//         const questions = await prisma.question.findMany({
//             where: { companyId: userId },
//         });
        

//         res.json(questions);
//     } catch (error) {
//         res.status(201).json({ error: error.message });
//     }
// });

// Get a random question if a user has not voted on it
router.get('/questions/random', authMiddleware, async (req, res) => {
    const userId = req.userId;
    console.log(userId);
    try {
        // Get all the question IDs the user has already voted on
        const votedQuestions = await prisma.vote.findMany({
            where: { voterId: userId },
            select: { questionId: true },
        });

        const votedQuestionIds = votedQuestions.map((vote) => vote.questionId);

        // Fetch questions where vote limit is not reached manually
        const questionsWithRemainingVotes = await prisma.question.findMany({
            where: {
                id: { notIn: votedQuestionIds }, // Exclude voted questions
            },
        });

        // Fetch questionForms where vote limit is not reached manually
        const questionFormsWithRemainingVotes = await prisma.questionForm.findMany({
            where: {
                id: { notIn: votedQuestionIds }, // Assuming same vote exclusion logic
            },
        });

        // Filter the questions manually based on voteLimit and totalVotes
        const eligibleQuestions = questionsWithRemainingVotes.filter(q => q.totalVotes < q.voteLimit);
        
        // Filter the questionForms manually based on voteLimit and totalVotes
        const eligibleQuestionForms = questionFormsWithRemainingVotes.filter(qf => qf.totalVotes < qf.voteLimit);

        // Add a type field to distinguish between question and questionForm
        const questionsWithType = eligibleQuestions.map(q => ({ ...q, type: 'image' }));
        const questionFormsWithType = eligibleQuestionForms.map(qf => ({ ...qf, type: 'form' }));

        // Combine both questions and questionForms
        const combinedEligibleItems = [...questionsWithType, ...questionFormsWithType];

        // Count total eligible combined items
        const totalCombinedItems = combinedEligibleItems.length;

        console.log(totalCombinedItems);

        // If there are no questions or forms available, return 204 status
        if (totalCombinedItems === 0) {
            return res.status(204).json([]);
        }

        // Generate a random offset based on the total number of available combined items
        const randomOffset = Math.floor(Math.random() * totalCombinedItems);

        // Get a random item (either question or questionForm)
        const randomItem = combinedEligibleItems[randomOffset];

        // If no question or form was found, return a 404 response
        if (!randomItem) {
            return res.status(404).json({ error: 'No questions or forms available' });
        }

        // Return the random question or form with type
        res.json(randomItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/questionsList', authMiddleware, async (req, res) => {
    const userId = req.userId;
    console.log(userId);
    try {
        // Get all the question IDs the user has already voted on
        const votedQuestions = await prisma.vote.findMany({
            where: { voterId: userId },
            select: { questionId: true },
        });

        const votedQuestionIds = votedQuestions.map((vote) => vote.questionId);

        // Fetch questions where vote limit is not reached manually
        const questionsWithRemainingVotes = await prisma.question.findMany({
            where: {
                id: { notIn: votedQuestionIds }, // Exclude voted questions
            },
        });

        // Fetch questionForms where vote limit is not reached manually
        const questionFormsWithRemainingVotes = await prisma.questionForm.findMany({
            where: {
                id: { notIn: votedQuestionIds }, // Assuming same vote exclusion logic
            },
        });

        // Filter the questions manually based on voteLimit and totalVotes
        const eligibleQuestions = questionsWithRemainingVotes.filter(q => q.totalVotes < q.voteLimit);
        
        // Filter the questionForms manually based on voteLimit and totalVotes
        const eligibleQuestionForms = questionFormsWithRemainingVotes.filter(qf => qf.totalVotes < qf.voteLimit);

        // Combine both questions and questionForms
        const combinedEligibleItems = [...eligibleQuestions, ...eligibleQuestionForms];

        // Count total eligible combined items
        const totalCombinedItems = combinedEligibleItems.length;

        console.log(totalCombinedItems);

        // If there are no questions or forms available, return 204 status
        if (totalCombinedItems === 0) {
            return res.status(204).json([]);
        }

        // Generate a random offset based on the total number of available combined items
        // const randomOffset = Math.floor(Math.random() * totalCombinedItems);

        // Get a random item (either question or questionForm)
        // const randomItem = combinedEligibleItems[randomOffset];

        // If no question or form was found, return a 404 response
        // if (!randomItem) {
        //     return res.status(404).json({ error: 'No questions or forms available' });
        // }

        // Return the random question or form
        res.status(200).json(combinedEligibleItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Empty Balance of the voter
router.post("/emptyBalance",authMiddleware, async(req,res) => {
    const userId = req.userId
    try {
        await prisma.voter.update({
            where:{
                id: userId
            },
            data:{
                totalRewardsEarned: 0
            }
        })

        res.status(200).json({message: "Balance emptied successfully"})
    } catch (error) {
        console.log(error)
    }
})

router.get("/totalTasksCompleted",authMiddleware,async(req,res) => {
    const userId = req.userId
    try {
        const response = await prisma.vote.findMany({
            where:{
                voterId: userId
            }
        })

        console.log(response.length)
        res.status(200).json(response.length)
    } catch (error) {
        console.log(error)
    }
})

// Withdraw POL from smart contract vault
// router.post("/withdraw", async (req, res) => {
//     const { rewards, signature } = req.body;
//     let { userId } = req.body;
//     userId = parseInt(userId);

//     // Setup provider and signer for the smart contract interaction
//     const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
//     const signer = new ethers.Wallet(process.env.OWNER_PVT_KEY, provider);
//     const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, signer);

//     try {
//         // Verify the signature
//         const message = `Withdraw ${rewards} POL from vault`;
//         console.log(message)
//         const recoveredAddress = ethers.utils.verifyMessage(message, signature);
//         console.log("Recovered Address", recoveredAddress);

//         // Fetch the voter's wallet address and balance from the voter table
//         const voter = await prisma.voter.findUnique({
//             where: { id: userId },
//             select: { walletAddress: true, totalRewardsEarned: true}, // Assuming balance is stored in the table
//         });

//         console.log(voter)

//         if (!voter) {
//             return res.status(204).json({ error: "Voter not found" });
//         }

//         // Ensure the recovered address matches the voter's wallet address
//         if (recoveredAddress.toLowerCase() !== voter.walletAddress.toLowerCase()) {
//             return res.status(401).json({ error: "Invalid signature" });
//         }

//         // Ensure the voter has sufficient balance for the withdrawal
//         const voterBalance = ethers.utils.parseUnits(voter.totalRewardsEarned.toString(), "ether");
//         console.log("Voter's Balance", ethers.utils.formatEther(voterBalance));
//         console.log("Voter's Balance", ethers.utils.formatEther(voterBalance));

//         if (voterBalance.lt(ethers.utils.parseUnits(rewards.toString(), "ether"))) {
//             return res.status(400).json({ error: "Insufficient balance for withdrawal." });
//         }

//         // Estimate gas fees and calculate the total cost
//         const gasEstimate = await contract.estimateGas.withdraw({
//             gasLimit: ethers.utils.parseUnits("250000", "gwei"),
//         });        
//         console.log("gasEstimate "+  gasEstimate)
//         const gasPrice = await provider.getGasPrice();
//         console.log("Gas Price", ethers.utils.formatUnits(gasPrice, "gwei"));
//         const maxPriorityFeePerGas = ethers.utils.parseUnits("50", "gwei"); // Adjust as needed
//         console.log("Gas Price", ethers.utils.formatUnits(gasPrice, "gwei"));
//         const maxFeePerGas = gasPrice.add(maxPriorityFeePerGas);
//         console.log("Max Fee Per Gas", ethers.utils.formatUnits(maxFeePerGas, "gwei"));
//         const gasCost = gasEstimate.mul(maxFeePerGas);
//         console.log("Estimated Gas Cost", ethers.utils.formatEther(gasCost), "ETH");

//         // 10346729726975835
//         // 14477212875000000

//         // Check the balance of the signer account
//         const signerBalance = await provider.getBalance(signer.address);
//         console.log("Signer Balance", ethers.utils.formatEther(signerBalance));
//         const totalCost = ethers.utils.parseUnits(rewards.toString(), "ether").add(gasCost);

//         console.log("Total Cost", ethers.utils.formatEther(totalCost), "ETH");


//         if (signerBalance.lt(totalCost)) {
//             const requiredAmount = ethers.utils.formatEther(totalCost.sub(signerBalance));
//             console.log("Insufficient funds for transaction. Need additional", requiredAmount, "ETH");
//             return res.status(400).json({
//                 error: `Insufficient funds for transaction. Need additional ${requiredAmount} POL.`,
//             });
//         }
        
//         // Execute the withdrawal transaction
//         const tx = await contract.withdraw({
//             value: ethers.utils.parseUnits(rewards.toString(), "ether"),
//             maxPriorityFeePerGas,
//             maxFeePerGas,
//             gasLimit: gasEstimate,
//         });
//         console.log("Transaction Hash:", tx.hash);
//         await tx.wait();

//         console.log("Withdrawal successful");

//         // Update the voter's balance in the database
//         const newBalance = voterBalance.sub(ethers.utils.parseUnits(rewards.toString(), "ether"));
//         await prisma.voter.update({
//             where: { id: userId },
//             data: { totalRewardsEarned: 0 },
//         });

//         res.json({ message: "Withdrawal successful", success: true, transactionHash: tx.hash });
//     } catch (error) {
//         console.error("Error withdrawing from vault:", error);
//         res.status(500).json({ error: error.message });
//     }
// });

router.post("/withdraw", async (req, res) => {
    const { userId, rewards, signature } = req.body;
    const amount = rewards;

    // Setup provider and signer for the smart contract interaction
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
        // Verify the signature
        const message = `Withdraw ${amount} POL from vault`;
        console.log(amount);
        const recoveredAddress = ethers.utils.verifyMessage(message, signature);
        console.log("Recovered Address", recoveredAddress);

        // Check if the recovered address matches the user's address
        const userAddress = await prisma.voter.findFirst({
            where: { id: userId },
            select: { walletAddress: true }
        });
        console.log("User Address", userAddress.walletAddress);
        if (recoveredAddress.toLowerCase() !== userAddress.walletAddress.toLowerCase()) {
            return res.status(401).json({ error: "Invalid signature" });
        }

        // Check the balance of the vault contract
        const contractBalance = await provider.getBalance(contract.address);
        console.log("Contract Balance", ethers.utils.formatEther(contractBalance));

        // Ensure the contract has enough balance to fulfill the withdrawal
        const withdrawalAmount = ethers.utils.parseUnits(amount.toString(), "ether");
        if (contractBalance.lt(withdrawalAmount)) {
            return res.status(400).json({
                error: `Insufficient funds in the contract. Available: ${ethers.utils.formatEther(contractBalance)} POL.`,
            });
        }

        console.log("Withdrawing from vault...");
        console.log("Amount:", amount);

        // Estimate gas fees
        const gasEstimate = await contract.estimateGas.withdraw();
        const gasPrice = await provider.getGasPrice();

        console.log(gasEstimate + gasPrice + withdrawalAmount)

        // Send the transaction
        const tx = await contract.withdraw(withdrawalAmount,{
            gasPrice,
            gasLimit: gasEstimate
        });
        console.log("Transaction Hash:", tx.hash);
        await tx.wait();

        console.log("Withdrawal successful");

        res.json({ message: "Withdrawal successful", success: true });
    } catch (error) {
        console.error("Error withdrawing from vault:", error);
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
