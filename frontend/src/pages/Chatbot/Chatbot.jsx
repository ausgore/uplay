import { Fab } from "@mui/material";
import Logo from "../../assets/images/uplay_logo.png";
import { useEffect, useRef, useState } from "react";
import ChatbotConversation from "./ChatbotConversation";

const Chatbot = () => {
  const [isVisible, setIsVisible] = useState(true);
  //   const timerRef = useRef(null);
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);

  const toggleChatbotVisibility = () => {
    setIsChatbotVisible((prev) => !prev);
  };

  

  return (
    <div>
      {isChatbotVisible && <ChatbotConversation/>}
      <div
        className="chatbot-fab-container"
        style={{
          position: "fixed",
          bottom: "65px",
          right: "130px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            backgroundColor: "#EB4710",
            padding: "8px 16px",
            borderRadius: "5px",
            marginRight: "-8px",
            color: "white",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            
          }}
        >
          Chat with PlayBot!
        </span>

        <Fab
          onClick={toggleChatbotVisibility}
          style={{
            position: "fixed",
            bottom: "50px",
            right: "65px",
            width: "65px",
            height: "65px",
            backgroundColor: "white",
            border: "5px solid #EB4710",
            
          }}
        >
          
            <img
              src={Logo}
              alt="Chatbot"
              style={{
                width: "60%",
                height: "60%",
              }}
              className="chatbot-fab-image"
            />
          
        </Fab>
      </div>
    </div>
  );
};
export default Chatbot;
