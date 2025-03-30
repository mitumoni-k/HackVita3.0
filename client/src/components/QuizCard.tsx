"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle, XCircle, Clock, ArrowRight, SkipForward } from "lucide-react"

interface QuizCardProps {
  question: ParsedQuestion
  selectedAnswer: string | null | undefined;
  timeRemaining: number
  onAnswerSelect: (answer: string) => void
  showFeedback: boolean
  onNext: () => void
  onSkip: () => void
}

interface ParsedQuestion {
  question: string
  code?: string
  options: string[]
  correctAnswer: string
}

const QUESTION_TIMER = 30

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  selectedAnswer,
  timeRemaining,
  onAnswerSelect,
  showFeedback,
  onNext,
  onSkip,
}) => {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setAnimate(true)
  }, [question])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full mx-auto"
    >
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">{question.question}</h3>

        {question.code && (
          <pre className="bg-gray-100 p-4 rounded-lg mb-4 overflow-x-auto">
            <code className="text-sm">{question.code}</code>
          </pre>
        )}

        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === option
            const isCorrect = showFeedback && option === question.correctAnswer
            const isWrong = showFeedback && isSelected && option !== question.correctAnswer

            return (
              <motion.button
                key={index}
                onClick={() => !showFeedback && onAnswerSelect(option)}
                disabled={showFeedback}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full text-left p-4 rounded-xl transition-all ${
                  isSelected
                    ? "bg-violet-100 border-2 border-violet-500"
                    : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                } ${
                  isCorrect
                    ? "bg-green-100 border-2 border-green-500"
                    : isWrong
                      ? "bg-red-100 border-2 border-red-500"
                      : ""
                }`}
              >
                <div className="flex items-center">
                  <span className="flex-grow">{option}</span>
                  {isCorrect && <CheckCircle className="text-green-500 ml-2" />}
                  {isWrong && <XCircle className="text-red-500 ml-2" />}
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Timer Bar */}
      <div className="mt-6">
        <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            Time Remaining
          </span>
          <span>{timeRemaining}s</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <motion.div
            className="h-full bg-violet-500 rounded-full"
            initial={{ width: "100%" }}
            animate={{ width: `${(timeRemaining / QUESTION_TIMER) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Skip / Next Button */}
      <div className="mt-6 flex justify-end">
        {selectedAnswer ? (
          <motion.button
            onClick={onNext}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition flex items-center"
          >
            Next <ArrowRight className="ml-2 w-4 h-4" />
          </motion.button>
        ) : (
          <motion.button
            onClick={onSkip}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition flex items-center"
          >
            Skip <SkipForward className="ml-2 w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

