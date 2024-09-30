"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Checkbox } from "../ui/Checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";
import { Circle, PlusCircle, PlusSquareIcon, Square, Trash2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import CustomLoader from "./CustomLoader";

export default function SurveyForm({
  questions,
  setQuestions,
  isFormCreated,
  setIsFormCreated,
  setFormId,
  title,
  setTitle,
}) {
  // const [questions, setQuestions] = useState([]);
  const [currentTab, setCurrentTab] = useState("form");

  const [amount, setAmount] = useState(0);

  const [loading , setLoading] = useState(false);

  const addQuestion = (type) => {
    if (questions.length < 10) {
      setQuestions([
        ...questions,
        {
          id: Date.now(),
          type,
          title: "",
          options: [""],
        },
      ]);
    }
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const addOption = (questionId) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, options: [...q.options, ""] } : q
      )
    );
  };

  const updateOption = (questionId, optionIndex, value) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          const newOptions = [...q.options];
          newOptions[optionIndex] = value;
          return { ...q, options: newOptions };
        }
        return q;
      })
    );
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const removeOption = (questionId, optionIndex) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          const newOptions = q.options.filter(
            (o, index) => index !== optionIndex
          );
          return { ...q, options: newOptions };
        }
        return q;
      })
    );
  };

  useEffect(() => {
    console.log(questions);
  }, [questions]);

  const createForm = async () => {
    try {
      setLoading(true);
      const authToken = localStorage.getItem("authToken");
      const response = await axios.post(
        "http://localhost:4000/Routes/company/createForm",
        {
          title: title,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setIsFormCreated(true);
      setFormId(response.data.formid);
      console.log("Form created successfully");
      toast.success("Form created successfully");
      console.log(response.data.formid);
      setLoading(false);
    } catch (error) {
      console.error("Error creating form:", error);
    }
  };

  return (
    <div className="mt-4">
    {loading && <CustomLoader text="Creating Form" />}
      {!isFormCreated ? (
        <Button
          onClick={createForm}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Create Form <PlusCircle className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <Tabs
          value={currentTab}
          onValueChange={setCurrentTab}
          className="space-y-4 text-white"
        >
          <TabsList className="bg-gray-700">
            <TabsTrigger value="form">Form</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="form">
            <Card className="bg-gray-900 mb-8">
              <CardHeader>
                <CardTitle className="flex justify-between items-center text-white">
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Form Title"
                    className="bg-gray-700 text-white"
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                {questions.map((question, index) => (
                  <Card key={question.id} className="bg-gray-800 mb-4 p-4">
                    <div className="flex justify-between items-center mb-2 text-white">
                      <h3 className="text-lg font-semibold text-white">
                        Question {index + 1}
                      </h3>
                      <Button
                        onClick={() => removeQuestion(question.id)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      value={question.title}
                      onChange={(e) =>
                        updateQuestion(question.id, "title", e.target.value)
                      }
                      placeholder="Enter question title"
                      className="mb-2 bg-gray-700 text-white"
                    />
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center mb-2">
                        {question.type === "radio" ? (
                          <Circle className="h-6 w-6 m-4 text-purple-500" />
                        ) : (
                          <Square className="h-6 w-6 m-4 text-purple-500" />
                        )}
                        <Input
                          value={option}
                          onChange={(e) =>
                            updateOption(
                              question.id,
                              optionIndex,
                              e.target.value
                            )
                          }
                          placeholder={`Option ${optionIndex + 1}`}
                          className=" bg-gray-700 text-white"
                        />
                        <Button
                          // remove option
                          onClick={() => removeOption(question.id, optionIndex)}
                          variant="destructive"
                          size="sm"
                          className="m-2 p-2 "
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      onClick={() => addOption(question.id)}
                      className="mt-2 bg-purple-600 hover:bg-purple-700"
                    >
                      Add Option
                    </Button>
                  </Card>
                ))}
              </CardContent>
            </Card>

            <Popover>
                  <PopoverTrigger className="text-white bg-gray-700 rounded-sm mt-4">
                  <Button className="bg-purple-600 hover:bg-purple-700 ">

                  <PlusSquareIcon className="h-6 w-6 text-white mr-2" /> Add Question
                  </Button>
                  </PopoverTrigger>
                  <PopoverContent className="flex rounded-sm flex-col space-y-2 bg-gray-800 ">
                    <Button
                      onClick={() => addQuestion("radio")}
                      className=" bg-purple-600 hover:bg-purple-700 "
                      disabled={questions.length >= 10}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Radio Question
                    </Button>
                    <Button
                      onClick={() => addQuestion("checkbox")}
                      className="bg-purple-600 hover:bg-purple-700"
                      disabled={questions.length >= 10}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Checkbox
                      Question
                    </Button>
                  </PopoverContent>
                </Popover>
          </TabsContent>

          <TabsContent value="preview">
            <Card className="bg-gray-900 text-white">
              <CardHeader>
                <CardTitle>Survey Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <form>
                  {questions.map((question, index) => (
                    <div key={question.id} className="mb-6">
                      <Label className="text-lg mb-2 block">
                        {index + 1}. {question.title}
                      </Label>
                      {question.type === "radio" ? (
                        <RadioGroup>
                          {question.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem
                                value={option}
                                id={`q${question.id}-option${optionIndex}`}
                              />
                              <Label
                                htmlFor={`q${question.id}-option${optionIndex}`}
                              >
                                {option ? option : "Option " + optionIndex}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      ) : (
                        question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="flex items-center space-x-2 mb-2"
                          >
                            <Checkbox
                              id={`q${question.id}-option${optionIndex}`}
                            />
                            <Label
                              htmlFor={`q${question.id}-option${optionIndex}`}
                            >
                              {option ? option : "Option " + optionIndex}
                            </Label>
                          </div>
                        ))
                      )}
                    </div>
                  ))}
                </form>

              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
                
    </div>
  );
}
