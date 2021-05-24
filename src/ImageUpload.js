import React, { useState } from 'react';
import {Button} from "@material-ui/core";
import firebase from "firebase";
import axios from "./axios";
import {storage,db} from "./firebase";

function ImageUpload({username}) {
    const[image,setImage]=useState(null);
    const[progress,setProgress]=useState(0);
    const[caption,setCaption]=useState('');
    const [url,setUrl]=useState("")
    
const handleChange=(e)=>{            //function firesof the event
    if(e.target.files[0]){
        setImage(e.target.files[0]);
    }
}
const handleUpload=()=>{
const uploadTask = storage.ref(`images/${image.name}`).put(image);
uploadTask.on(
    "state_changed",
    (snapshot)=>{
        //progress function
        const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes)*100
        );
        
        setProgress(progress)
    },
    (error)=>{
        console.log(error);
        alert(error.message)
    },
    ()=>{
        //complete function...
        storage
        .ref("images")
        .child(image.name)
        .getDownloadURL()
        .then(url=>{
            setUrl(url);
axios.post("/upload",{
    caption:caption,
    user:username,
    image:url
    
});

            //post image inside the db
            db.collection("posts").add({
                timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                caption:caption,
                imageUrl:url,
                username:username
            })
            setProgress(0);
            setCaption("");
            setImage(null);
        });
    }
)
}

    return (
        <div className="imageupload">
            {/* {
                i want to have
                caption input
                file picker
                post button
            } */}

            <progress className="progress_imageupload" value={progress} max="100"/>
            <input type="text" placeholder="enter a caption" onChange={event=>setCaption(event.target.value)} value={caption} />
            <input type="file" onChange={handleChange}/>
            <Button onClick={handleUpload}>
            Upload
            </Button>       </div>
    )
}

export default ImageUpload
