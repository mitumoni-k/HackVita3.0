import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles, Bot, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface StudyHelpResponse {
  help: string;
}

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;
    
    const userMessage: ChatMessage = { 
      sender: 'user', 
      text: message.trim(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);
    setShowTypingIndicator(true);
    
    try {
      const res = await fetch("http://127.0.0.1:8000/study-help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text })
      });
      const data: StudyHelpResponse = await res.json();
      
      // Simulate a natural typing delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const botMessage: ChatMessage = { 
        sender: 'bot', 
        text: data.help,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error generating study help:", error);
      const errorMessage: ChatMessage = { 
        sender: 'bot', 
        text: "Sorry, I couldn't process your request. Please try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setShowTypingIndicator(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <>
      {/* Floating Button with Flickering Effect and Increased Base Size for Small Screens */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        animate={{ opacity: [1, 0.6, 1] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        className={`
          fixed bottom-4 right-4 sm:bottom-8 sm:right-8
          bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600
          text-white rounded-full p-5 sm:p-5
          shadow-[0_8px_30px_rgb(124,58,237,0.3)]
          hover:shadow-[0_8px_35px_rgb(124,58,237,0.4)]
          hover:scale-105 active:scale-95
          transform transition-all duration-300
          z-50 group
          ${isOpen ? 'rotate-180 hidden sm:flex' : 'flex'}
          items-center justify-center
        `}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6 group-hover:hidden transition-all" />
            <Sparkles className="w-6 h-6 hidden group-hover:block transition-all" />
          </>
        )}
      </motion.button>

      {/* Enhanced Chat Interface */}
      <div className={`
        fixed bottom-0 right-0 sm:bottom-24 sm:right-8
        bg-white rounded-t-2xl sm:rounded-2xl
        shadow-[0_8px_30px_rgba(0,0,0,0.12)]
        flex flex-col w-full sm:w-[400px] h-[85vh] sm:h-[600px]
        transform transition-all duration-300 ease-out
        z-40 overflow-hidden
        ${isOpen 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-4 opacity-0 pointer-events-none'
        }
      `}>
        {/* Enhanced Header */}
        <div className="relative px-4 sm:px-6 py-4 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                <Bot className="w-5 h-5" />
                Study Assistant
              </h3>
              <p className="text-xs sm:text-sm text-purple-100">Your 24/7 learning companion</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="sm:hidden p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Enhanced Messages Container */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 bg-gradient-to-b from-purple-50/30 to-transparent">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full text-gray-400 text-center px-4">
              <div className="transform transition-all hover:scale-105 cursor-default">
                <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-2 rounded-full w-fit mx-auto mb-4">
                  <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <p className="text-sm sm:text-base text-gray-600">
                  Hi there! 👋<br />
                  I'm your study assistant.<br />
                  How can I help you today?
                </p>
              </div>
            </div>
          )}
          
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}
            >
              {msg.sender === 'bot' && (
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`
                group relative
                max-w-[85%] break-words rounded-2xl px-4 py-2
                ${msg.sender === 'user'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-none'
                  : 'bg-white shadow-md text-gray-800 rounded-bl-none'
                }
              `}>
                <p className="text-sm sm:text-base">{msg.text}</p>
                <span className={`
                  absolute -bottom-5 text-[10px]
                  ${msg.sender === 'user' ? 'right-0 text-gray-400' : 'left-0 text-gray-400'}
                `}>
                  {formatTime(msg.timestamp)}
                </span>
              </div>
              {msg.sender === 'user' && (
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
          {showTypingIndicator && (
            <div className="flex justify-start items-end gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white shadow-md rounded-2xl rounded-bl-none px-4 py-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Enhanced Input Area */}
        <div className="p-4 bg-white border-t border-purple-100">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              className="flex-1 px-4 py-2 text-base rounded-full
                border-2 border-purple-100 
                focus:outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-100
                transition-all placeholder-gray-400"
              placeholder="Ask me anything..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !message.trim()}
              className={`
                p-3 rounded-full
                ${message.trim() && !isLoading
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                  : 'bg-gray-100 text-gray-400'
                }
                transition-all duration-200 disabled:cursor-not-allowed
              `}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatWidget;
