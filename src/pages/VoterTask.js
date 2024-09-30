import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { DashboardSidebar } from "../components/SideBarDashboard";

const api = process.env.REACT_APP_API_URL;

function VoterTask() {
  const [questions, setQuestion] = useState([]);
  const [formQuestion, setFormQuestion] = useState([])
  const [rewards, setRewards] = useState(0);

  const [optionSelected, setOptionSelected] = useState(null);
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  
async function voteOnQuestion(questionId, optionId) {
  if (!localStorage.getItem("userId")) {
    toast.error("Please login first");
    return;
  }

  // convert to number type
  let id = parseInt(optionId);

  console.log("Voting on question:", questionId, id);
  const res = await axios.post(api+"/voters/vote", { userId: localStorage.getItem("userId"), questionId, optionId: id });

  if (res.data.error) {
    toast.error(res.data.error);
    return;
  }

  if (res.data.success) {
    toast.success("Vote submitted!");
    fetchQuestions();
  }

}


  // useEffect(() => {
  //   setUserId(parseInt(localStorage.getItem("userId")));
  // }, [localStorage.getItem("userId")]);

    //   Login using MetaMask
    const handleLogin = async () => {

      try {
  
        // Login the current user using MetaMask wallet
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        
        const address = accounts[0];
        
        localStorage.setItem("address", address);
        
        const res = await axios.post(api + "/auth/login", { address });
        
        setUserId(res.data.userId);
        localStorage.setItem("userId", res.data.userId);
        
        console.log("User ID:", res.data.userId);
        
        toast.success(res.data.message);
      } catch (error) {
        console.error("Error logging in:", error);
        toast.error("Error logging in. Please try again.");
      }
    };

    const fetchQuestions = async () => {
      try {
        const res = await fetch("http://localhost:4000/Routes/voters/questions/random", {
          method: "get",
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });
    
        const data = await res.json(); // Parse the JSON data from the response
        console.log("Response Data:", data);
    
        if (res.status === 204) {
          toast.error("No questions or forms available");
          return;
        }
    
        if (data.error) {
          toast.error("Error fetching questions");
          return;
        }
    
        // Check the type of the response and store it accordingly
        if (data.type === 'form') {
          console.log("Form Question:", data);
          fetchFormsQuestions(data.QuestionFormId);
          // setFormQuestion(data); // Assuming you have a state called formQuestion
        } else if (data.type === 'question') {
          console.log("Regular Question:", data);
          setQuestion(data); // Assuming you have a state called question
        }
    
      } catch (error) {
        console.error("Error fetching questions:", error);
        toast.error("Error fetching questions");
      }
    };
    

  const fetchRewards = async () => {
    try {
      const res = await axios.get(api+`/voters/user/${userId}/rewards`);
      setRewards(res.data.totalRewardsEarned);
    } catch (error) {
      console.error("Error fetching rewards:", error);
    }
  };


  const fetchFormsQuestions = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/Routes/voters/getQuestions/${id}`,{
        method:"get",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      })

      const data = await res.json();
      setFormQuestion(data.formData);
      console.log("I am form questions", data);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {

    fetchQuestions();
    fetchRewards();
  }, []);



  function vote(questionId, optionId) {
    voteOnQuestion(questionId, optionId);
  }

  useEffect(() => {
    handleLogin();
  }, []);

  return (
    
    <div className="flex h-screen bg-black text-white">
    <DashboardSidebar />
    <div>
      <h2>Voter Dashboard</h2>
      <p>User ID: {userId}</p>
      <p>Address: {localStorage.getItem("address")}</p>
      <p>Total Rewards: {rewards} POL</p>

      {/* Render form question if it's a form */}
      {formQuestion ? (
        <div>
          <h3>Form Question</h3>
          <p>{formQuestion.formTitle}</p>
          <ul>
            {formQuestion.formFields && formQuestion.formFields.map((field, index) => (
              <li key={index}>
                <label>{field.label}</label>
                <input type={field.type} />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        // Otherwise, render regular questions
        <div>
          <h3>Available Questions</h3>
          <ul>
            {questions.length > 0 ? (
              questions.map((q, i) => (
                <li key={q.id}>
                  Q{i + 1} - {q.title} (Votes: {q.totalVotes}/{q.voteLimit})
                  <div className="flex flex-row gap-4">
                    {q.options && q.options.map((option, index) => (
                      <img
                        key={index}
                        src={option.imageUrl}
                        alt="Option"
                        className={"aspect-square cursor-pointer index-" + index}
                        onClick={() => vote(q.id, index)}
                      />
                    ))}
                  </div>
                </li>
              ))
            ) : (
              <p>No questions available</p>
            )}
          </ul>
        </div>
      )}
    </div>
    </div>
  );
}

export default VoterTask;
