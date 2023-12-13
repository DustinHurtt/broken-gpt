import { useState, useEffect} from 'react'
import { useAsyncError, useParams } from 'react-router-dom'
import { API_URL } from '../services/API_URL'
import axios from 'axios'
import OpenAI from "openai";

const ConversationDetails = () => {
    const [conversation, setConversation] = useState(null)
    // const [isEditing, setIsEditing] = useState(false)
    const [newQuery, setNewQuery] = useState('')

    const { conversationId } = useParams()

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

      const updateQuery = (queryId) => {

      }
    
      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_KEY,
        dangerouslyAllowBrowser: true,
      });
    
      const chatQuery = async (change, queryId) => {
        console.log("Random change ===>", change);
        // setLoading(true);
        try {
          const result = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: newQuery + change }],
          });
          console.log("response", result.choices[0].message.content);

    
          let thisIndex
          let thisQuery = conversation.queries.find((query, index) => {
              thisIndex = index
              return query.id === queryId
          })
          setTimeout(() => {
            // setLoading(false);

            let newQueries = [...conversation.queries]
            newQueries[thisIndex] = {...thisQuery, ['question']: newQuery, ['response']: result.choices[0].message.content, ['isEditing']: false}
            setConversation((prev) => ({...prev, ['queries']: newQueries}))
            
          }, 1500);
        //   console.log("Convo id", convoId);
          axios.put(API_URL + "/queries" + `/${queryId}`, {
            ...thisQuery,
            question: newQuery,
            response: result.choices[0].message.content,
          })
          .then((response) => {
            console.log(response.data)
            setNewQuery("");
          })
          .catch((err) => {
            console.log("Put ===>", err)
          })
        } catch (e) {
          console.log("This is error", e);
        //   setPrompt("");
        //   setApiResponse("Something is going wrong, Please try again.");
        }
        // setLoading(false);
      };

      const getQuote = async () => {
        // setLoading(true);
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

      const getQuoteSubmit = async (queryId) => {
        try {

        const gptResponse = await getQuote();
        let thisIndex
        let thisQuery = conversation.queries.find((query, index) => {
            thisIndex = index
            return query.id === queryId
        })
          setTimeout(() => {
            // setLoading(false);

            let newQueries = [...conversation.queries]
            newQueries[thisIndex] = {...prev, ['question']: newQuery, ['response']: gptResponse[0].quote, ['isEditing']: false}
            setConversation((prev) => ({...prev, ['queries']: newQueries}))
            
          }, 1500);
    
        //   console.log("Convo id", convoId);
    
          axios.put(API_URL + "/queries" + `/${queryId}`, {
            ...thisQuery,
            question: newQuery,
            response: gptResponse[0].quote,
          })
          .then((response) => {
            console.log(response.data)
            setNewQuery("");
          })
          .catch((err) => {
            console.log("Put ===>", err)
          })
    

        } catch (error) {
          console.log(error);
        }
      };
    

    
      const handleSubmit = async (e, queryId) => {
        e.preventDefault();
        if (Math.random() > 0.79) {
          getQuoteSubmit(queryId);
        } else {
          let change =
            promptChanges[Math.floor(Math.random() * promptChanges.length)];
          chatQuery(change, queryId);
        }
      };
    
      const handlePrompt = (e) => {
        let str = e.target.value.replace(/[?=]/g, "");
        console.log(e.target.value.replace(/[?=]/g, ""));
        setNewQuery(str);
      };

    const deleteQuery = (id) => {
        let newQueries = [...conversation.queries].filter((query) => query.id !== id)
        console.log("These are queries", newQueries)
        setConversation((prev) => ({...prev, ['queries']: newQueries}))
        axios.delete(API_URL + `/queries/${id}`)
            .then((response) => {
                console.log("Deletion response ===>", response.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const toggleEditing = (queryId) => {
        let thisIndex
        let thisQuery = conversation.queries.find((query, index) => {
            thisIndex = index
            return query.id === queryId
        })
        let newArray = [...conversation.queries]
        newArray[thisIndex] = {...thisQuery, ['isEditing']: true}
        setConversation((prev) => ({...prev, ['queries']: newArray}))
    }

    useEffect(() => {

        axios.get(API_URL + `/conversations/${conversationId}?_embed=queries`)
            .then((response) => {
                console.log(response.data)
                let newQueries =  [...response.data.queries].map((element) => {
                    return {...element, isEditing: false}
                })

                let newObject = {...response.data, ["queries"]: newQueries}

                
                setConversation(newObject)
            })
            .catch((err) => {
                console.log(err)
            })

    }, [])

  return (
    <div>
        {conversation &&
        
        <>
            <h1>Conversation Details for Conversation that occured on {conversation.date} </h1>

            {
                conversation.queries.length > 0 &&

                conversation.queries.map((query) => {
                    return (
                        <div>
                            <p>{query.question}</p>
                            <p>{query.response}</p>
                            <button onClick={() => deleteQuery(query.id)}>Delete this query</button>
                            <button onClick={() => toggleEditing(query.id)}>Edit Query</button>

                            {query.isEditing && 
                                <form onSubmit={(e) => handleSubmit(e, query.id)}>
                                    <label>
                                         New Query for: {query.question}
                                        <input value={newQuery} onChange={(e) => handlePrompt(e)} />
                                    </label>

                                    <button type='submit'>Change Query</button>
                                </form>

                            }

                        </div>
                    )
                })
            }

        </>
        
        }
    </div>
  )
}

export default ConversationDetails