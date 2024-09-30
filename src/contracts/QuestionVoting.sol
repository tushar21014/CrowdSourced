// contracts/QuestionVoting.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract QuestionVoting {
    struct Question {
        string question;
        string[] answerOptions;
        mapping(uint => uint) votes;  // Maps answer option index to number of votes
        uint totalVotes;
        uint totalMaticDeposited;
        address questionPoster;
        bool distributed;
    }

    mapping(uint => Question) public questions;
    uint public questionCount;

    function postQuestion(string memory _question, string[] memory _answerOptions) public payable {
        require(msg.value > 0, "MATIC deposit required");

        Question storage newQuestion = questions[questionCount++];
        newQuestion.question = _question;
        newQuestion.answerOptions = _answerOptions;
        newQuestion.totalMaticDeposited = msg.value;
        newQuestion.questionPoster = msg.sender;
        newQuestion.totalVotes = 0;
        newQuestion.distributed = false;
    }

    function answerQuestion(uint _questionId, uint _answerIndex) public {
        Question storage question = questions[_questionId];
        require(_answerIndex < question.answerOptions.length, "Invalid answer option");
        require(!question.distributed, "Rewards already distributed");

        question.votes[_answerIndex]++;
        question.totalVotes++;
    }

    function distributeRewards(uint _questionId) public {
        Question storage question = questions[_questionId];
        require(msg.sender == question.questionPoster, "Only the poster can distribute rewards");
        require(!question.distributed, "Rewards already distributed");

        for (uint i = 0; i < question.answerOptions.length; i++) {
            uint proportion = question.votes[i] * question.totalMaticDeposited / question.totalVotes;
            payable(msg.sender).transfer(proportion);
        }

        question.distributed = true;
    }
}
