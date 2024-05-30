import React from 'react';


const PostList = ({ posts, currentUser, handleLike, handleCommentChange, handleComment, handleDelete }) => {
    
    const isArray = Array.isArray(posts);

    const postArray = isArray ? posts : [posts];
     
    return (
        <div className='home'>
            {postArray.map(post => (
                <div className='card home-card' key={post._id}>
                    <div style={{display:'flex',justifyContent:'space-between'}}>
                    <div  style={{gap:'10px',display:'flex',margin:'10px 10px 10px'}}>
                    <img src={post.postedBy.profilePicture} alt={post.postedBy.name} className="circle" style={{width:'50px',height:'50px'}}/>
                    <div className="title" style={{margin:'10px 0 0 0',fontWeight:'bold'}}>{post.postedBy.name}</div>
                     </div>
                        {currentUser && post.postedBy._id === currentUser?._id && (
                            <i className="material-icons" onClick={() => handleDelete(post._id)} style={{margin:'15px 5px',color:'rgb(250, 96, 96)'}}>delete</i>
                        )}
                    </div>
                    <div className='card-image'>
                        <img src={post.photo} alt={post.title} />
                    </div>
                    <div className='card-content'>
                        <i className="material-icons" style={{ color: (currentUser && post.likes.includes(currentUser?._id)) ? 'red' : 'white' }} onClick={() => handleLike(post._id)}>
                            {post.likes.includes(currentUser._id) ? 'favorite' : 'favorite_border'}
                        </i>
                        <p>{post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}</p>
                        <h6>{post.title}</h6>
                        <p>{post.body}</p>
                        <input
                            type='text'
                            placeholder='add a comment'
                            onChange={(event) => handleCommentChange(event)}
                            style={{margin:'15px 0  0',color:'white'}}
                        />
                        <button className = "btn waves-effect waves-light #6a1b9a purple darken-3" style={{borderRadius: '10px',margin:'15px 0 5px 0'}} onClick={() => handleComment(post._id)}>Post Comment</button>
                        <div style={{margin:'15px 15px 0px 0px'}}>
                            {post.comments && post.comments.map((comment,index) => (
                                <p key={index} ><strong>{comment.postedBy.name}: </strong>{comment.text}</p>
                            ))}
                        </div>    
                    </div>
                </div>
            ))}
        </div>
    );
}

export default PostList;