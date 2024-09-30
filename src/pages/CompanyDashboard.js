"use client";

import { useState, useEffect } from "react";

import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Input } from "../ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";

import { DashboardSidebar } from "../components/SideBarDashboard";

import { LineChart, DoughnutChart } from "../components/ChartsComponents";

// Mock data for charts
const mockChartData = {
  responses: {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Responses",
        data: [500, 750, 600, 1000, 1200, 900, 1500],
        borderColor: "rgb(99, 102, 241)",
        tension: 0.1,
      },
    ],
  },
  taskDistribution: {
    labels: [
      "Surveys",
      "Product Testing",
      "Data Labeling",
      "Content Moderation",
    ],
    datasets: [
      {
        data: [35, 30, 20, 15],
        backgroundColor: ["#8b5cf6", "#6366f1", "#3b82f6", "#0ea5e9"],
      },
    ],
  },
};

export default function CompanyDashboard() {
  const [selectedProject, setSelectedProject] = useState("all");
  const [activeProjects, setActiveProjects] = useState(0);
  const [totalMoneySpent, setTotalMoneySpent] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);
  const [totalImageQuestions, setTotalImageQuestions] = useState(0);
  const [recentProjects, setRecentProjects] = useState([]);

  // Recent forms
  const getCompanyForms = async (req, res) => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch(
        "http://localhost:4000/Routes/company/getForms",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Company Forms Fetched Successfully");
      const data = await response.json();
      // console.log(data.forms.length)
      setActiveProjects(data.forms.length);
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalMoneySpent = async (req, res) => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch(
        "http://localhost:4000/Routes/company/totalMoneySpent",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Toatal Money Fetched Successfully");
      const data = await response.json();
      setTotalMoneySpent(data.response.totalMoneySpent);
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalVotes = async (req, res) => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch(
        "http://localhost:4000/Routes/company/totalVotes",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Total Votes Fetched Successfully");
      let data = await response.json();
      data = data.response;
      // console.log(data[0].totalVotes)
      var temp = 0;
      for (let i = 0; i < data.length; i++) {
        console.log("I am data", data[i]);
        temp += data[i].totalVotes;
      }
      console.log("I am temp", temp);
      setTotalVotes(temp);
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalImageQuestions = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch(
        "http://localhost:4000/Routes/company/getImageQuestions",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      let data = await response.json();
      data = data.questions;
      // console.log(data.length)
      setTotalImageQuestions(data.length);
    } catch (error) {
      console.log(error);
    }
  };

  const getRecentProjects = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch(
        "http://localhost:4000/Routes/company/getRecentProjects",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      let data = await response.json();

      if (data) {
        console.log(data);
        data = data.projects;
        setRecentProjects(data);
      } else {
        setRecentProjects([]);
      }

      // setTotalImageQuestions(data.length);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (
      localStorage.getItem("authToken") &&
      localStorage.getItem("walletaddress")
    ) {
      console.log("User is logged in");
    } else {
      console.log("User is not logged in");
      window.location.href = "/register";
    }
  }, []);

  useEffect(() => {
    getCompanyForms();
    getTotalMoneySpent();
    getTotalVotes();
    getTotalImageQuestions();
    getRecentProjects();
  }, []);

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <DashboardSidebar />
      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-8">Company Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <Card className="bg-gray-800">
            <CardHeader className="text-white">
              <CardTitle>Total Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-white/90">{totalVotes}</p>
              <p className="text-gray-400">Across all projects</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800">
            <CardHeader className="text-white">
              <CardTitle>Active Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-white/90">
                {activeProjects}
              </p>
              <p className="text-gray-400">
                {totalImageQuestions} Image Questions
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800">
            <CardHeader className="text-white">
              <CardTitle>Total Money Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-white/90">
                {totalMoneySpent} POL
              </p>
              {/* <p className="text-gray-400">10% </p> */}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-800 mb-8">
          <CardHeader className="text-white">
            <CardTitle>Response Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <LineChart data={mockChartData.responses} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 mb-8">
          <CardHeader className="text-white">
            <CardTitle>Task Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <div className="w-1/2 h-64">
              <DoughnutChart data={mockChartData.taskDistribution} />
            </div>
            <div className="w-1/2 space-y-4 text-white/80">
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-[#8b5cf6] mr-2"></span>{" "}
                  Surveys
                </span>
                <span>35%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-[#6366f1] mr-2"></span>{" "}
                  Product Testing
                </span>
                <span>30%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-[#3b82f6] mr-2"></span>{" "}
                  Data Labeling
                </span>
                <span>20%</span>
              </div>
              <div className="flex justify-between items-center">
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
          <CardHeader className="flex flex-row items-center justify-between text-white">
            <CardTitle>Recent Projects</CardTitle>
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-[180px] bg-gray-700 text-white">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white">
                <SelectItem value="all">All Projects</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>

          <CardContent className="text-white/90">
            <div className="space-y-4">
              {recentProjects && recentProjects.slice(0, 3).map((project, key) => (
                <div
                  key={key}
                  className="grid grid-cols-5 justify-between items-center"
                >
                  <span>{project.title || "Untitled Project"}</span>
                  <span>{project.type || "Unknown Type"}</span>
                  <span>{project.status || "Active"}</span>
                  <span>{project.totalVotes || "0"} responses</span>
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    View Results
                  </Button>
                </div>
              ))}
              {recentProjects && recentProjects.length > 3 && (
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  View More
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
