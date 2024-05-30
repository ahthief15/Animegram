import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import M from 'materialize-css';
import PostList from '../PostList';

const Post = ({currentUser}) => {
    const {postId} = useParams()
    const [posts, setPosts] = useState([]);
    const [comment, setComment] = useState('');
    const navigate = useNavigate();
   

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (!token) {
            navigate('/signin');
            return;
        }   
    }, [navigate]);
    

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`/post/${postId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data.posts)
                setPosts(Array.isArray(data.posts) ? data.posts : [data.posts]);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };
        fetchPosts();
    },[postId]);

    const makeRequest = async (url,body = null) => {
        try{
            const token = localStorage.getItem('jwt')
            const response = await fetch(url, {
                method:'PUT',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${token}`
                },
                body: body? JSON.stringify(body) : null
            });
            if(!response.ok) {
                throw new Error('Network response was not OK')
            }
            const responseData = await response.json();
            return responseData;
        } catch(error) {
            console.log("Error making PUT request:",error);
            throw(error)
        }
    }
    const handleLike = async (postId) => {
        try {
            const updatedPost = await makeRequest(`/posts/like/${postId}`);
            console.log(updatedPost)
            setPosts(prevPosts =>
                prevPosts.map(post => {
                    if (post._id === postId) {
                         return { ...post, likes: updatedPost.likes};
            
                    }
                    return post;
                })
            );
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value)
    }

   
    const handleComment = async (postId) => {
        if (!comment.trim()) return;
        try{
        const updatedpost = await makeRequest(`/posts/comment/${postId}`,{text:comment});
        setPosts(prevPosts => prevPosts.map(post => {
            if(post._id === postId) {
                return {...post,comments:updatedpost.comments}
            }
            return post;
        }));
        setComment(" ")
        
    } catch(error){
        console.error('Error commenting post:', error);
    }
}

const handleDelete =  async (postId) => {
    try{
        console.log(postId)
        const response = await makeRequest(`posts/delete/${postId}`)
        setPosts(prevPosts => prevPosts.filter(post => post._id !== postId))
        M.toast({html:response.message})
    } catch(error) {
        console.log("Error Deleting",error)
    }
}


    return (
        <PostList
        posts={posts}
        currentUser={currentUser}
        handleLike={handleLike}
        handleCommentChange={handleCommentChange}
        handleComment={handleComment}
        handleDelete={handleDelete}
    />
    )
}

export default Post;
