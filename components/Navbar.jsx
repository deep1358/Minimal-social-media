import { useContext, useState } from "react";
import {
  Auth,
  facebookProvider,
  githubProvider,
  googleProvider,
} from "../firebase";
import { DataContext } from "../store/GlobalState";
import CreatePostModal from "../components/CreatePostModal";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const Navbar = () => {
  const {
    state: { auth },
    dispatch,
  } = useContext(DataContext);

  const loginWithGoogle = () => {
    Auth.signInWithPopup(googleProvider).then(function (result) {
      var user = result.user;
      dispatch({
        type: "AUTH",
        payload: {
          name: user.displayName,
          email: user.email,
          avatar: user.photoURL,
          id: user.uid,
        },
      });
      toast.success("Logged in succesfully as " + user.displayName);
    });
  };

  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: "-100%" }}
      animate={{ opacity: 1, y: "0%", transition: { delay: ".2" } }}
      className="navbar"
    >
      <CreatePostModal
        setIsOpen={setIsOpen}
        closeModal={closeModal}
        modalIsOpen={modalIsOpen}
      />
      <h1 className="navbar-title">Social Media</h1>

      {Object.keys(auth).length !== 0 ? (
        <div className="dropdown navbar-menu">
          <img src={auth.avatar} className="dropbtn avatar" />

          <div className="dropdown-content">
            <div onClick={openModal}>Create Post</div>
            <div
              onClick={() => {
                Auth.signOut();
                dispatch({ type: "AUTH", payload: {} });
                toast.success("Logged out succesfully!!");
              }}
            >
              Logout
            </div>
          </div>
        </div>
      ) : (
        <div className="dropdown navbar-menu">
          <button className="dropbtn">Sign In</button>
          <div className="dropdown-content">
            <div onClick={loginWithGoogle}>
              <img src="https://cdn2.iconfinder.com/data/icons/social-icons-33/128/Google-128.png" />
              Google
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Navbar;

{
  /* <div onClick={() => {}}>
              <img src="https://cdn1.iconfinder.com/data/icons/logotypes/32/github-128.png" />
              Github
            </div>
            <div onClick={() => {}}>
              <img src="https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Facebook_colored_svg_copy-128.png" />
              Facebook
            </div> */
}
// const loginWithFacebook = () => {
//   Auth.signInWithPopup(facebookProvider).then(function (result) {
//     // This gives you a Facebook Access Token.
//     var token = result.credential.accessToken;
//     // The signed-in user info.
//     var user = result.user;
//     console.log(user);
//     dispatch({
//       type: "AUTH",
//       payload: {
//         name: user.displayName,
//         email: user.email,
//         avatar: user.photoURL,
//       },
//     });
//   });
// };

// const loginWithGithub = () => {
// Auth.signInWithPopup(githubProvider)
//   .then(function (result) {
//     // This gives you a GitHub Access Token.
//     var token = result.credential.accessToken;
//     // The signed-in user info.
//     var user = result.user;
//     console.log(user);
//     // dispatch({
//     //   type: "AUTH",
//     //   payload: {
//     //     name: user.displayName,
//     //     email: user.email,
//     //     avatar: user.photoURL,
//     //   },
//     // });
//   })
//   .catch(function (error) {
//     // Handle Errors here.
//     var errorCode = error.code;
//     var errorMessage = error.message;
//     // The email of the user's account used.
//     var email = error.email;
//     // The firebase.auth.AuthCredential type that was used.
//     var credential = error.credential;
//     if (errorCode === "auth/account-exists-with-different-credential") {
//       alert("You have signed up with a different provider for that email.");
//       // Handle linking here if your app allows it.
//     } else {
//       console.error(error);
//     }
//   });
// };
