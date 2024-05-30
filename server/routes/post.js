const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")



router.get('/allposts',requireLogin,(req,res) => {
    Post.find()
        .populate("postedBy", "_id name profilePicture")
        .populate("comments.postedBy", "_id name")
        .then(posts => {
            res.json({posts})
        })
    .catch(err=>{
        console.log(err)
    })
})



router.get('/currentuser',requireLogin,(req,res) => {
    const user = req.user
    res.json({user})
})



router.post('/createpost',requireLogin,(req,res) => {
    const {title,body,pic} = req.body
    console.log(title,body,pic)
    if(!title || !body || !pic) {
        return res.status(422).json({ error: 'Please enter all fields' });
    }

    console.log(req.user)

    req.user.password = undefined
    const post = new Post({
        title,
        body,
        photo: pic,
        postedBy: req.user,
    });


    post.save()
    .then(() =>{
        res.json({message:"Succesfully Created Post"}) 
    })
    .catch(err=>{
        console.log(err)
    })

})

router.get('/myposts', requireLogin, (req, res) => {
    const user = req.user
    Post.find({ postedBy: req.user._id }) 
        .populate("postedBy", "_id name")
        .then(mypost => {
            res.json({ mypost ,user});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "Internal server error" }); 
        });
});

router.put('/posts/delete/:postId', requireLogin, async (req, res) => {
    try {
        const postId = req.params.postId;
        
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (post.postedBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "You are not authorized to delete this post" });
        }

        await Post.deleteOne({ _id: postId });

        res.json({ message: "Post Deleted Successfully" });
    } catch (error) {
        console.log("Error deleting post", error);
        res.status(500).json({ error: "Server Error" });
    }
});

router.put('/posts/like/:postId', requireLogin, async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const alreadyLiked = post.likes.includes(userId);

        if (alreadyLiked) {

            post.likes.pull(userId);
        } else {
  
            post.likes.push(userId);
        }

     
        const updatedPost = await post.save();
        res.json(updatedPost);
        console.log(updatedPost)
    } catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({ error: "Server error" });
    }
});

router.put('/posts/comment/:postId',requireLogin, async (req,res) => {
    try{
        const postId = req.params.postId

        const post = await Post.findById(postId)

        if (!post) {
            return res.status(404).json({error:"Post not found"})
        }

        const comment = {
            text:req.body.text,
            postedBy:req.user._id    
        }

        post.comments.push(comment);
        const updatedpost = await post.save()
        await updatedpost.populate("comments.postedBy", "_id name")
        res.json(updatedpost)
        console.log(updatedpost)
    } catch(error) {
        console.log("Server error")
    }
})

router.get('/user/:userId/posts', async (req, res) => {
    try {
        const userId = req.params.userId;
        const posts = await Post.find({ postedBy: userId });
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/post/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const posts = await Post.findById(postId).populate("postedBy", "_id name")
        .populate("comments.postedBy", "_id name")

        if (!posts) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json({posts});
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ error: 'Server error' });
    }
});



module.exports = router 