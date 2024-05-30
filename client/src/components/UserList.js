import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const UserList = ({ title, filterFn }) => {
    const [users, setUsers] = useState([]);

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

    const filteredUsers = users.filter(filterFn);

    return (
        <div className="container">
            <h1 style={{textAlign:'center'}}>{title}</h1>
            {users.length > 0 && ( 
           <ul className="collection" style={{width:'450px',margin:'0 auto 0 auto'}}>
          {filteredUsers.map((user) => (
            <li key={user?._id} className="collection-item avatar N/A transparent">
              <Link to={`/user/${user?._id}`}>
                <img src={user?.profilePicture} alt={user?.name} className="circle" />
                <span className="title">{user?.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
        </div>
    );
};

export default UserList;
