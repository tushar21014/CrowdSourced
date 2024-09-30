"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";
import { Plus, Minus, Image as ImageIcon, Send } from "lucide-react";

import React, { useEffect } from "react";
import axios from "axios";

import { Toaster, toast } from "react-hot-toast";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import SurveyForm from "../components/SurveyForm";
import { UploadImage } from "../components/UploadImage";

const api = process.env.REACT_APP_API_URL;

export default function QuestionSurveyPage() {
  const [questionType, setQuestionType] = useState("form");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([""]);
  const [imagePrompt, setImagePrompt] = useState("");
  const [rewardAmount, setRewardAmount] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Survey Form
  const [isFormCreated, setIsFormCreated] = useState(false);
  const [formId, setFormId] = useState("");
  const [title, setTitle] = useState("Untitled Form");
  const [images, setImages] = useState([]);

  //
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

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleRemoveOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const surveyData = {
      type: questionType,
      question,
      options: questionType === "multiple-choice" ? options : [],
      imagePrompt: questionType === "image" ? imagePrompt : "",
      rewardAmount: parseFloat(rewardAmount),
      isAnonymous,
    };
    console.log("Survey data:", surveyData);

    try {
      // await contributeToVault(surveyData.rewardAmount);
      console.log("Successfully contributed to the vault");
      // Here you would typically send the survey data to your backend
      // and handle the response (e.g., show a success message, redirect, etc.)
    } catch (error) {
      console.error("Error contributing to the vault:", error);
      // Handle the error (e.g., show an error message to the user)
    }
  };

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
  const depositRewards = async (submitPostQuestion) => {
    // SIgn the transaction using MetaMask
    let amount = rewardAmount;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const signature = await signer.signMessage(
      `Deposit ${amount} POL to vault`
    );
    setSignature(signature);
    toast.success("Transaction signed successfully!");
    console.log("Signature:", signature);

    const res = await axios.post(
      api + "/company/deposit",
      {
        userId: parseInt(userId),
        amount,
        signature,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (res.data.success) {
      setAmountSubmitted(true);
      toast.success(res.data.message);

      if (questionType === "form") {
        postForm();
      } else if (questionType === "image") {
        submitPost();
      } else if (questionType === "multiple-choice") {
        submitPostQuestion();
      } else {
        toast.error("Invalid question type");
      }
      
      navigate("/company/dashboard");
    } else {
      toast.error(res.message);
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

    console.log("Login response:", res.data);

    setUserId(res.data.userId);
    localStorage.setItem("userId", res.data.userId);

    console.log("User ID:", res.data.userId);

    toast.success(res.data.message);
  };

  const submitPost = async () => {
    const title = document.getElementById("imagequestion").value;

    const options = images.map((option, Oid) => ({
      id: Oid,
      imageUrl: option,
      votes: 0,
    }));

    const voteLimit = 100; // Example value, replace with actual logic to get voteLimit
    const totalReward = 1; // Example value, replace with actual logic to get totalReward

    try {
      await axios.post(
        api + "/company/questions",
        {
          userId,
          title,
          options,
          voteLimit,
          totalReward,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Question posted successfully!");
      navigate("/company/dashboard");
      // window.reload()
    } catch (error) {
      console.error("Error posting question:", error);
      toast.error("Error posting question");
    }
  };

  const postForm = async () => {
    try {
      console.log("Questions:", questions);
      console.log("Form ID:", formId);
      const authToken = localStorage.getItem("authToken");
      const response = await axios.post(
        "http://localhost:4000/Routes/company/createQuestionsUpdated",
        {
          questions,
          formId,
          newTitle: title,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setIsFormCreated(true);

      console.log("Form posted successfully");
      toast.success("Form posted successfully");

      console.log(response);
    } catch (error) {
      console.error("Error posting form:", error);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("userId")) {
      // Redirect to login page if user is not logged in
      handleLogin();
    }
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Create Question/Survey</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="bg-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Question Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={questionType} onValueChange={setQuestionType}>
              <TabsList className="bg-gray-700">
                <TabsTrigger value="form">Survey Form</TabsTrigger>
                <TabsTrigger value="image">Image Upload</TabsTrigger>
                <TabsTrigger value="multiple-choice">
                  Multiple Choice
                </TabsTrigger>
                {/* <TabsTrigger value="text">Text Response</TabsTrigger> */}
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="bg-gray-800">
          {questionType !== "form" && (
            <CardHeader>
              <CardTitle className="text-white">Question Details</CardTitle>
            </CardHeader>
          )}
          <CardContent className="space-y-4 text-white/90">
            {questionType !== "form" && (
              <div>
                <Label htmlFor="question">Question</Label>
                <Textarea
                  id="imagequestion"
                  placeholder="Enter your question here..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="bg-gray-700 text-white"
                />
              </div>
            )}

            {questionType === "multiple-choice" && (
              <div className="space-y-2">
                <Label>Options</Label>
                {options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      placeholder={`Option ${index + 1}`}
                      className="bg-gray-700 text-white"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveOption(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  // variant="outline"
                  onClick={handleAddOption}
                  className="mt-2 text-white bg-purple-600 hover:bg-purple-700 "
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Option
                </Button>
              </div>
            )}

            {questionType === "image" && (
              // <div>
              //   <Label htmlFor="imagePrompt">Image Upload Prompt</Label>
              //   <Textarea
              //     id="imagePrompt"
              //     placeholder="Enter instructions for image upload..."
              //     value={imagePrompt}
              //     onChange={(e) => setImagePrompt(e.target.value)}
              //     className="bg-gray-700 text-white"
              //   />
              // </div>
              <div className="ml-4 pt-2 flex justify-center flex-row items-center">
                <div className="flex justify-center pt-4 max-w-screen-lg">
                  {images.map((image, index) => (
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-white text-sm font-semibold">
                        Image {index + 1}
                      </span>
                      <UploadImage
                        key={index}
                        image={image}
                        onImageAdded={(imageUrl) =>
                          setImages((i) => [...i, imageUrl])
                        }
                        removeImage={() =>{
                          const newImages = images.filter((_, i) => i !== index);
                          setImages(newImages);
                        } }
                      />
                    </div>
                  ))}
                </div>
                <UploadImage
                  onImageAdded={(imageUrl) =>
                    setImages((i) => [...i, imageUrl])
                  }
                />
              </div>
            )}

            {questionType === "form" && (
              <div>
                <SurveyForm
                  questions={questions}
                  setQuestions={setQuestions}
                  isFormCreated={isFormCreated}
                  setIsFormCreated={setIsFormCreated}
                  setFormId={setFormId}
                  title={title}
                  setTitle={setTitle}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-800">
          <CardHeader>
            <CardTitle className="text-white">
              Reward
              {/* and Privacy */}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-white/90">
            <div>
              <Label htmlFor="rewardAmount">
                Reward Amount{" "}
                {/* <span className="italic font-semibold">(in POL)</span> */}
              </Label>
              <Input
                id="rewardAmount"
                type="number"
                placeholder="Enter reward amount"
                value={rewardAmount}
                onChange={(e) => setRewardAmount(e.target.value)}
                className="bg-gray-700 text-white"
              />
            </div>
            {/* <div className="flex items-center space-x-2">
              <Switch
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
              />
              <Label htmlFor="anonymous">Make this survey anonymous</Label>
            </div> */}
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700"
          onClick={depositRewards}
        >
          Post Question/Survey
          <Send className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
