import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import M from 'materialize-css';

const UserProfilePage = ({ currentUser }) => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('jwt');
        if (!token) {
          throw new Error('No token found');
        }

        const userResponse = await fetch(`/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!userResponse.ok) {
          throw new Error('Network response was not ok');
        }

        const userData = await userResponse.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('jwt');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch(`/user/${userId}/posts`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const postData = await response.json();
        setPosts(postData);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchUser();
    fetchPosts();
  },[userId,currentUser]);

  useEffect(() => {
    M.AutoInit();
  }, []);

  const handleFollowToggle = async () => {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch('/toggleFollow', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: user._id })
      });

      if (!response.ok) {
        throw new Error('Failed to toggle follow status');
      }

      const updatedResponse = await response.json();
      setUser(updatedResponse.followUser);
      M.toast({ html: `You have ${updatedResponse.followUser.followers.includes(currentUser._id)? 'Followed' : 'Unfollowed'} ${user.name}`, classes: 'green' });
    } catch (error) {
      console.error('Error toggling follow status:', error);
      M.toast({ html: 'Failed to toggle follow status', classes: 'red' });
    }
  };

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1>User Profile</h1>
      <div className="row">
        <div className="col s12 m4">
          <Link to={`/user/${user._id}`}>
            <img
              src={user.profilePicture || 'https://via.placeholder.com/160'}
              alt={user.name}
              style={{ width: '160px', height: '160px', borderRadius: '80px' }}
            />
            <h4>{user.name}</h4>
          </Link>
          <button className="btn" onClick={handleFollowToggle}>
            {user.followers.includes(currentUser._id) ? 'Unfollow' : 'Follow'}
          </button>
        </div>
        <div className="col s12 m8">
          <h4>Posts</h4>
          <div className="gallery">
            {posts.map(post => (
              <img
                className="item"
                key={post._id}
                src={post.photo}
                alt={post.title}
                onClick={() => handlePostClick(post._id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
