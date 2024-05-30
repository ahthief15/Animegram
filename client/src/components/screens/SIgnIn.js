import React,{useState} from 'react';
import { Link,useNavigate} from 'react-router-dom';
import M from 'materialize-css'


const Signin= ({handleLogin}) => {

    const Navigate = useNavigate()
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const PostData = () => {
        fetch("/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                email

            })
        })
        .then(res=>res.json())
        .then(data => {
             if(data.error){
               M.toast({html:data.error,classes:' #c62828 red darken-3'})
            }

            else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                M.toast({html:data.message,classes:'#43a047 green darken-1'})
                handleLogin()
                Navigate('/')
            }
        })
        .catch(err=> {
            console.log(err)
        }) 

    }
    
    return (
        <div className='mycard' >
            <div className="card auth-card input-field">
                <h2>AnimePost</h2>
                <input type='text' 
                placeholder='email' 
                value={email}
                onChange={(e) =>
                setEmail(e.target.value)} 
                />
                <input type='text'
                 placeholder='password'
                 value={password}
                 onChange={(e) =>
                 setPassword(e.target.value)}  
                 />
                <button className="btn waves-effect waves-light #6a1b9a purple darken-3" style={{borderRadius:'30px'}} onClick={()=>{PostData()}}>
                    Sign In 
                </button>
                <h5>
                    <Link to="/signup">Don't have an account?</Link>
                </h5> 
            </div>
        </div>
    );
}

export default Signin;
