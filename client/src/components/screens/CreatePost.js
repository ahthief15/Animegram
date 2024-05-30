import React,{useState,useEffect} from'react'
import {useNavigate} from 'react-router-dom';
import M from 'materialize-css'


const CreatePost = () => {
    const Navigate = useNavigate()
    const [title,setTitle] = useState("");
    const [body,setBody] = useState("");
    const [image,setImage] = useState(""); 
    const [url,setUrl] = useState("");

    useEffect(() => {
        if (url) {

            fetch("/createpost",{
                method:"post",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    title,
                    body,
                    pic:url
    
                })
            })
            .then(res=>res.json())
            .then(data => {
                 if(data.error){
                   M.toast({html:data.error,classes:' #c62828 red darken-3'})
                }
    
                else{
                    console.log(data)
                    M.toast({html:data.message,classes:'#43a047 green darken-1'})
                    Navigate('/')
                }
            })
            .catch(err=> {
                console.log(err)
            })

        }

    },[url,Navigate,body,title])


    const postDetails = () => {
        const data = new FormData(); 
        data.append("file", image);
        data.append("upload_preset", "insta-clone");
        data.append("cloud_name", "dbvllujxg");
    
        fetch("https://api.cloudinary.com/v1_1/dbvllujxg/image/upload", {
            method: "post",
            body: data
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();
        })
        .then(data => {
            setUrl(data.url)
        })
        .catch(err => {
            console.error("Error uploading image:", err);
        });

    }
    

    return(
        <div className='card input-field glass-effect'
         style={{
            margin:'130px auto',
            maxWidth: '500px',
            padding:'20px',
            textAlign:'center'
         }}>
            <input type='text' 
            placeholder='title'
            value={title}
            onChange={(e)=>{
                setTitle(e.target.value)
            }}  
            />
            <input type='text' 
            placeholder='body'
            value={body}
            onChange={(e)=>{
                setBody(e.target.value)
            }} 
             />
            <div class="file-field input-field" style={{display:'flex',flexDirection:'column'}}>
                <div className="btn #6a1b9a purple darken-3" style={{borderRadius:'30px'}}>
                    <span>Upload Image</span>
                    <input type="file" onChange = {(e)=>setImage(e.target.files[0])}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"style={{border:'none',textAlign:'center'}}/>
                </div>
            </div> 
            <button className="btn waves-effect waves-light #6a1b9a purple darken-3" style={{borderRadius:'30px'}}
             onClick={()=>{postDetails()}} >
                 Post
            </button>       
      </div>
    )

}

export default CreatePost