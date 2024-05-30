import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SearchPage = (props) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const currentUser = props.currentUser; 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/users');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const userData = await response.json();
        setUsers(userData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter((user) => {
    return user?._id !== currentUser?._id && user.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="container">
      <h1>Search Page</h1>
      <div className="input-field">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <ul className="collection">
        {filteredUsers.map((user) => (
          <li key={user._id} className="collection-item avatar N/A transparent">
            <Link to={`/user/${user._id}`} >
              <img src={user.profilePicture} alt={user.name} className="circle" />
              <span className="title">{user.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchPage;

