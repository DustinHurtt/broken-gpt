import { useEffect, useState } from "react";
import { API_URL } from "../services/API_URL";
import { returnReadableTimeShort } from "../services/time";
import axios from "axios";

import OpenAI from "openai";

const Conversation = () => {
  const [prompt, setPrompt] = useState("");
  const [apiResponse, setApiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [thisConversation, setThisConversation] = useState([]);
  const [convoId, setConvoId] = useState(null);

  const promptChanges = [
    " and can you turn into rap lyrics from the 80’s",
    " and can you describe this in javascript?",
    " and can you make this a limerick?",
    " and how does this pertain to gardening?",
    " and how can I make this into a recipe to cook?",
    " and how can I clean my house with this? ",
    " and what would Confucius say about it?",
    " and is there a mysterious a prophecy regarding this?",
    " and how should I should I properly eat pizza?",
    " and make this answer a list?",
    " and please respond in a passive aggressive answer tone.",
  ];

  const quoteCategories = ["inspirational", "jealousy", "marriage", "anger"];

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_KEY,
    dangerouslyAllowBrowser: true,
  });

  const chatQuery = async (change) => {
    console.log("Random change ===>", change);
    setLoading(true);
    try {
      const result = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt + change }],
      });
      console.log("response", result.choices[0].message.content);
      setApiResponse(result.choices[0].message.content);

      setThisConversation([
        ...thisConversation,
        { quote: prompt, author: "me" },
      ]);

      setTimeout(() => {
        setLoading(false);
        setThisConversation([
          ...thisConversation,
          { quote: prompt, author: "me" },
          {
            quote: result.choices[0].message.content,
            author: "gpt",
          },
        ]);
      }, 1500);
      console.log("Convo id", convoId);
      axios.post(API_URL + "/queries", {
        conversationId: convoId.id,
        question: prompt,
        response: result.choices[0].message.content,
      });
      setPrompt("");
    } catch (e) {
      console.log("This is error", e);
      setPrompt("");
      setApiResponse("Something is going wrong, Please try again.");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Math.random() > 0.79) {
      getQuoteSubmit();
    } else {
      let change =
        promptChanges[Math.floor(Math.random() * promptChanges.length)];
      chatQuery(change);
    }
  };

  const getQuoteSubmit = async () => {
    try {
      setThisConversation([
        ...thisConversation,
        { quote: prompt, author: "me" },
      ]);

      const gptResponse = await getQuote();
      console.log(gptResponse);
      setTimeout(() => {
        setLoading(false);
        setThisConversation([
          ...thisConversation,
          { quote: prompt, author: "me" },
          gptResponse[0],
        ]);
      }, 1500);

      console.log("Convo id", convoId);

      axios.post(API_URL + "/queries", {
        conversationId: convoId.id,
        question: prompt,
        response: gptResponse[0].quote,
      });

      setPrompt("");
    } catch (error) {
      console.log(error);
    }
  };

  const getQuote = async () => {
    setLoading(true);
    let randomIndex = Math.floor(Math.random() * quoteCategories.length);
    let category = quoteCategories[randomIndex];
    console.log("This is category ===>", quoteCategories[randomIndex]);
    try {
      const response = await axios.get(
        "https://api.api-ninjas.com/v1/quotes?category=" + category,
        {
          headers: { "X-Api-Key": import.meta.env.VITE_NINJA_KEY },
        }
      );

      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const handlePrompt = (e) => {
    let str = e.target.value.replace(/[?=]/g, "");
    console.log(e.target.value.replace(/[?=]/g, ""));
    setPrompt(str);
  };

  useEffect(() => {
    console.log(import.meta.env.VITE_TEST_KEY);
    let timestamp = Date.now();
    let date = new Date(timestamp);

    axios
      .post(API_URL + "/conversations", {
        date: returnReadableTimeShort(date.toISOString())
      })
      .then((response) => {
        console.log("Repsonse ===>", response.data);
        setConvoId(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="convo-page">
      <div className="chat">
        {thisConversation.length ? (
          thisConversation.map((chat) => {
            console.log(chat);
            return (
              <p
                className={
                  chat.author === "me" ? "right chat-box" : "left chat-box"
                }
              >
                {chat.quote}
              </p>
            );
          })
        ) : (
          <p>Start by asking ChatGPT 5.0, the bestest, a question...</p>
        )}
      </div>
      <form className="form" onSubmit={handleSubmit}>
        {loading && (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="4" cy="12" r="3">
              <animate
                id="spinner_jObz"
                begin="0;spinner_vwSQ.end-0.25s"
                attributeName="r"
                dur="0.75s"
                values="3;.2;3"
              />
            </circle>
            <circle cx="12" cy="12" r="3">
              <animate
                begin="spinner_jObz.end-0.6s"
                attributeName="r"
                dur="0.75s"
                values="3;.2;3"
              />
            </circle>
            <circle cx="20" cy="12" r="3">
              <animate
                id="spinner_vwSQ"
                begin="spinner_jObz.end-0.45s"
                attributeName="r"
                dur="0.75s"
                values="3;.2;3"
              />
            </circle>
          </svg>
        )}
        <label>
          Ask your Question
          <input
            className="message-input"
            type="text"
            value={prompt}
            onChange={handlePrompt}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Conversation;
