"use client"
import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"

interface ProgressBarProps {
  current: number
  total: number
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = (current / total) * 100

  return (
    <div className="w-full flex justify-center items-center mb-8">
      <motion.div
        className="w-full max-w-2xl bg-white p-3 rounded-xl shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
          <span className="font-semibold text-base text-gray-800">
            Question {current + 1} of {total}
          </span>
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-violet-600 mr-2" />
            <span className="font-semibold text-base text-gray-800">{Math.round(progress)}% Complete</span>
          </div>
        </div>
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-500 to-violet-700 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </div>
  )
}

