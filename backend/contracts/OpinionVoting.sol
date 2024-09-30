// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingReward {
    struct Question {
        uint id;
        string content;
        uint voteLimit;
        uint totalVotes;
        uint rewardPerVote;
        uint totalReward;
        address creator;
    }

    struct WorkerReward {
        uint earned;
        uint withdrawn;
    }

    uint public questionCount;
    address public parentAccount;

    mapping(uint => Question) public questions;
    mapping(address => mapping(uint => bool)) public hasVoted;
    mapping(address => WorkerReward) public workerRewards;

    event QuestionPosted(uint indexed questionId, string content, uint reward);
    event VoteCast(address indexed worker, uint indexed questionId, uint reward);
    event RewardWithdrawn(address indexed worker, uint amount);

    constructor(address _parentAccount) {
        parentAccount = _parentAccount;
    }

    modifier onlyCreator(uint questionId) {
        require(msg.sender == questions[questionId].creator, "Not the question creator.");
        _;
    }

    // Post a question with the reward amount
    function postQuestion(string memory content, uint voteLimit) external payable {
        require(msg.value > 0, "Reward amount must be greater than 0");
        
        questionCount++;
        questions[questionCount] = Question({
            id: questionCount,
            content: content,
            voteLimit: voteLimit,
            totalVotes: 0,
            rewardPerVote: msg.value / voteLimit,
            totalReward: msg.value,
            creator: msg.sender
        });

        payable(parentAccount).transfer(msg.value);
        emit QuestionPosted(questionCount, content, msg.value);
    }

    // Vote on a question and earn a reward
    function vote(uint questionId) external {
        require(questionId > 0 && questionId <= questionCount, "Invalid question.");
        require(!hasVoted[msg.sender][questionId], "You have already voted on this question.");
        require(questions[questionId].totalVotes < questions[questionId].voteLimit, "Vote limit reached.");

        hasVoted[msg.sender][questionId] = true;
        questions[questionId].totalVotes++;

        // Update worker's reward
        workerRewards[msg.sender].earned += questions[questionId].rewardPerVote;
        
        emit VoteCast(msg.sender, questionId, questions[questionId].rewardPerVote);
    }

    // Allow workers to withdraw their accumulated reward
    function withdrawReward() external {
        uint reward = workerRewards[msg.sender].earned - workerRewards[msg.sender].withdrawn;
        require(reward > 0, "No reward to withdraw.");

        workerRewards[msg.sender].withdrawn += reward;
        payable(msg.sender).transfer(reward);

        emit RewardWithdrawn(msg.sender, reward);
    }

    // Get the reward balance of a worker
    function getRewardBalance(address worker) external view returns (uint) {
        return workerRewards[worker].earned - workerRewards[worker].withdrawn;
    }
}
