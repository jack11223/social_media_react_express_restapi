import React,{useEffect, useRef} from 'react'
import './Post.css'

import Comment from '../../img/comment.png'
// import Share from '../../img/share.png'
import Download from '../../img/download.png'
import Completed from '../../img/completed.png'
import Heart from '../../img/like.png'
import NotLike from '../../img/notlike.png'
import Delete from '../../img/delete.png'

import { useSelector } from 'react-redux'
import { useState } from 'react'
import { likePost } from '../../api/PostRequest'
// import {deletePost} from '../../api/PostRequest'
import { deletePost } from "../../action/uploadAction";
import  { useDispatch } from 'react-redux'
import { getUser, savePost } from '../../api/UserRequest'




const Post = ({data,userId}) => {


  const ref = useRef(null);
  const dispatch = useDispatch()
  const {user} = useSelector((state)=> state.authReducer.authData);

  const [liked,setLiked] = useState(data.likes.includes(user._id))
  const [saved,setSaved] = useState(user.savePost.includes(data._id))
  const [likes,setLikes] = useState(data.likes.length);
  const [save,setSave] = useState(false)
  const [name,setName] = useState(true)

  const handleLike = () =>{
    setLiked((prev)=> !prev);
    likePost(data._id,user._id);
    liked ? setLikes((prev)=> prev - 1) : setLikes((prev)=> prev + 1)
  }

// delete post
const handleDelete = (postId,ref) =>{
  dispatch(deletePost(postId,user._id))
  ref.current.remove()
}


// get user

useEffect(()=>{
  const user = async() =>{
      const {data} = await getUser(userId);
     setName(data)

  }
  user()
},[])

// post save
const handleSave =(postId,userId)=>{
  setSaved((prev)=> !prev);

  setSave((prev)=> !prev)
  savePost(postId,userId);
  
}


  return (
    
    <div className="Post" ref={ref}>
            {/* <h4>{name.firstname}</h4> */}
    <img src={data.image ? process.env.REACT_APP_PUBLIC_FOLDER + data.image : ""} alt=""  />

    <div className="postReact">
        <img src={liked ? Heart : NotLike} alt="" style={{cursor:"pointer"}}  onClick={handleLike}/>
        <img src={Comment} alt="" />

{  
  !save?user._id !== data.userId?<img src={Download} style={{width:"25px",height:"25px"}}  alt=""
  onClick={() => handleSave(data._id,user._id)} />:"" : 
  user._id !== data.userId? <img src={Completed} onClick={()=> handleSave(data._id,user._id)} style={{width:"25px",height:"25px"}}  alt="" />:"" 
  
}

  
     
        {user._id === data.userId ? <img style={{width:"25px",height:"25px"}} src={Delete} alt="" 
        onClick={()=> handleDelete(data._id,ref)} />:"" }
        
    </div>
    <span style={{color:"var(--gray)",fontSize : "12px"}}>{likes} Likes</span>
    <div className="details">
        <span><b> {data.name}</b></span>
        <span> {data.desc}</span>
    </div>

    </div>
  )
}

export default Post