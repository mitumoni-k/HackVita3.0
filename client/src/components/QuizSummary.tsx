"use client"

import { useState } from "react"
import axios from "axios"
import {
  Trophy,
  BarChart2,
  Check,
  X,
  RefreshCw,
  AlertTriangle,
  BookOpen,
  Loader,
  MessageSquare,
  Home,
} from "lucide-react"

export interface QuizResult {
  id: string
  question: string
  userAnswer: string | null
  correctAnswer: string
  explanation: string | undefined
}

interface QuizSummaryProps {
  score: number
  totalQuestions: number
  feedback: string
  results: QuizResult[]
  onRestart: () => void;
  onHome: () => void;
}

export function QuizSummary({ score, totalQuestions, feedback, results, onRestart }: QuizSummaryProps) {
  const [activePage, setActivePage] = useState<"summary" | "details" | "studyGuide">("summary")
  const [studyHelpResponse, setStudyHelpResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const percentage = (score / totalQuestions) * 100

  let message = ""
  let color = ""
  let gradientColors = ""

  if (percentage >= 80) {
    message = "Outstanding Performance! 🎉"
    color = "text-green-500"
    gradientColors = "from-green-400 to-emerald-400"
  } else if (percentage >= 60) {
    message = "Good Work! Keep Learning! 👍"
    color = "text-blue-500"
    gradientColors = "from-blue-400 to-cyan-400"
  } else {
    message = "Keep Practicing! You'll Get Better! 💪"
    color = "text-red-500"
    gradientColors = "from-red-400 to-orange-400"
  }

  // Function to send the detailed summary to the study help API
  const handleGetStudyHelp = async () => {
    setActivePage("studyGuide")

    if (!studyHelpResponse && !loading) {
      setLoading(true)
      setError("")

      // Build the detailed summary from all quiz results
      const summaryMessage = results
        .map(
          (result) =>
            `Question: ${result.question}\nYour Answer: ${result.userAnswer || "Skipped"}\nCorrect Answer: ${result.correctAnswer}\nExplanation: ${result.explanation}`,
        )
        .join("\n\n")

      try {
        const response = await axios.post("http://localhost:8000/summary-insights", {
          message: summaryMessage,
        })

        setStudyHelpResponse(response.data.help)
        setLoading(false)
      } catch (error) {
        console.error("Error sending study help request:", error)
        setError("Could not get study help. Please try again later.")
        setLoading(false)
      }
    }
  }

  return (
    <div className="w-full max-w-3xl bg-gradient-to-b from-white to-purple-50 rounded-2xl shadow-xl p-8 animate-fadeIn relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-100 rounded-full opacity-50"></div>
      <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-blue-100 rounded-full opacity-50"></div>

      {/* Navigation Tabs */}
      <div className="flex justify-center mb-8 relative z-10">
        <div className="bg-white rounded-full shadow-md p-1 flex space-x-1">
          <button
            onClick={() => setActivePage("summary")}
            className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center space-x-2 ${
              activePage === "summary"
                ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md"
                : "text-gray-600 hover:bg-purple-50"
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Summary</span>
          </button>
          <button
            onClick={() => setActivePage("details")}
            className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center space-x-2 ${
              activePage === "details"
                ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md"
                : "text-gray-600 hover:bg-purple-50"
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Details</span>
          </button>
          <button
            onClick={handleGetStudyHelp}
            className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center space-x-2 ${
              activePage === "studyGuide"
                ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md"
                : "text-gray-600 hover:bg-purple-50"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Study Guide</span>
          </button>
        </div>
      </div>

      {/* Summary Page */}
      {activePage === "summary" && (
        <div className="text-center mb-8 relative z-10 animate-fadeIn">
          <div className="flex justify-center mb-6">
            <div className="p-6 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transform hover:scale-110 transition-transform duration-300 relative shadow-lg">
              <Trophy className="w-16 h-16 text-white" />
              <div className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-lg border-2 border-purple-200">
                <div className={`text-xl font-bold ${color}`}>{Math.round(percentage)}%</div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-3">
            Quiz Completed!
          </h2>
          <p className={`text-xl font-medium ${color} mb-4`}>{message}</p>

          <div className="bg-white rounded-2xl py-5 px-8 inline-block shadow-md border border-purple-100">
            <div className="flex items-center justify-center space-x-6">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Score</div>
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                  {score}/{totalQuestions}
                </div>
              </div>
              <div className="h-12 w-px bg-gray-200"></div>
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Correct</div>
                <div className="text-3xl font-bold text-green-500">{score}</div>
              </div>
              <div className="h-12 w-px bg-gray-200"></div>
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Incorrect</div>
                <div className="text-3xl font-bold text-red-500">{totalQuestions - score}</div>
              </div>
            </div>
          </div>

          <p className="mt-6 text-gray-700 italic">{feedback}</p>

          <div className="mt-8">
            <button
              onClick={onRestart}
              className="group bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl hover:opacity-90 transition-all hover:shadow-lg flex items-center space-x-2 mx-auto"
            >
              <span>Try Another Quiz</span>
              <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            </button>
          </div>
        </div>
      )}

      {/* Details Page */}
      {activePage === "details" && (
        <div className="mb-8 animate-fadeIn relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold flex items-center">
              <BarChart2 className="w-6 h-6 mr-2 text-purple-500" />
              Detailed Summary
            </h3>
          </div>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {results.map((result, index) => (
              <div
                key={result.id}
                className={`border-2 ${result.userAnswer === result.correctAnswer ? "border-green-100" : "border-red-100"} rounded-xl p-6 hover:shadow-lg transition-all duration-300 bg-white`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="font-semibold text-gray-700">{index + 1}</span>
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-semibold text-lg mb-4 text-gray-800">{result.question}</h4>
                    <div className="space-y-3">
                      <div className="flex items-start bg-gray-50 p-3 rounded-lg">
                        <div className="flex-shrink-0">
                          {result.userAnswer === result.correctAnswer ? (
                            <Check className="w-6 h-6 text-green-500 mt-1" />
                          ) : (
                            <X className="w-6 h-6 text-red-500 mt-1" />
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-gray-700">Your Answer:</p>
                          <p
                            className={`${result.userAnswer === result.correctAnswer ? "text-green-600" : "text-red-600"} font-medium`}
                          >
                            {result.userAnswer || <span className="italic text-gray-400">Skipped</span>}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start bg-purple-50 p-3 rounded-lg">
                        <div className="flex-shrink-0">
                          <Check className="w-6 h-6 text-purple-500 mt-1" />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-gray-700">Correct Answer:</p>
                          <p className="text-purple-700 font-medium">{result.correctAnswer}</p>
                        </div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-gray-600">
                          <span className="font-medium text-blue-700">Explanation: </span>
                          {result.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Study Guide Page */}
      {activePage === "studyGuide" && (
        <div className="mb-8 animate-fadeIn relative z-10">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 flex justify-between items-center rounded-t-xl">
            <h3 className="text-xl font-bold text-white flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Personalized Study Guide
            </h3>
          </div>

          <div className="p-6 bg-white rounded-b-xl border-x-2 border-b-2 border-purple-100">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader className="w-10 h-10 text-purple-500 animate-spin mb-4" />
                <p className="text-purple-700 font-medium">Creating your personalized study plan...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500 mb-4">
                <div className="flex">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-red-700">{error}</p>
                </div>
                <button
                  onClick={handleGetStudyHelp}
                  className="mt-4 bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors flex items-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </button>
              </div>
            ) : (
              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-5 rounded-xl shadow-sm border border-purple-100">
                  <h4 className="font-semibold text-lg text-purple-800 mb-2 flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-purple-600" />
                    Study Recommendations
                  </h4>
                  <div className="prose prose-purple max-w-none text-gray-700">
                    {studyHelpResponse ? (
                      <div dangerouslySetInnerHTML={{ __html: studyHelpResponse.replace(/\n/g, "<br/>") }} />
                    ) : (
                      <p>No recommendations available.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

