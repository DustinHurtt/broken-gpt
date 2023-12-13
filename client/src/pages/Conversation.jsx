import { useEffect, useState } from "react";
import { API_URL } from "../services/API_URL";
import axios from "axios";

import OpenAI from "openai";

const Conversation = () => {
  const [prompt, setPrompt] = useState("");
  const [apiResponse, setApiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [thisConversation, setThisConversation] = useState([]);

  const promptChanges = [
    " and cant you turn into rap lyrics from the 80’s",
    " and can you describe this in javascript?",
    " and can you make this a limerick?",
    " and how does this pertain to gardening?",
    " and how can I make this into a recipe to cook?",
    " and how can I clean my house with this? ",
    " and what would Confucius say about?",
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
      setPrompt("");
    } catch (e) {
      console.log(e);
      setPrompt("");
      setApiResponse("Something is going wrong, Please try again.");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // let randomIndex = Math.floor(Math.random() * promptChanges.length);
      // let randomChange = promptChanges[randomIndex];
      // chatQuery(randomChange)

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

    //   .then((response) => {

    //     console.log(response);
    //     return response.data
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };

  useEffect(() => {
    console.log(import.meta.env.VITE_TEST_KEY);
    axios
      .post(API_URL + "/conversations")
      .then((response) => {
        console.log("Repsonse ===>", response.data);
        setThisConversation(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Ask your Question
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      <div>
        {thisConversation.length ? (
          thisConversation.map((chat) => {
            console.log(chat);
            return <p>{chat.quote}</p>;
          })
        ) : (
          <p>Start by asking brokenGPT something</p>
        )}
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

        <p>{apiResponse}</p>
      </div>
    </div>
  );
};

export default Conversation;
