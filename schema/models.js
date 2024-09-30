const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  questionId: { type: Number, required: true, unique: true },
  content: { type: String, required: true },
  voteLimit: { type: Number, required: true },
  totalVotes: { type: Number, default: 0 },
  rewardPerVote: { type: Number, required: true },
  totalReward: { type: Number, required: true },
  creator: { type: String, required: true },
});

module.exports = mongoose.model('Question', QuestionSchema);
