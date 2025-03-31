import React, { useEffect, useState } from "react";
import { collection, getDocs, DocumentData } from "firebase/firestore";
import { db } from "../Firebase/firebase"; // Adjust the path to your firebase.js or firebase.ts file

// Define an interface for your Firestore quiz document fields
interface QuizData {
  Date?: any; // Firestore Timestamp or string
  Difficulty?: string;
  Insights?: string;
  Score?: number;
  Subject?: string;
}

// Helper component to truncate long text and toggle full view
interface TruncatedTextProps {
  text: string;
  maxChars?: number;
}

const TruncatedText: React.FC<TruncatedTextProps> = ({ text, maxChars = 150 }) => {
  const [expanded, setExpanded] = useState(false);

  if (text.length <= maxChars) {
    return <span>{text}</span>;
  }

  return (
    <div>
      {expanded ? text : text.substring(0, maxChars) + "..."}
      <button
        onClick={() => setExpanded(!expanded)}
        className="ml-2 text-blue-500 underline text-sm"
      >
        {expanded ? "Read Less" : "Read More"}
      </button>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [quizItems, setQuizItems] = useState<QuizData[]>([]);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        // Reference the "quiz" collection in Firestore
        const quizCollectionRef = collection(db, "quiz");
        const querySnapshot = await getDocs(quizCollectionRef);
        // Map over each document and extract the data fields only
        const data = querySnapshot.docs.map((doc: DocumentData) => doc.data() as QuizData);
        setQuizItems(data);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };

    fetchQuizData();
  }, []);

  // Helper function to format the Date field
  const formatDate = (dateValue: any): string => {
    // Check if the dateValue is a Firestore Timestamp object
    if (dateValue && typeof dateValue === "object" && "seconds" in dateValue) {
      return new Date(dateValue.seconds * 1000).toLocaleString();
    }
    return dateValue || "N/A";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-700">
          Dashboard
        </h1>
        <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-purple-400 to-purple-600">
            <h2 className="text-2xl font-semibold text-white">Quiz Results</h2>
          </div>
          <div className="p-4 overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-purple-400 to-purple-600 text-white">
                  <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Difficulty</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Insights</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Score</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Subject</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-200">
                {quizItems.map((item, index) => (
                  <tr key={index} className="hover:bg-purple-100 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-800">
                      {formatDate(item.Date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-800">
                      {item.Difficulty || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-normal text-sm text-purple-800">
                      {item.Insights ? <TruncatedText text={item.Insights} /> : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-800 font-bold">
                      {item.Score !== undefined ? item.Score : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-800">
                      {item.Subject || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
