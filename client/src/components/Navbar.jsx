import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <nav>
        <Link to='/'>Home</Link>
        <Link to='/new-conversation'>New Conversation</Link>
        <Link to='/all-conversations'>All Conversations</Link>
    </nav>
  )
}

export default Navbar