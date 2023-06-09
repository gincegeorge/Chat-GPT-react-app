import { useState, useEffect } from "react";
import "./App.css";
import send from "./assets/send.svg";
import user from "./assets/user.png";
import bot from "./assets/bot.png";
import loadingIcon from "./assets/loader.svg";
import axios from "axios";

function App() {
  const [input, setInput] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    document.querySelector(".layout").scrollTop =
      document.querySelector(".layout").scrollHeight;
  }, [posts]);

  const fetchBotResponse = async () => {
    const { data } = await axios.post(
      "https://chat-gpt-react-app.onrender.com",
      { input },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return data;
  };

  const autoTypingBotResponse = (text) => {
    let index = 0;
    let interval = setInterval(() => {
      if (index < text.length) {
        setPosts((prevState) => {
          let lastItem = prevState.pop();
          if (lastItem.type !== "bot") {
            prevState.push({
              type: "bot",
              text: text.charAt(index - 1),
            });
          } else {
            prevState.push({
              type: "bot",
              text: lastItem.text + text.charAt(index - 1),
            });
          }
          return [...prevState];
        });
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20);
  };

  const handleSubmit = () => {
    if (input.trim() === "") return;
    updatePosts(input);
    updatePosts("Loading...", false, true);
    setInput("");
    fetchBotResponse().then((res) => {
      console.log(res.bot.trim());
      updatePosts(res.bot.trim(), true);
    });
  };

  const onKeyUP = (e) => {
    if (e.key === "Enter" || e.which === 13) {
      handleSubmit();
    }
  };

  const updatePosts = (post, isBot, isLoading) => {
    if (isBot) {
      autoTypingBotResponse(post);
    } else {
      setPosts((prevState) => {
        return [
          ...prevState,
          { type: isLoading ? "loading" : "user", text: post },
        ];
      });
    }
  };

  return (
    <main className="chatGPT-app">
      <section className="chat-container">
        <div className="layout">
          {posts.map((post, index) => {
            return (
              <div
                key={index}
                className={`chat-bubble ${
                  post.type === "bot" || post.type === "loading" ? "bot" : ""
                }`}
              >
                <div className="avatar">
                  <img
                    src={
                      post.type === "bot" || post.type === "loading"
                        ? bot
                        : user
                    }
                  />
                </div>
                {post.type === "loading" ? (
                  <div className="loader">
                    <img src={loadingIcon} />
                  </div>
                ) : (
                  <div key={index} className="post">
                    {post?.text}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
      <footer>
        <input
          className="composebar"
          autoFocus
          type="text"
          placeholder="Ask anything!"
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={onKeyUP}
          value={input}
        />
        <div className="send-button" onClick={handleSubmit}>
          <img src={send} />
        </div>
      </footer>
    </main>
  );
}

export default App;
