const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const requireLogin = require('../middleware/requireLogin')

//"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjI3MzE0ZDUyMmZiNTI4Y2MyN2Y2OTgiLCJpYXQiOjE3MTM5NjA5NTl9.UsnaJ8GyyOEv9XiSmxNczIV2DVv0s6itj20UJ1BzuoM"
 

router.post('/',(req,res)=>{
    return res.json({message:'Hello'})
})

router.post('/signup',(req,res)=>{
    const {name,email,password} = req.body
    if (!email || !name || !password){
        return res.json({error:'please add all the fields'})
    }
    User.findOne({email:email})
    .then((savedUser) => {
        if(savedUser){
            return res.json({error:'User already exist with that email'})
        }

        bcrypt.hash(password,12)
        .then(hashedPassword => {
            const user = new User({
                email:email,
                name:name,
                password:hashedPassword,
            })
    
            user.save()
            .then(savedUser => {
                res.json({ message: 'SignUp successful '});
            })
            .catch(error => {
                console.error('Error saving user:', error);
                return res.status(500).json({ error: 'Error saving user, Try Again' });
            })

        })
       
    })
    .catch(error => {
        console.log(error)
    })
})

router.post('/signin',(req,res) =>{
    const {email,password} = req.body
    if(!email || !password) {
        return res.status(422).json({ error: 'Please enter email or password' });
    }

    User.findOne({email:email})
    .then(savedUser => {
        if(!savedUser){
            return res.status(422).json({ error: 'Email or Password is incorrect' });
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch => {
            if(doMatch) {
                const token  = jwt.sign({_id:savedUser._id},JWT_SECRET)
                const {_id,name,email} = savedUser
                res.json({token,user:_id,name,email,message:'Succesfully Logged In'})

            }
            else {
                return res.status(422).json({ error: 'Email or Password is incorrect' });
            }
        })
    })
    .catch(err =>{
        console.log(err)
        return res.status(422).json({ error: 'Error Logging In. Please Try Again' });
    })


})

router.get('/protected',requireLogin,(req,res) =>{
    console.log(req.user)
    res.send("Hello "+ req.user.name)
})

router.post('/uploadProfilePicture', requireLogin, async (req, res) => {
    try {
        const { profilePicture } = req.body;
        if (!profilePicture) {
            return res.status(400).json({ error: 'No profile picture URL provided' });
        }

        const user = await User.findByIdAndUpdate(req.user._id, {
            $set: { profilePicture: profilePicture }
        }, { new: true });
        res.json(user);
    } catch (error) {
        console.error('Error updating profile picture:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});

// Backend route to fetch users' names and profile pictures
router.get('/users', async (req, res) => {
    try {
        const users = await User.find(); 
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});


router.get('/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Return user details
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Server error' });
    }
})


router.put('/toggleFollow', requireLogin, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        const followUser = await User.findById(req.body.userId);

        if (!followUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const alreadyFollowing = followUser.followers.includes(currentUser._id);

        if (alreadyFollowing) {
            followUser.followers.pull(currentUser._id);
            currentUser.following.pull(followUser._id);
        } else {
            followUser.followers.push(currentUser._id);
            currentUser.following.push(followUser._id);
        }

        const updatedCurrentUser = await currentUser.save();
        const updatedFollowUser = await followUser.save();

        res.json({ currentUser: updatedCurrentUser, followUser: updatedFollowUser });
    } catch (error) {
        console.error('Error following/unfollowing user:', error);
        res.status(500).json({ error: 'Error following/unfollowing user, server error' });
    }
});

module.exports = router;


module.exports = router;


module.exports = router