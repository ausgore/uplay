import Logo from "../../assets/images/uplay_logo.png";
import "./ChatbotConversation.css";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

const ChatbotConversation = ({ closeChatbot }) => {
    const [prompts, setPrompts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showDelayedMsg, setShowDelayedMsg] = useState(false);
    const chatboxRef = useRef(null);

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
    };

    const handleQuestionClick = (question, answer) => {
      setSelectedQuestion(question);
      setSelectedAnswer(answer);
    };

    const [userFeedback, setUserFeedback] = useState(null);
    const [message, setMessage] = useState(
      "Hi there! I'm PlayBot, your U-Play virtual assistant! How can I help you today?"
    );

    const handleUserFeedback = (feedback) => {
      setUserFeedback(feedback);
    };

    const resetConversation = () => {
      setSelectedCategory(null);
      setSelectedQuestion(null);
      setUserFeedback(null);
    };

    const renderUserFeedbackOptions = () => {
      if (userFeedback === "Yes") {
        setMessage(
          "Glad to hear that! If you have more questions, feel free to ask."
        );
        resetConversation();
      } else if (userFeedback === "No") {
        resetConversation();
        setMessage(
          "Sorry to hear that. If you have more questions, feel free to ask."
        );
        return renderCategoryOptions();
      }
      return (
        showDelayedMsg && (
          <>
            {generateIncomingMessage(
              "Did you find the answer you were looking for?"
            )}
            <p className="feedback" onClick={() => handleUserFeedback("Yes")}>
              Yes
            </p>
            <p className="feedback" onClick={() => handleUserFeedback("No")}>
              No
            </p>
          </>
        )
      );
    };

    const renderCategoryOptions = () => {
      if (userFeedback === null) {
        const uniqueCategories = new Set();

        return (
          <>
            {generateIncomingMessage("Please choose a category:")}
            <li>
              {prompts?.map((prompt, index) => {
                if (!uniqueCategories.has(prompt.category)) {
                  uniqueCategories.add(prompt.category);
                  return (
                    <p
                      key={index}
                      className={`category`}
                      onClick={() => handleCategoryClick(prompt.category)}
                    >
                      {prompt.category}
                    </p>
                  );
                }
                return null;
              })}
            </li>
          </>
        );
      }
      return null;
    };

    const renderQuestionOptions = () => {
      if (selectedCategory && userFeedback === null) {
        return (
          <>
            {generateOutgoingMessage(selectedCategory)}
            {generateIncomingMessage(
              `Here's some information under ${selectedCategory}. Please choose a question:`
            )}
            <li>
              {prompts
                ?.filter((prompt) => prompt.category === selectedCategory)
                .map((prompt, index) => (
                  <p
                    key={index}
                    className={`question`}
                    onClick={() =>
                      handleQuestionClick(prompt.question, prompt.answer)
                    }
                  >
                    {prompt.question}
                  </p>
                ))}
            </li>
          </>
        );
      }
      return null;
    };

    const renderAnswer = () => {
     
      setTimeout(() => {
        setShowDelayedMsg(true);
      }, 4000);
      if (selectedQuestion && userFeedback === null) {
        return (
          <>
            {generateOutgoingMessage(selectedQuestion)}
            {generateIncomingMessage(selectedAnswer)}
            {renderUserFeedbackOptions()}
          </>
        );
      }
      return null;
    };

    const handleCloseChatbot = () => {
      closeChatbot();
    };

    return (
      <div className="chatbot">
        <header>
          <h2>
            PlayBot<span onClick={handleCloseChatbot}>×</span>
          </h2>
        </header>
        <ul className="chatbox" ref={chatboxRef}>
          {userFeedback === null && (
            <>
              {generateIncomingMessage(message)}
              {renderCategoryOptions()}
              {renderQuestionOptions()}
              {renderAnswer()}
            </>
          )}

          {userFeedback !== null && renderUserFeedbackOptions()}
        </ul>
      </div>
    );
};

export default ChatbotConversation;
