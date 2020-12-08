
import React , { useState, useEffect }from 'react';
import './App.css';
import Post from'./Post';
import { db, auth } from './firebase';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ImageUpload1 from './ImageUpload1';



function getModalStyle() {
    const top = 50 ;
    const left = 50  ;

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  
  const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 300,
    height: 270,
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(5, 7, 6),
  },
}));


function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts,setPosts] = useState([]);
  const [open,setOpen] = useState(false);  
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username,setUsername] = useState('');  
  const [email,setEmail] = useState('');  
  const [password,setPassword] = useState('');  
  const [user, setUser] = useState(null);
  useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        console.log(authUser);
        setUser(authUser);
      }
      else {
        setUser(null);
      }
    })

    return () => {
      unsubscribe();
    }
  }, [user, username]);




  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
      id: doc.id,
      post: doc.data()
      })));
    })
  }, []);
  
  const signUp = (event) => {
    event.preventDefault();
  
    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return  authUser.user.updateProfile({
          displayName: username
      })
    })
    .catch((error) => alert(error.message));
  
    setOpen(false);
  }  
  
  const signIn = (event) =>{
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))

      setOpenSignIn(false);
   }

  return (
    <div className="App"> 
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
            <form>  
              <center>
                <img
                  className="app__headerImage"
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
                  alt="" 
                />
                <h5>Sign up to see photos and videos from your friends.</h5>
                </center>
                
                <br/>
                <div classname="username">
                  <AccountCircleIcon className="icons"/>
                  <Input
                    placeholder="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <br/>
                <div classname = "email">
                  <EmailIcon className="icons"/>
                  <Input
                    placeholder="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}  
                  />
                </div>
                <br/>
                <div classname="password">  
                  <LockIcon className="icons"/>
                  <Input
                    placeholder="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}  
                  />
                </div>
                <br/>
                <center>
                  <Button type="submit" onClick={signUp}>Sign Up</Button>
                </center>
              </form>
        </div>
      </Modal>
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
            <form>  
              <center>
                <img
                  className="app__headerImage"
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
                  alt="" 
                />
                <h5>Sign up to see photos and videos from your friends.</h5>
                </center>
                
                
                <br/>
                <div classname = "email">
                  <EmailIcon className="icons"/>
                  <Input
                    placeholder="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}  
                  />
                </div>
                <br/>
                <div classname="password">  
                  <LockIcon className="icons"/>
                  <Input
                    placeholder="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}  
                  />
                </div>
                <br/>
                <center>
                  <Button type="submit" onClick={signIn}>Sign In</Button>
                </center>
              </form>
        </div>
      </Modal>
        <div className="app__header">
          <img
            className="app__headerImage"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
            alt="" 
          />

          {user ? (
            <Button onClick={()=> auth.signOut()}>Logout</Button>
          ):(
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
          )}

        </div>
        <div className="app__posts">
        {
          posts.map(({id, post}) => (
            <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
          ))
        }
        </div>

        

        {user?.displayName ? (
        <ImageUpload1 username={user.displayName} />
        ):(
        <h3>Login to upload</h3>
        )}

        
    </div>
  );
}

export default App;
