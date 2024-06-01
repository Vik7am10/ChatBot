import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react";

const API_KEY = "sk-proj-mbfOMKmkue1O0xUqZHQOT3BlbkFJaBxAGE9BGnMWtFWwGWz4"

function App() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello, I am ChatGPT",
      sender: "ChatGPT",
      direction: "incoming;"
    }
  ]); // []

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      direction: "outgoing",
      sender: "user"
    };

    const newMessages = [...messages, newMessage];
    // update our messages state
    setMessages(newMessages);

    //set typing indicator
    setTyping(true);
    // process message to chat
    await processMessagetoChatGPT(newMessages);
  }

  async function processMessagetoChatGPT(chatMessages) {
     // chat Messages {sender user or chatgpt , message}
     //apiMessages { role: , content:}
    
     let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if(messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message}
     });


     const systemMessage = {
      role: "system",
      content: "Explain all concepts."
     }

     const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,
        ...apiMessages //
      ]
     }

     await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization" : "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
     }).then((data) => {
      return data.json();
     }).then((data) => {
      console.log(data);
      console.log(data.choices[0].message.content);
      setMessages(
        [...chatMessages, {
          message: data.choices[0].message.content,
          sender: "ChatGPT",
          direction: "incoming"
        }]
      );
      setTyping(false);
     });
  }

  return (
   <div className="App">
    <div style={{ position: "relative", height: "800px", width: "700px"}}>
      <MainContainer>
        <ChatContainer>
          <MessageList
            typingIndicator={typing ? <TypingIndicator content="ChatGPT is typing"/> : null}
          >
            {messages.map((message, i)=> {
              console.log(message)
              return <Message key={i} model={message} />
            })}
          </MessageList>
          <MessageInput placeholder='Type message here' onSend={handleSend}/>
        </ChatContainer>
      </MainContainer>
    </div>

   </div>
  )
}

export default App
