// services/api.ts

export interface ParsedQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    code?: string;
  }
  
  function parseQuestions(rawText: string): ParsedQuestion[] {
    try {
      if (!rawText || typeof rawText !== "string") {
        console.error("Invalid input to parseQuestions:", rawText);
        return [];
      }
      // Split questions based on double line breaks (assuming each question is separated properly)
      const questionBlocks = rawText.trim().split(/\n\n\n+/);
  
      return questionBlocks.map((block, index) => {
        const lines = block.split('\n');
        let question = '';
        let code = '';
        const options: string[] = [];
        let correctAnswer = '';
        let inCodeBlock = false;
  
        lines.forEach(line => {
          const trimmedLine = line.trim();
  
          // Extract question using regex to match the pattern **1. ...**
          const questionMatch = trimmedLine.match(/\*\*\d+\.\s*(.*?)\*\*/);
          if (questionMatch) {
            question = questionMatch[1].trim();
            return;
          }
  
          // Handle start of a code block if "python" is mentioned
          if (trimmedLine.includes('python')) {
            inCodeBlock = true;
            return;
          }
  
          // Handle code block content
          if (inCodeBlock) {
            if (trimmedLine === '```') {
              inCodeBlock = false; // End of code block
            } else {
              code += trimmedLine + '\n';
            }
            return;
          }
  
          // Extract options (lines starting with a), b), c), or d))
          const optionMatch = trimmedLine.match(/^([a-d])\)\s*(.*)/);
          if (optionMatch) {
            options.push(trimmedLine);
            return;
          }
  
          // Extract correct answer
          const answerMatch = trimmedLine.match(/\*\*Correct Answer:\s*([a-d]\).*)/);
          if (answerMatch) {
            correctAnswer = answerMatch[1].trim();
          }
        });
  
        return {
          id: `q${index + 1}`,
          question,
          options,
          correctAnswer,
          code: code.trim() || undefined,
        };
      }).filter(q => q.question); // Filter out any empty questions
    } catch (error) {
      console.error('Error parsing questions:', error);
      return [];
    }
  }
  
  export async function fetchQuestions(topic: string, difficulty: string): Promise<ParsedQuestion[]> {
    try {
      const response = await fetch('http://127.0.0.1:8000/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, difficulty }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch questions: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("API Response:", data); // Debugging
  
      // Check if questions is an array or a string
      if (Array.isArray(data.questions)) {
        return data.questions;
      } else if (typeof data.questions === "string") {
        return parseQuestions(data.questions);
      } else {
        throw new Error("Invalid API response: 'questions' field is missing or not a string/array.");
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  }
  
  // For testing/development, you can use this mock data function
  export async function mockFetchQuestions(subject: string, difficulty: string): Promise<ParsedQuestion[]> {
    // This simulates an API call with mock data
    const mockApiResponse = {
      questions: `**1. What will be the output of the following code snippet?**\n\npython\n\`\`\`\ndef my_func(x, y=10):\n    return x + y\n\nprint(my_func(5))\n\`\`\`\n\na) 15\nb) 5\nc) Error\nd) None\n\n**Correct Answer: a) 15**`
    };
  
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return parseQuestions(mockApiResponse.questions);
  }
  