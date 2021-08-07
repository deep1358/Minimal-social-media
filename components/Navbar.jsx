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
    try {
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
        toast.success("Logged in successfully as " + user.displayName);
      });
    } catch (err) {
      toast.error(err);
    }
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
          <img alt={auth.name} src={auth.avatar} className="dropbtn avatar" />

          <div className="dropdown-content">
            <div onClick={openModal}>Create Post</div>
            <div
              onClick={() => {
                Auth.signOut();
                dispatch({ type: "AUTH", payload: {} });
                toast.success("Logged out successfully!!");
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
              <img
                alt="google logo"
                src="https://cdn2.iconfinder.com/data/icons/social-icons-33/128/Google-128.png"
              />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Navbar;
