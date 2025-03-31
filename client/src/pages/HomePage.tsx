"use client";

import { useState, useEffect } from "react";
import { BookOpen, Brain, Sparkles, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { QuizCard } from "../components/QuizCard";
import { ProgressBar } from "../components/ProgressBar";
import { QuizSummary } from "../components/QuizSummary";
import { DifficultySelector } from "../components/DifficultySelector";
import Eresources  from "../components/Eresources"
import { difficulties } from "../data/quizzes";
import { fetchQuestions } from "../services/api";
// import type { ParsedQuestion } from "./types"
import type { Question } from "../types";
import Image from "../Assets/Frame-1.png";
import ChatWidget from "../components/ChatWidget";
import Loading from "../components/Loading";
import { Link } from 'react-router-dom';

const QUESTION_TIMER = 30;

interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: Record<string, string | null>;
  timeRemaining: number;
  quizStatus: "idle" | "in-progress" | "completed";
  isLoading?: boolean;
  error?: string;
}

function App() {
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [showDifficultySelection, setShowDifficultySelection] = useState<boolean>(false);
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [showSelectionSection, setShowSelectionSection] = useState<boolean>(false); // New state for showing/hiding the selection section
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: {},
    timeRemaining: QUESTION_TIMER,
    quizStatus: "idle",
    isLoading: false,
  });

  const [evaluationFeedback, setEvaluationFeedback] = useState<string>("");

  // Engineering branches
  const branches = [
    { value: "computer-science", label: "Computer Science Engineering" },
    { value: "electrical", label: "Electrical Engineering" },
    { value: "mechanical", label: "Mechanical Engineering" },
    { value: "civil", label: "Civil Engineering" },
    { value: "electronics", label: "Electronics & Communication" },
    { value: "chemical", label: "Chemical Engineering" },
  ];

  // Subjects based on selected branch
  const getSubjects = (branch: string) => {
    const subjectMap: Record<string, { value: string; label: string }[]> = {
      "computer-science": [
        { value: "data-structures", label: "Data Structures & Algorithms" },
        { value: "database", label: "Database Management Systems" },
        { value: "networks", label: "Computer Networks" },
        { value: "os", label: "Operating Systems" },
        { value: "ai", label: "Artificial Intelligence" },
      ],
      electrical: [
        { value: "circuits", label: "Electric Circuits" },
        { value: "power-systems", label: "Power Systems" },
        { value: "control-systems", label: "Control Systems" },
        { value: "machines", label: "Electrical Machines" },
      ],
      mechanical: [
        { value: "thermodynamics", label: "Thermodynamics" },
        { value: "fluid-mechanics", label: "Fluid Mechanics" },
        { value: "manufacturing", label: "Manufacturing Processes" },
        { value: "machine-design", label: "Machine Design" },
      ],
      civil: [
        { value: "structures", label: "Structural Engineering" },
        { value: "geotechnical", label: "Geotechnical Engineering" },
        { value: "transportation", label: "Transportation Engineering" },
        { value: "environmental", label: "Environmental Engineering" },
      ],
      electronics: [
        { value: "digital-electronics", label: "Digital Electronics" },
        { value: "analog-circuits", label: "Analog Circuits" },
        { value: "microprocessors", label: "Microprocessors" },
        { value: "communication", label: "Communication Systems" },
      ],
      chemical: [
        { value: "unit-operations", label: "Unit Operations" },
        {
          value: "reaction-engineering",
          label: "Chemical Reaction Engineering",
        },
        { value: "process-control", label: "Process Control" },
        { value: "thermodynamics", label: "Chemical Thermodynamics" },
      ],
    };

    return subjectMap[branch] || [];
  };

  // Handle branch selection
  const handleBranchChange = (value: string) => {
    setSelectedBranch(value);
    setSelectedSubject("");
    setShowDifficultySelection(false);
  };

  // Toggle the selection section visibility
  const toggleSelectionSection = () => {
    setShowSelectionSection(!showSelectionSection);
  };

  // Add a new function to handle the Start Assessment button click
  const handleStartAssessment = () => {
    // Only proceed to difficulty selection if both branch and subject are selected
    if (selectedBranch && selectedSubject) {
      setShowDifficultySelection(true); // This will trigger showing the difficulty screen
    }
  };

  // Timer: Decrease timeRemaining every second
  useEffect(() => {
    if (quizState.quizStatus === "in-progress") {
      const timer = setInterval(() => {
        setQuizState((prev) => {
          if (prev.timeRemaining <= 0) {
            // When time is up for a question, auto-mark it as skipped
            if (prev.currentQuestionIndex < prev.questions.length - 1) {
              return {
                ...prev,
                currentQuestionIndex: prev.currentQuestionIndex + 1,
                timeRemaining: QUESTION_TIMER,
                userAnswers: {
                  ...prev.userAnswers,
                  [prev.questions[prev.currentQuestionIndex].id]: null,
                },
              };
            } else {
              return { ...prev, quizStatus: "completed" };
            }
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizState.quizStatus, quizState.currentQuestionIndex]);

  const startQuiz = async () => {
    setQuizState((prev) => ({ ...prev, isLoading: true, error: undefined }));

    try {
      const fetchedQuestions = await fetchQuestions(
        selectedSubject,
        selectedDifficulty
      );

      setQuizState({
        questions: fetchedQuestions,
        currentQuestionIndex: 0,
        userAnswers: {},
        timeRemaining: QUESTION_TIMER,
        quizStatus: "in-progress",
        isLoading: false,
      });
    } catch (error) {
      setQuizState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to load questions. Please try again.",
      }));
    }
  };

  const handleAnswerSelect = (answer: string) => {
    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    setQuizState((prev) => ({
      ...prev,
      userAnswers: { ...prev.userAnswers, [currentQuestion.id]: answer },
    }));
  };

  // Move to next question
  const handleNextQuestion = () => {
    setQuizState((prev) => {
      if (prev.currentQuestionIndex < prev.questions.length - 1) {
        return {
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          timeRemaining: QUESTION_TIMER,
        };
      } else {
        return { ...prev, quizStatus: "completed" };
      }
    });
  };

  // Skip the current question (marks it as skipped)
  const handleSkipQuestion = () => {
    setQuizState((prev) => {
      if (prev.currentQuestionIndex < prev.questions.length - 1) {
        return {
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          timeRemaining: QUESTION_TIMER,
          userAnswers: {
            ...prev.userAnswers,
            [prev.questions[prev.currentQuestionIndex].id]: null,
          },
        };
      } else {
        return { ...prev, quizStatus: "completed" };
      }
    });
  };

  const resetQuiz = () => {
    setSelectedBranch("");
    setSelectedSubject("");
    setSelectedDifficulty("");
    setShowDifficultySelection(false);
    setShowSelectionSection(false); // Reset the selection section visibility
    setQuizState({
      questions: [],
      currentQuestionIndex: 0,
      userAnswers: {},
      timeRemaining: QUESTION_TIMER,
      quizStatus: "idle",
      isLoading: false,
    });
    setEvaluationFeedback("");
  };

  const Header = () => (
    <header className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 p-6 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="w-10 h-10 text-white" />
          <h1 className="text-3xl font-bold text-white">EduNexus</h1>
        </div>
        <nav className="flex items-center space-x-6">
          <Link to="/signup" className="transform transition hover:scale-105">
            <button className="bg-white text-indigo-600 px-5 py-2 rounded-full shadow-md hover:bg-gray-100">
              Login
            </button>
          </Link>
          <Link to="/dashboard" className="transform transition hover:scale-105">
            <button className="bg-white text-indigo-600 px-5 py-2 rounded-full shadow-md hover:bg-gray-100">
              Dashboard
            </button>
          </Link>
        </nav>
      </div>
    </header>
  );
  
  // New Footer component
  const Footer = () => (
    <div className="w-full bg-gradient-to-r from-indigo-800 to-purple-900 p-4 shadow-inner">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-white flex items-center justify-center">
          By EduNexus Team © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );

  const renderPage = () => {
    if (quizState.quizStatus === "idle") {
      if (!selectedSubject || !showDifficultySelection) {
        return (
          <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-purple-100 to-pink-100 animate-fadeIn">
            <Header />
            <div className="max-w-6xl mx-auto px-4 py-12">
              <div className="text-center mb-12">
                <div className="inline-block p-3 bg-white rounded-full mb-8 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all">
                  <BookOpen className="w-12 h-12 text-indigo-600" />
                </div>
                <h1 className="text-5xl font-bold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  Welcome to EduNexus
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
                  Challenge and grow your knowledge with our interactive,{" "}
                  <strong>AI-powered</strong> quiz and assessment system along with personalized Learning Partner. Take
                  quizzes on a variety of subjects, receive real-time feedback with guidance
                  and gain valuable insights into your performance.
                </p>
                
                {/* "Test Yourself" Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg px-8 py-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-[0_5px_20px_rgba(79,70,229,0.4)] mb-12"
                  onClick={toggleSelectionSection}
                >
                  {showSelectionSection ? "Hide Options" : "Test Yourself"}
                  <ChevronRight className="ml-2 h-5 w-5" />
                </motion.button>
              </div>

              {/* New prompt line before subjects - only shown when selection section is visible */}
              {showSelectionSection && (
                <p className="text-center text-lg text-indigo-600 mb-6">
                  You can take tests on a wide range of subjects — choose one
                  below:
                </p>
              )}

              {/* Branch and Subject Selection - only shown when selection section is visible */}
              {showSelectionSection && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mx-auto rounded-2xl shadow-xl p-8 mb-16 transform transition-all hover:shadow-2xl duration-300 bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm"
                >
                  <div className="flex items-center justify-center mb-6">
                    <div className="bg-indigo-100 p-3 rounded-full mr-4">
                      <svg
                        className="w-6 h-6 text-indigo-600"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          d="M12 6V12M12 12V18M12 12H18M12 12H6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Select Your Engineering Path
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-3">
                      <label
                        htmlFor="branch"
                        className="text-sm font-medium text-gray-700 flex items-center"
                      >
                        <span className="bg-indigo-100 p-1 rounded-md mr-2">
                          <svg
                            className="w-4 h-4 text-indigo-600"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              d="M12 6V12M12 12V18M12 12H18M12 12H6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        Engineering Branch
                      </label>
                      <CustomSelect
                        id="branch"
                        value={selectedBranch}
                        onChange={handleBranchChange}
                        options={branches}
                        placeholder="Select branch"
                      />
                    </div>

                    <div className="space-y-3">
                      <label
                        htmlFor="subject"
                        className="text-sm font-medium text-gray-700 flex items-center"
                      >
                        <span className="bg-indigo-100 p-1 rounded-md mr-2">
                          <svg
                            className="w-4 h-4 text-indigo-600"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              d="M12 6V12M12 12V18M12 12H18M12 12H6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        Subject
                      </label>
                      <CustomSelect
                        id="subject"
                        value={selectedSubject}
                        onChange={setSelectedSubject}
                        options={getSubjects(selectedBranch)}
                        placeholder={
                          selectedBranch
                            ? "Select subject"
                            : "Select subject"
                        }
                        disabled={!selectedBranch}
                      />
                    </div>
                  </div>

                  <div className="flex justify-center pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!selectedBranch || !selectedSubject}
                    className={`flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg px-8 py-3 rounded-xl shadow-lg transition-all duration-300 ${
                      !selectedBranch || !selectedSubject
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:shadow-[0_5px_20px_rgba(79,70,229,0.4)]"
                    }`}
                    onClick={handleStartAssessment}
                  >
                    Start Quiz/Assessment
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </motion.button>
                  </div>
                </motion.div>
              )}
              {/* Eresources section */}
              <div className="h-20"></div> {/* Adds vertical space */}
                  <Eresources />


              {/* Additional content section */}
              <section className="mt-16">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
                  Why Choose EduNexus?
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <BookOpen className="w-10 h-10 text-indigo-600 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Diverse Quiz Topics
                    </h3>
                    <p className="text-gray-600">
                      Explore a wide range of AI-based quizzes covering various
                      subjects to test your general knowledge.
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <Brain className="w-10 h-10 text-purple-600 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Instant Feedback
                    </h3>
                    <p className="text-gray-600">
                      Receive immediate insights on your answers to understand
                      your strengths and areas for improvement.
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <Sparkles className="w-10 h-10 text-purple-600 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      AI-Powered Assistance
                    </h3>
                    <p className="text-gray-600">
                      Track your performance and get last-minute prep help from
                      our integrated AI chatbot.
                    </p>
                  </div>
                </div>
              </section>
            </div>
            <Footer />
          </div>
        );
      }

      if (showDifficultySelection && !selectedDifficulty) {
        return (
          <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-purple-100 to-pink-100 animate-fadeIn">
            <Header />
            <div className="max-w-4xl mx-auto px-4 py-12">
              <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-transform duration-300">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  Choose Your Challenge Level
                </h2>
                <DifficultySelector
                  difficulties={difficulties}
                  selected={selectedDifficulty}
                  onSelect={setSelectedDifficulty}
                />

                {/* Added back button for better navigation */}
                <div className="flex justify-between mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 border border-indigo-500 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all"
                    onClick={() => {
                      setShowDifficultySelection(false);
                    }}
                  >
                    Back
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!selectedDifficulty}
                    className={`bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg shadow-md transition-all ${
                      !selectedDifficulty
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:shadow-lg"
                    }`}
                    onClick={() => {
                      // Continue to the next step
                    }}
                  >
                    Continue
                  </motion.button>
                </div>
              </div>
            </div>
            <Footer />
          </div>
        );
      }

      return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center animate-fadeIn">
          
          <div className="max-w-2xl w-full px-4 py-12">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                Ready to Challenge Yourself?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                You've selected{" "}
                {
                  getSubjects(selectedBranch).find(
                    (s) => s.value === selectedSubject
                  )?.label
                }{" "}
                at {difficulties.find((d) => d.id === selectedDifficulty)?.name}{" "}
                level.
              </p>
              <img
                src={Image || "/placeholder.svg"}
                alt="person image"
                className="mb-4 w-1/2 rounded-md mx-auto"
              />
              {quizState.error && (
                <p className="text-red-500 mb-4">{quizState.error}</p>
              )}
              <div className="flex gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 border border-indigo-500 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all"
                  onClick={() => {
                    setSelectedDifficulty("");
                  }}
                >
                  Back
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={quizState.isLoading}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:opacity-90 transition-all hover:shadow-md disabled:opacity-50 flex items-center justify-center"
                  onClick={startQuiz}
                >
                  {quizState.isLoading ? (
                    <>
                      <motion.div
                        className="w-6 h-6 border-4 border-t-transparent border-white rounded-full mr-2"
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Number.POSITIVE_INFINITY,
                          duration: 1,
                          ease: "linear",
                        }}
                      />
                      <span>Loading...</span>
                    </>
                  ) : (
                    "Start Quiz"
                  )}
                </motion.button>
              </div>
            </div>
          </div>
          
        </div>
      );
    }

    if (quizState.quizStatus === "completed") {
      const correctAnswers = Object.entries(quizState.userAnswers).filter(
        ([id, answer]) => {
          const question = quizState.questions.find((q) => q.id === id);
          return question?.correctAnswer === answer;
        }
      ).length;

      // Construct quiz results array
      const quizResults = quizState.questions.map((q) => ({
        id: q.id,
        question: q.question,
        userAnswer: quizState.userAnswers[q.id] || null,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      }));

      return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-purple-100 to-pink-100 animate-fadeIn">
          <Header />
          <div className="flex items-center justify-center p-4 py-12">
            <QuizSummary
              score={correctAnswers}
              totalQuestions={quizState.questions.length}
              feedback={`You correctly answered ${correctAnswers} out of ${quizState.questions.length} questions.`}
              results={quizResults}
              onRestart={resetQuiz}
              onHome={resetQuiz}
            />
          </div>
          <Footer />
        </div>
      );
    }

    // Quiz in progress page
    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];

    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-purple-100 to-pink-100 animate-fadeIn">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-12">
          <ProgressBar
            current={quizState.currentQuestionIndex}
            total={quizState.questions.length}
          />
          <div className="mt-8">
            <QuizCard
              question={currentQuestion}
              selectedAnswer={quizState.userAnswers[currentQuestion?.id]}
              timeRemaining={quizState.timeRemaining}
              onAnswerSelect={handleAnswerSelect}
              showFeedback={false}
              onNext={handleNextQuestion}
              onSkip={handleSkipQuestion}
            />
          </div>
        </div>
        <Footer />
      </div>
    );
  };

  return (
    <>
      {quizState.isLoading ? <Loading message="Loading..." /> : renderPage()}
      <ChatWidget />
    </>
  );
}

// Custom Select Component
interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder: string;
  disabled?: boolean;
}

function CustomSelect({
  id,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="relative">
      <button
        id={id}
        type="button"
        className={`w-full flex items-center justify-between border-2 border-indigo-200 bg-white h-12 px-4 rounded-xl transition-all text-left ${
          disabled
            ? "opacity-60 cursor-not-allowed"
            : "cursor-pointer hover:border-indigo-600"
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className={`${!value ? "text-gray-500" : "text-gray-900"}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-indigo-200 rounded-xl shadow-lg max-h-60 overflow-auto">
          {options.length > 0 ? (
            options.map((option) => (
              <div
                key={option.value}
                className="px-4 py-2 cursor-pointer hover:bg-indigo-50 hover:text-indigo-600"
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">No options available</div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;