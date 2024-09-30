import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardSidebar } from "../components/SideBarDashboard";
import { Button } from "../ui/Button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "../ui/Card";
import { Checkbox } from "../ui/Checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/RadioGroup";
import { Label } from "../ui/Label";
import { Textarea } from "../ui/textarea";
import { toast, Toaster } from "react-hot-toast";
import {
    ChevronRight,
    ChevronLeft,
    Send,
    DollarSign,
    BarChart2,
    Clock,
} from "lucide-react";

const api = process.env.REACT_APP_API_URL;

export default function VoterQuestions() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [totalEarned, setTotalEarned] = useState(0);
  const [mockQuestions, setMockQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({ id: 1 });
  const [formEntryIds, setFormEntryIds] = useState([]);
  const [formId, setFormId] = useState(null);
  const [questions, setQuestion] = useState([]);
  const [formQuestion, setFormQuestion] = useState([]);
  const [rewards, setRewards] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  async function voteOnQuestion(questionId, optionId) {
    if (!localStorage.getItem("userId")) {
      toast.error("Please login first");
      return;
    }

    let id = parseInt(optionId);

    console.log("Voting on question:", questionId, id);
    const res = await axios.post(api + "/voters/vote/" + questionId, { userId: localStorage.getItem("userId"), questionId, optionId: id }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
        }
    });

    if (res.data.error) {
        console.error("Error voting on question:", res.data.error);
      toast.error(res.data.error);
      return;
    }

    if (res.data.success) {
      toast.success("Vote submitted!");
    //   fetchQuestions();
    }
  }

  const [selectedProject, setSelectedProject] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [totalRewardsEarned, settotalRewardsEarned] = useState(0.001)
  const [totalTasksCompleted, settotalTasksCompleted] = useState(0)
  const [questionsList, setQuestionsList] = useState([])
  const getTotalEarnings = async() => {
    try {
      const response = await fetch("http://localhost:4000/Routes/voters/getTotalEarnings", {
        method:"get",
        headers:{
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      })

      // console.log(response)
      const data = await response.json();
      console.log(data.totalRewardsEarned);
      settotalRewardsEarned(data.totalRewardsEarned)
    } catch (error) {
      console.log(error);
    }
  }

  const getTotalTasksCompleted = async() => {
    try {
      const response = await fetch("http://localhost:4000/Routes/voters/totalTasksCompleted", {
        method:"get",
        headers:{
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      })

      // console.log(response)
      const data = await response.json();
      console.log(data);
      settotalTasksCompleted(data)
    } catch (error) {
      console.log(error);
    }
  }

  const getQuestionsList = async() => {
    try {
      const response = await fetch("http://localhost:4000/Routes/voters/questionsList", {
        method:"get",
        headers:{
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      })

      // console.log(response)
      const data = await response.json();
      console.log(data);
      setQuestionsList(data)
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    getTotalEarnings();
    getTotalTasksCompleted();
    getQuestionsList();
  }, [])

  const handleLogin = async () => {
    try {
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

      const data = await res.json();
      console.log("Response Data:", data);
        setMockQuestions(data);
        setCurrentQuestion(data);
        setAnswers(new Array(data.length).fill(null)); // Initialize answers array
        console.log("Mock Questions:", mockQuestions);

      if (res.status === 204) {
        toast.error("No questions or forms available");
        return;
      }

      if (data.error) {
        toast.error("Error fetching questions");
        return;
      }

      if (data.type === 'form') {
        console.log("Form Question:", data);
        setFormId(data.QuestionFormId);
        fetchFormsQuestions(data.QuestionFormId);
      } else if (data.type === 'question') {
        console.log("Regular Question:", data);
        setQuestion(data);
      }

    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Error fetching questions");
    }
  };



  const fetchFormsQuestions = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/Routes/voters/getQuestions/${id}`, {
        method: "get",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      const data = await res.json();
      setFormQuestion(data.formData);
      console.log("I am form questions", data.formData);
    } catch (error) {
      console.log(error);
    }
  };

  const getPresignedUrl = async () => {
    try {
        console.log("Form ID:", formId);
        console.log("Answers:", answers);
      const res = await axios.post(api + "/auth/getPrefilledUrl", { formId, answers: answers });

      if (res.data.error) {
        toast.error(res.data.error);
        return;
      }

      console.log("Pre-filled URL:", res.data);

      const { prefilledUrl } = res.data;
      

    //  Open the pre-filled form in a new tab
    // window.open(prefilledUrl, "_blank");
    const newRes = await axios.post(api + "/auth/proxy", { prefilledUrl });
      console.log(newRes.data);
    if (newRes.data.status === 200 || newRes.data.status === 201) {
        toast.success("Form submitted successfully");
    } else {
        toast.error("Error submitting form");
    }
    
    window.location.reload();
    // await axios.get(prefilledUrl);
    } catch (error) {
      console.error("Error getting pre-filled URL:", error);
      toast.error("Error getting pre-filled URL");
    }
  };

  useEffect(() => {
    handleLogin();
    }, []);

  // useEffect(() => {
  //   console.log("Fetching questions...");
  //   fetchQuestions();
  //   // fetchRewards();
  // }, []);

  useEffect(() => {
    if (userId) {
      console.log("Fetching questions...");
      fetchQuestions();
    }
  }, [userId]); // This will only run once the userId has been set after login
  
  useEffect(() => {
      // document.querySelectorAll("QuestionCard")[0] remove first occurence

      document.getElementById("QuestionCard").style.display = "none";

  }, [mockQuestions]);

  function vote(questionId, optionId) {
    voteOnQuestion(questionId, optionId);
  }

 

  const handleOptionChangeRadio = (index, value) => {
    console.log("Index:", index, "Value:", value);
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

    const handleOptionChangeCheckbox = (index, value) => {
        const newAnswers = [...answers];
        if (!newAnswers[index]) {
            newAnswers[index] = [];
        }
        if (newAnswers[index].includes(value)) {
            newAnswers[index] = newAnswers[index].filter((val) => val !== value);
        } else {
            newAnswers[index].push(value);
        }
        setAnswers(newAnswers);

        console.log("Answers:", answers);
    };

    useEffect(() => {
      console.log("Mock Questions State:", mockQuestions);
    }, [mockQuestions]);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <DashboardSidebar />
      <Toaster />
      <main className="flex-1 p-8 overflow-auto text-white">
        <motion.h1
          className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Answer Questions
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-gray-800 border-purple-500/20 border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Total Earned
                </CardTitle>
                <DollarSign className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white/90">
                  {totalRewardsEarned} POL
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-gray-800 border-purple-500/20 border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Questions Answered
                </CardTitle>
                <BarChart2 className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white/90">{totalTasksCompleted}</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-gray-800 border-purple-500/20 border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  Time Spent
                </CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-white/90 text-2xl font-bold">2h 30m</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <AnimatePresence mode="sync">
          <motion.div
            key={mockQuestions.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            id="QuestionCard"
            >
            <Card className="bg-gray-800 border-purple-500/20 border mb-6 text-white/90">
              <CardHeader id="HeaderMain">
                <CardTitle className="text-2xl mb-2">
                  {mockQuestions.title || "Question"}
                </CardTitle>
                <CardDescription className="text-purple-400">
                  Reward: {mockQuestions.rewardPerVote} POL
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mockQuestions && mockQuestions.type === "question" && (
                  <RadioGroup value={answer} onValueChange={setAnswer}>
                    {mockQuestions.options.map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 mb-2"
                      >
                        <RadioGroupItem
                          value={option}
                          id={`option-${index}`}
                        //   onChange={() => handleOptionChange(currentQuestionIndex, option)}
                        onClick={( ) => setAnswer(index)}
                        />
                        <Label htmlFor={`option-${index}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
                {mockQuestions && mockQuestions.type === "image" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mockQuestions.options.map((imageUrl, index) => (
                      <div key={index} className="relative">
                        {/* <input
                          type="radio"
                          id={`image-${index}`}
                          name="image-option"
                          value={index}
                          className="sr-only"
                          onChange={() => handleOptionChange(currentQuestionIndex, String(index))}
                        /> */}
                        <label
                          htmlFor={`image-${index}`}
                          className="cursor-pointer"
                        >
                          <img
                            src={imageUrl.imageUrl}
                            alt={`Option ${index + 1}`}
                            className={`w-full h-auto rounded-lg transition-all duration-300 ${
                              answer === index
                                ? "ring-4 ring-purple-500"
                                : "hover:ring-2 hover:ring-purple-400"
                            }`}

                            onClick={() => setAnswer(index)}
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                )}
                {mockQuestions && mockQuestions.type === "form" && (
                  <form>
                    {formQuestion && formQuestion.map((question, index) => (
                      <div key={question.id} className="mb-6">
                        <Label className="text-lg mb-2 block">
                          {index + 1}. {question.title}
                        </Label>
                        {question.questionItem.question.choiceQuestion.type === "RADIO" ? (
                          <RadioGroup>
                            {question.questionItem.question.choiceQuestion.options.map((option, optionIndex) => (
                              <div
                                key={optionIndex}
                                className="flex items-center space-x-2"
                                  onChange={() => handleOptionChangeRadio(index, option.value)}
                              >
                                <RadioGroupItem
                                  value={option.value}
                                  id={`q${question.id}-option${optionIndex}`}
                                />
                                <Label
                                  htmlFor={`q${question.id}-option${optionIndex}`}
                                >
                                  {option ? option.value : "Option " + optionIndex}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        ) : (
                          question.questionItem.question.choiceQuestion.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className="flex items-center space-x-2 mb-2"
                            >
                              <Checkbox
                                id={`q${question.id}-option${optionIndex}`}
                                onClick={() => handleOptionChangeCheckbox(index, option.value)}
                              />
                              <Label
                                htmlFor={`q${question.id}-option${optionIndex}`}
                              >
                                {option ? option.value : "Option " + optionIndex}
                              </Label>
                            </div>
                          ))
                        )}
                      </div>
                    ))}
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div className="flex justify-center items-center space-x-4">
            <Button
              className="flex items-center justify-center space-x-2 bg-purple-500 hover:bg-purple-600"
              onClick={() => {
                if (mockQuestions.type === "form") {
                  getPresignedUrl();
                } else {
                  vote(mockQuestions.id, answer);
                }
              }}
            >
              <Send />
              <span>Submit Answer</span>
            </Button>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}