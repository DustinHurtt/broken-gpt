import { API_URL } from "../services/API_URL";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export const AllConversations = () => {
  const [conversations, setConverations] = useState([]);

  useEffect(() => {
    axios
      .get(API_URL + "/conversations?_embed=queries")
      .then((response) => {
        console.log(response.data);
        setConverations(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <h1> All Conversation </h1>
      {conversations.map((conversation) => {
        return (
          <Link to={`/conversation-details/${conversation.id}`} key={conversation.id}>
            <h2>{conversation.date}</h2>
          </Link>
        );
      })}
    </div>
  );
};
