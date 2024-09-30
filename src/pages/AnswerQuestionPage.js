// src/AnswerQuestionPage.js
import React, { useState } from "react";

const AnswerQuestionPage = ({ questions, account, questionContract }) => {
  const [selectedAnswer, setSelectedAnswer] = useState({});

  const answerQuestion = async (questionId, answerIndex) => {
    await questionContract.methods
      .answerQuestion(questionId, answerIndex)
      .send({ from: account });
  };

  return (
    <div>
      <h2>Answer Questions</h2>
      {questions.map((question, index) => (
        <div key={index}>
          <h3>{question.question}</h3>
          <div>
            {question.answerOptions.map((option, i) => (
              <div key={i}>
                <img src={option} alt={`Option ${i}`} width="100" />
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={i}
                  onChange={() => setSelectedAnswer({ [index]: i })}
                />
              </div>
            ))}
          </div>
          <button onClick={() => answerQuestion(index, selectedAnswer[index])}>
            Submit Answer
          </button>
        </div>
      ))}
    </div>
  );
};

export default AnswerQuestionPage;
