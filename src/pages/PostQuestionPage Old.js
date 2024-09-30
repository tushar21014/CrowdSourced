import React, { useState, useEffect } from "react";
import axios from "axios";

import { Toaster, toast } from "react-hot-toast";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";

const api = process.env.REACT_APP_API_URL;

function PostQuestionPageOld() {
  const [questions, setQuestions] = useState([]);
  // const [questionOptions, setQuestionOptions] = useState([]);
  const [rewardSummary, setRewardSummary] = useState(0);

  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  const [inputOptions, setInputOptions] = useState([{ imageUrl: "" }]);

  const [amountSubmitted, setAmountSubmitted] = useState(false);
  const [signature, setSignature] = useState("");
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    // Fetch user's questions and rewards
    const fetchData = async () => {
      try {
        // const questionRes = await axios.get(api + `/company/questions/${userId}`);
        const rewardRes = await axios.get(api + `/company/${userId}/rewards`);

        // setQuestions(questionRes.data);
        // console.log("Questions:", questionRes.data);
        // setQuestionOptions(JSON.parse(questionRes.data.content));
        setRewardSummary(rewardRes.data.total_rewards_earned);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [userId]);

  //   Deposit rewards and sign the transaction
  const depositRewards = async () => {
    // SIgn the transaction using MetaMask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const signature = await signer.signMessage(
      `Deposit ${amount} POL to vault`
    );
    setSignature(signature);
    toast.success("Transaction signed successfully!");
    console.log("Signature:", signature);

    const res = await axios.post(api + "/company/deposit", {
      userId: parseInt(userId),
      amount,
      signature,
    });

    if (res.data.success) {
      setAmountSubmitted(true);
      toast.success(res.data.message);
      submitPost();
    } else {
      toast.error(res.data.error);
    }
  };

  //   Login using MetaMask
  const handleLogin = async () => {
    // Login the current user using MetaMask wallet
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const address = accounts[0];

    localStorage.setItem("address", address);

    const res = await axios.post(api + "/company/login", { address });

    setUserId(res.data.userId);
    localStorage.setItem("userId", res.data.userId);

    console.log("User ID:", res.data.userId);

    toast.success(res.data.message);
  };

  const submitPost = async () => {
    const title = document.getElementById("input-title").value;
    const options = inputOptions.map((option, Oid) => ({
      id: Oid,
      imageUrl: option.imageUrl,
      votes: 0,
    }));
    const voteLimit = 100; // Example value, replace with actual logic to get voteLimit
    const totalReward = 1; // Example value, replace with actual logic to get totalReward

    try {
      await axios.post(api + "/company/questions", {
        userId,
        title,
        options,
        voteLimit,
        totalReward,
      });

      toast.success("Question posted successfully!");
      navigate("/company")
      // window.reload()
    } catch (error) {
      console.error("Error posting question:", error);
      toast.error("Error posting question");
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("userId")) {
      // Redirect to login page if user is not logged in
      handleLogin();
    }
  }, []);

  return (

    <div>
      {loading ? <>loading.....</> : <>

        <Toaster position="top-center" reverseOrder={false} />
        <h2>User Dashboard</h2>
        <p>User ID: {userId}</p>
        <p>Address: {localStorage.getItem("address")}</p>

        <p>Total Rewards Earned: {rewardSummary} POL</p>

        <h3>Your Questions</h3>
        <ul></ul>

        <h3>Post a New Question</h3>
        <input
          placeholder="Question Title"
          id="input-title"
          className="m-2 border-2 border-gray-300 p-1"
        />
        {inputOptions.map((option, index) => (
          <div key={index}>
            {/* <input type="file" /> */}
            <input
              type="text"
              placeholder="Image URL"
              onChange={(e) => {
                const newOptions = [...inputOptions];
                newOptions[index].imageUrl = e.target.value;
                setInputOptions(newOptions);
              }}
              className="m-2 border-2 border-gray-300 p-1 options-input"
            />
          </div>
        ))}
        <button
          onClick={() => setInputOptions([...inputOptions, { imageUrl: "" }])}
          className="m-2 bg-slate-500 text-white p-1 hover:bg-slate-900 rounded transition-all delay-75 ease-linear"
        >
          Add Option
        </button>

        <div className="flex flex-col items-center">
          <input
            type="number"
            placeholder="Amount"
            onChange={(e) => setAmount(e.target.value)}
            className="m-2 border-2 border-gray-300 p-1"
          />
          <input
            type="text"
            placeholder="Signature"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            readOnly
            className="m-2 border-2 border-gray-300 p-1"
          />

          <button onClick={amountSubmitted ? submitPost : depositRewards}>
            {amountSubmitted ? "Post Question" : "Deposit Rewards"}
          </button>
        </div>

        <h3>Available Questions</h3>
        <ul>
          {questions && questions.map((q, i) => (
            <li key={q.id}>
              Q{i + 1} -{q.title} (Votes: {q.total_votes}/{q.vote_limit})
              <div className=" flex flex-row gap-4 ">
                {q.options && q.options.map((option, index) => (
                  <div className="flex flex-col items-center justify-center">
                    <p>{option.votes} votes</p>

                    <img
                      key={index}
                      src={option.imageUrl}
                      alt="Option"
                      className="aspect-square"
                    />
                  </div>
                ))}
              </div> 
            </li>
          ))}
        </ul>
      </>}
    </div>
  );
}

export default PostQuestionPageOld;
