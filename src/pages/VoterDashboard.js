"use client";
import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import axios from "axios";
import { toast } from "react-hot-toast";

import { LineChart, DoughnutChart } from "../components/ChartsComponents";

import { DashboardSidebar } from "../components/SideBarDashboard";

// Mock data for charts
const mockChartData = {
  earnings: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Earnings",
        data: [50, 75, 60, 100, 120, 90, 150],
        borderColor: "rgb(99, 102, 241)",
        tension: 0.1,
      },
    ],
  },
  taskTypes: {
    labels: [
      "Surveys",
      "Product Testing",
      "Data Labeling",
      "Content Moderation",
    ],
    datasets: [
      {
        data: [40, 25, 20, 15],
        backgroundColor: ["#8b5cf6", "#6366f1", "#3b82f6", "#0ea5e9"],
      },
    ],
  },
};

export default function VoterDashboard() {
  const [selectedProject, setSelectedProject] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [totalRewardsEarned, settotalRewardsEarned] = useState(0);
  const [totalTasksCompleted, settotalTasksCompleted] = useState(0);
  const [questionsList, setQuestionsList] = useState([]);
  const getTotalEarnings = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/Routes/voters/getTotalEarnings",
        {
          method: "get",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      // console.log(response)
      const data = await response.json();
      console.log(data.totalRewardsEarned);
      settotalRewardsEarned(data.totalRewardsEarned);
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalTasksCompleted = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/Routes/voters/totalTasksCompleted",
        {
          method: "get",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      // console.log(response)
      const data = await response.json();
      console.log(data);
      settotalTasksCompleted(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getQuestionsList = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/Routes/voters/questionsList",
        {
          method: "get",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      // console.log(response)
      const data = await response.json();
      console.log(data);
      setQuestionsList(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTotalEarnings();
    getTotalTasksCompleted();
    getQuestionsList();
  }, []);

  async function withdrawRewards () {
    const res = await axios.post("http://localhost:4000/Routes/voters/emptyBalance", {
      totalRewardsEarned
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      }
    })
    console.log(res)
      setTimeout(() => {
        window.location.reload();
      }, 4000);
      toast.promise(
        new Promise((resolve) => setTimeout(resolve, 2000)),
        {
          loading: "Withdrawing...",
          success: "Withdrawal Confirmed",
          error: "Error withdrawing",
        }
      );
    
  }

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <DashboardSidebar />
      {/* Main content */}
      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        <Button
          onClick={withdrawRewards} 
          size="sm"
          className="absolute top-8 right-12 bg-purple-600 hover:bg-purple-700"
        >
          Withdraw
        </Button>
        <h1 className="text-3xl font-bold mb-8">Voter Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="bg-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Total Earnings</CardTitle>
            </CardHeader>
            <CardContent className="text-white">
              <p className="text-4xl font-bold">{totalRewardsEarned} POL</p>
              <p className="text-gray-400">≈ 0.042725 BTC</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Tasks Completed</CardTitle>
            </CardHeader>
            <CardContent className="text-white">
              <p className="text-4xl font-bold">{totalTasksCompleted}</p>
              <p className="text-gray-400">Last 30 days: 42</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Earnings Over Time</CardTitle>
          </CardHeader>
          <CardContent className="text-white">
            <div className="h-64">
              <LineChart data={mockChartData.earnings} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Task Types Completed</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-center text-white/90 w-full">
            <div className="w-1/2 h-64">
              <DoughnutChart data={mockChartData.taskTypes} />
            </div>
            <div className="w-1/2 space-y-4">
              <div className="grid grid-cols-5 justify-between items-center">
                <span className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-[#8b5cf6] mr-2"></span>{" "}
                  Surveys
                </span>
                <span>40%</span>
              </div>
              <div className="grid grid-cols-5 justify-between items-center">
                <span className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-[#6366f1] mr-2"></span>{" "}
                  Product Testing
                </span>
                <span>25%</span>
              </div>
              <div className="grid grid-cols-5 justify-between items-center">
                <span className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-[#3b82f6] mr-2"></span>{" "}
                  Data Labeling
                </span>
                <span>20%</span>
              </div>
              <div className="grid grid-cols-5 justify-between items-center">
                <span className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-[#0ea5e9] mr-2"></span>{" "}
                  Content Moderation
                </span>
                <span>15%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Available Tasks</CardTitle>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[180px] bg-gray-700 text-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="surveys">Surveys</SelectItem>
                <SelectItem value="product-testing">Product Testing</SelectItem>
                <SelectItem value="data-labeling">Data Labeling</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="text-white">
            <div className="space-y-4">
              {questionsList.map((q, key) => (
                <div
                  key={key}
                  className="grid grid-cols-5 justify-between items-center"
                >
                  <span>Product Feedback Survey</span>
                  <span>Survey</span>
                  <span>15 min</span>
                  <span>$5.00</span>
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Start Task
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
