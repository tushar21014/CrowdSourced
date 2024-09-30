"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardSidebar } from "../components/SideBarDashboard";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { Input } from "../ui/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/Table";

import { LineChart, PieChart  } from "../components/ChartsComponents";
import {
  Search,
  Filter,
  Download,
  Eye,
  BarChart2,
  PieChart as PieChartIcon,
} from "lucide-react";

const mockSurveys = [
  {
    id: 1,
    name: "Customer Satisfaction Survey",
    responses: 1234,
    lastUpdated: "2023-07-15",
  },
  {
    id: 2,
    name: "Product Feedback Survey",
    responses: 567,
    lastUpdated: "2023-07-10",
  },
  {
    id: 3,
    name: "Employee Engagement Survey",
    responses: 89,
    lastUpdated: "2023-07-05",
  },
  {
    id: 4,
    name: "Market Research Survey",
    responses: 2345,
    lastUpdated: "2023-07-01",
  },
];

const mockQuestionData = {
  labels: [
    "Strongly Disagree",
    "Disagree",
    "Neutral",
    "Agree",
    "Strongly Agree",
  ],
  datasets: [
    {
      label: "Responses",
      data: [10, 20, 30, 250, 190],
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
    },
  ],
};

export default function CompanyAnalytics() {
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  return (
    <div className="flex h-screen bg-gray-900 !text-white ">
      <DashboardSidebar />
      <main className="flex-1 p-8 overflow-auto text-white">
        <motion.h1
          className="text-3xl font-bold mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Survey Analytics
        </motion.h1>

        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-gray-800 text-white">
            <CardHeader>
              <CardTitle>Select Survey</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Input
                  placeholder="Search surveys..."
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Select>
                  <SelectTrigger className="w-[180px] bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600 text-white">
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="lastWeek">Last Week</SelectItem>
                    <SelectItem value="lastMonth">Last Month</SelectItem>
                    <SelectItem value="lastYear">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Survey Name</TableHead>
                    <TableHead>Responses</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSurveys.map((survey) => (
                    <TableRow key={survey.id}>
                      <TableCell>{survey.name}</TableCell>
                      <TableCell>{survey.responses}</TableCell>
                      <TableCell>{survey.lastUpdated}</TableCell>
                      <TableCell>
                        <Button
                        //   variant="ghost"
                          size="sm"
                          onClick={() => setSelectedSurvey(survey)}
                          className="hover:bg-purple-600"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Analytics
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        {selectedSurvey && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            key={selectedSurvey.id}
          >
            <Card className="bg-gray-800 mb-6 text-white">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{selectedSurvey.name} - Analytics</span>
                  <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 ">
                  <Card className="bg-gray-700 text-white">
                    <CardHeader>
                      <CardTitle className="text-lg">Total Responses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold ">
                        {selectedSurvey.responses}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-700 text-white">
                    <CardHeader>
                      <CardTitle className="text-lg">Completion Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">87%</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Response Over Time
                    </h3>
                    <div className="h-64">
                      <LineChart
                        data={{
                          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                          datasets: [
                            {
                              label: "Responses",
                              data: [65, 59, 80, 81, 56, 55],
                              borderColor: "rgb(75, 192, 192)",
                              tension: 0.1,
                            },
                          ],
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Questions</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Question</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Responses</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          {
                            id: 1,
                            text: "How satisfied are you with our product?",
                            type: "Rating",
                            responses: 1200,
                          },
                          {
                            id: 2,
                            text: "What features do you use most?",
                            type: "Multiple Choice",
                            responses: 1150,
                          },
                          {
                            id: 3,
                            text: "How likely are you to recommend our product?",
                            type: "NPS",
                            responses: 1100,
                          },
                        ].map((question) => (
                          <TableRow key={question.id}>
                            <TableCell>{question.text}</TableCell>
                            <TableCell>{question.type}</TableCell>
                            <TableCell>{question.responses}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedQuestion(question)}
                              >
                                <BarChart2 className="mr-2 h-4 w-4" />
                                View Results
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {selectedQuestion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="bg-gray-800">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Question: {selectedQuestion.text}</span>
                  <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Export Results
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Response Distribution
                    </h3>
                    <div className="h-64">
                      <PieChart data={mockQuestionData} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Response Summary
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Option</TableHead>
                          <TableHead>Count</TableHead>
                          <TableHead>Percentage</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockQuestionData.labels.map((label, index) => (
                          <TableRow key={index}>
                            <TableCell>{label}</TableCell>
                            <TableCell>
                              {mockQuestionData.datasets[0].data[index]}
                            </TableCell>
                            <TableCell>
                              {(
                                (mockQuestionData.datasets[0].data[index] /
                                  mockQuestionData.datasets[0].data.reduce(
                                    (a, b) => a + b,
                                    0
                                  )) *
                                100
                              ).toFixed(2)}
                              %
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
}
