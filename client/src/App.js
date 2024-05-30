import { useState, useEffect } from 'react';
import logo from './logo.svg';
import NavBar from './components/Navbar';
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/screens/Home';
import Signin from './components/screens/SIgnIn';
import Signup from './components/screens/Signup';
import Profile from './components/screens/Profile';
import CreatePost from './components/screens/CreatePost';
import SearchPage from './components/screens/SearchPage';
import UserProfilePage from './components/screens/UserProfile';
import Post from './components/screens/Post';
import FollowerList from './components/screens/FollowerList';
import FollowingList from './components/screens/FollowingList';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('jwt') !== null);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = () => {
    setIsLoggedIn(localStorage.getItem('jwt') !== null);
    fetchCurrentUser(); 
  }

  useEffect(() => {
    if (isLoggedIn) {
      fetchCurrentUser();
    }
  }, [isLoggedIn]);

  const fetchCurrentUser = async () => {
        try {
            const token = localStorage.getItem('jwt');
            const response = await fetch('/currentuser', {
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCurrentUser(data.user);
        } catch (error) {
            console.error('Error fetching current user:', error);
        }
  };

  return (
    <BrowserRouter>
      <NavBar isLoggedIn={isLoggedIn} handleLogin={handleLogin} />
      <Routes>
        <Route path="/" element={<Home  currentUser={currentUser} />} />
        <Route path="/signin" element={<Signin handleLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/search" element={<SearchPage currentUser={currentUser}/>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/user/:userId" element={<UserProfilePage currentUser={currentUser} />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/post/:postId" element={<Post currentUser={currentUser}/>} />
        <Route path="/followers" element={<FollowerList currentUser={currentUser} />} />
        <Route path="/following" element={<FollowingList currentUser={currentUser} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
