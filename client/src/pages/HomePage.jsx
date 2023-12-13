import { Link } from "react-router-dom"

const HomePage = () => {
  return (
    <div>
        <h1>Welcome to ChatGPT 5.0, the bestest!</h1>
        <Link to='/new-conversation'>
            <button>Start a new Conversation</button>
        </Link>
    </div>
  )
}

export default HomePage