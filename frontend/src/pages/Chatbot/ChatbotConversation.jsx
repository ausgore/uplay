import Logo from "../../assets/images/uplay_logo.png";
import "./ChatbotConversation.css";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

const ChatbotConversation = () => {
  const [prompts, setPrompts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showDelayedText, setShowDelayedText] = useState(false);
  const chatboxRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom whenever content changes
    chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
  }, [prompts, selectedCategory, selectedQuestion, selectedAnswer]);

  useEffect(() => {
    (async () => {
      const response = await axios.get("http://localhost:5021/ChatbotPrompt");
      setPrompts(response.data);
    })();
  }, []);

  useEffect(() => {
    // Clear the timeout whenever the component re-renders
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);
  
  const uniqueCategories = new Set();

  const generateIncomingMessage = (message) => (
    <li className="chat incoming">
      <span>
        <img src={Logo} alt="uplay" />
      </span>
      <p>{message}</p>
    </li>
  );

  const generateOutgoingMessage = (message) => (
    <li className="chat outgoing">
      <p>{message}</p>
    </li>
  );

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    timeoutRef.current = setTimeout(() => {
        setShowDelayedText(true);
      }, 1000);
  };

  const handleQuestionClick = (question, answer) => {
    setSelectedQuestion(question);
    setSelectedAnswer(answer);
    timeoutRef.current = setTimeout(() => {
        setShowDelayedText(true);
      }, 1000);
  };

  return (
    <div className="chatbot">
      <header>
        <h2>
          PlayBot
          {/* <span onClick={() => closeChatbot}>&times;</span> */}
        </h2>
      </header>
      <ul className="chatbox" ref={chatboxRef}>
        {generateIncomingMessage(
          "Hi there! I'm PlayBot, your U-Play virtual assistant! How can I help you today?"
        )}
        <li>
          {prompts?.map((prompt, index) => {
            if (!uniqueCategories.has(prompt.category)) {
              uniqueCategories.add(prompt.category);
              return (
                <p
                  key={index}
                  className={`category ${
                    selectedCategory === prompt.category ? "selected" : ""
                  }`}
                  onClick={() => handleCategoryClick(prompt.category)}
                >
                  {prompt.category}
                </p>
              );
            }
            return null;
          })}
        </li>
        {selectedCategory && (
          <>
            {generateOutgoingMessage(selectedCategory)}
            {showDelayedText && (
              <>
                {generateIncomingMessage(
                  `Here's some information under ${selectedCategory}.`
                )}
                <li>
                  {prompts
                    ?.filter((prompt) => prompt.category === selectedCategory)
                    .map((prompt, index) => (
                      <p
                        key={index}
                        className={`question ${
                          selectedQuestion === prompt.question ? "selected" : ""
                        }`}
                        onClick={() =>
                          handleQuestionClick(prompt.question, prompt.answer)
                        }
                      >
                        {prompt.question}
                      </p>
                    ))}
                </li>
              </>
            )}
          </>
        )}
        {selectedQuestion && (
          <>
            {generateOutgoingMessage(selectedQuestion)}
            {showDelayedText && generateIncomingMessage(selectedAnswer)}
          </>
        )}
      </ul>
    </div>
  );
};

export default ChatbotConversation;
