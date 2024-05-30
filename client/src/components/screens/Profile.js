import React, { useState, useEffect } from 'react';
import M from 'materialize-css';
import { useNavigate,Link } from 'react-router-dom';

const Profile = () => {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState({});
    const [profilePicture, setProfilePicture] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const token = localStorage.getItem('jwt');
                if (!token) {
                    return;
                }

                const response = await fetch('/myposts', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const userData = await response.json();
                setPosts(userData.mypost);
                setUser(userData.user);
            } catch (error) {
                console.error('Error fetching user posts:', error);
            }
        };

        fetchUserPosts();
        M.Modal.init(document.querySelectorAll('.modal'));
    }, []);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setProfilePicture(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handlePostClick = (postId) => {
        navigate(`/post/${postId}`);
    };

    const handleImageUpload = async () => {
        if (!profilePicture) return;

        try {
            const data = new FormData();
            data.append("file", profilePicture);
            data.append("upload_preset", "insta-clone");
            data.append("cloud_name", "dbvllujxg");

            const response = await fetch("https://api.cloudinary.com/v1_1/dbvllujxg/image/upload", {
                method: 'POST',
                body: data
            });

            if (!response.ok) {
                throw new Error('Cloudinary upload failed');
            }

            const responseUrl = await response.json();
            const url = responseUrl.url;
            const token = localStorage.getItem('jwt');
            const backendResponse = await fetch('/uploadProfilePicture', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ profilePicture: url })
            });

            if (!backendResponse.ok) {
                throw new Error('Backend upload failed');
            }

            const updatedUser = await backendResponse.json();
            setUser(updatedUser);

            M.toast({ html: 'Profile picture uploaded successfully', classes: 'green' });
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            M.toast({ html: 'Failed to upload profile picture', classes: 'red' });
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0px auto' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                margin: '30px 0px 50px',
                borderBottom: '1px solid gray'
            }}>
                <div>
                    <img style={{ width: "160px", height: "160px", borderRadius: "80px",marginLeft:'25px' }}
                        src={user.profilePicture || 'https://via.placeholder.com/160'} alt="Profile" />
                    <button className="btn modal-trigger btn waves-effect waves-light #6a1b9a purple darken-3" data-target="modal1" style={{marginBottom:'20px',marginTop:'20px'}}>Update Profile Picture</button>
                </div>
                <div>
                    <h4 style={{marginTop:'60px',fontFamily:'Franklin'}}>{user.name}</h4>
                    <h5 style={{marginTop:'10px',fontFamily:'Franklin'}}>{user.email}</h5>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '108%' ,gap:'45px',marginTop:'20px'}}>
                        <Link><h5>{posts.length} {posts.length === 1 ? 'post' : 'posts'}</h5></Link>
                        <Link to='/followers'><h5>{user.followers?.length || 0} {user.followers?.length === 1 ? 'follower' : 'followers'}</h5></Link>
                        <Link to='/following'><h5>{user.following?.length || 0} Following</h5></Link>
                    </div>
                </div>
            </div>
            <div className='gallery'>
                {posts.map(post => (
                    <img className="item" key={post._id} src={post.photo} alt={post.title} onClick={() => handlePostClick(post._id)} />
                ))}
            </div>

            <div id="modal1" className="modal">
                <div className="modal-content">
                    <h4>Change Profile Picture</h4>
                    <input type="file" onChange={handleImageChange} />
                    {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '100%', marginTop: '10px' }} />}
                </div>
                <div className="modal-footer">
                    <button className="modal-close btn-flat" onClick={handleImageUpload}>Upload Profile Picture</button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
