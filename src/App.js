import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import { auth, db } from "./firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, Input } from "@material-ui/core";
import ImageUpload from "./ImageUpload";
import InstagramEmbed from 'react-instagram-embed';
import axios from './axios';
import Pusher from "pusher-js"
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [openSignIn,setOpenSignIn]=useState(false)
  //   {
  //     username:"Shashikanth" ,
  //     caption:"thats my new car guys....!",
  //    imageUrl:"https://i.ytimg.com/vi/RulQEuVCofM/maxresdefault.jpg"
  //   },
  //   {
  //     username:"Sunnysangha",
  //     caption:"yoo coooooooool",
  //      imageUrl:"https://i.ytimg.com/vi/RulQEuVCofM/maxresdefault.jpg"
  //   }
  // ]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged inn
        console.log(authUser);
        setUser(authUser);

        if (authUser.displayName) {
          //dont update username
        } else {
          //if we just created someone
          return authUser.updateProfile({
            displayName: username,
          });
        }
      } else {
        //user has logged out
        setUser(null);
      }
    })
    return ()=>{
      unsubscribe();
    }
  }, [user,username]);

  const fetchPosts = async()=> await axios.get('/sync').then(response=>{
    console.log(response.data)
   setPosts( response.data)
  })

  useEffect(() => {
    var pusher = new Pusher('d98e8d54b47057706455', {
      cluster: 'ap2'
    });

    var channel = pusher.subscribe('posts');
    channel.bind('inserted',(data)=>{
      console.log("data received",data)
      fetchPosts();
    }
    );
    
  }, [])

  useEffect(() => {
    fetchPosts();
  }, []);

  console.log('posts are',posts)
  const handleLogin=(e)=>{
    e.preventDefault();
    auth
    .signInWithEmailAndPassword(email,password)
    .catch((error)=>alert(error.message))
    setOpen(false)
  }
  const signup = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser)=>{
        authUser.user.updateProfile({
          displayName : username

      })
    })
      .catch((error) => alert(error.message));
  };
  const signIn = (event)=>{
    event.preventDefault();
    auth.signInWithEmailAndPassword(email,password)
    .catch((error)=>alert(error.message))
    setOpenSignIn(false)
}
  return (
    <div className="App">      
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                className="app_headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signup}>sign up</Button>
          </form>
        </div>
      </Modal>
   
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                className="app_headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
          
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={signIn}>SignIn</Button>
          </form>
        </div>
      </Modal>
      <div className="app_header">
        <img
          className="app_headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
           {user ?(
      <Button type="submit" onClick={() => auth.signOut()}>Logout</Button>

      ):(
        <div className="app__loginContainer">
<Button onClick={() => setOpenSignIn(true)}>SignIn</Button>
<Button onClick={() => setOpen(true)}>Signup</Button>
        </div>
    
      )}
      </div>
   
   <div className="app__posts">
    <div className="app__postsLeft">{posts.map((post) => (
        <Post 
          key={post._id}
          postId={post._id}
          user={user}
          username={post.user}
          caption={post.caption}
          imageUrl={post.image}
        />
        
      ))}
      </div>
       <div className="app__postsRight">
       <InstagramEmbed
          clientAccessToken='<146749597373564>|<IGQVJXQmhJUm5VeDRad0FGN1ZAtdUZA6dEllZAWRZATkRyaGpDazVwanRGVEJFWVZAzUDYzQ3NvVktpY1ZAxaWtXZA3ZAOU1QwU1J2MHNILTJfS21UQ2QyUEdsRzAycW9JYU9UQWFWRTdyVF9BU0UxbmJfTWJ5RQZDZD>'
          url='https://instagr.am/p/Zn1Xz/'
          maxWidth={375}
          hideCaption={false}
          containerTagName='div'
          injectScript
          protocol=''
          onLoading={() => {}}
          onSuccess={() => {}}
          onAfterRender={() => {}}
          onFailure={() => {}}
        />
       </div>
     
</div> 



          {user?.displayName ? (
        <ImageUpload username={user.displayName}/>
      ):
      (
        <h3>sorry u have to login</h3>
      )}
      
    </div>
   
  );
}

export default App;


