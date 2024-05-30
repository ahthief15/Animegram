
import { Link} from 'react-router-dom'


const NavBar = ({isLoggedIn,handleLogin}) => { 

 

    const handleLogout = () => {
        localStorage.removeItem('jwt')
        handleLogin()
   
        
    }
    
    const Loginlinks = () => {
      return(
      <div> 
        <li><Link to="/search">Search</Link></li> 
        <li><Link to="/create">Post</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link onClick={handleLogout} to="/signin">Log Out</Link></li>
      </div>
      )
    }

    const Defaultlinks = () => {
      return (
      <div>
        <li><Link to="/signin">Sign In</Link></li>
        <li><Link to="/signup">Sign Up</Link></li>  
      </div>
      )
    }


    return(
        <nav>
        <div className="nav-wrapper black">
          <Link to="/" className="brand-logo left">AnimePost</Link>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            {isLoggedIn? <Loginlinks />: <Defaultlinks /> }
          </ul>
        </div>
      </nav>               
    )
}
export default NavBar