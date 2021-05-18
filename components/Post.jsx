import { motion } from "framer-motion";
import "aos/dist/aos.css";
import { useContext, useEffect, useState } from "react";
import Aos from "aos";
import db, { serverTimestamp, storage } from "../firebase";
import { DataContext } from "../store/GlobalState";
import CommentsModal from "./CommentsModal";
import { toast } from "react-toastify";
import Modal from "react-modal";
import DeleteLoading from "./DeleteLoading";
import Image from "next/image";

const Post = ({ post }) => {
  useEffect(() => {
    Aos.init();
    Aos.refresh();
  }, []);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      overflow: "visible",
    },
  };

  const {
    state: { auth, posts },
    dispatch,
  } = useContext(DataContext);

  const [comment, setComment] = useState("");

  const [isLiked, setIsLiked] = useState(false);
  const [isComment, setIsComment] = useState(false);

  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);

  const [loading, setLoading] = useState(false);

  const [modalIsOpen, setIsOpen] = useState(false);
  const [modal1IsOpen, setModal1IsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
  function openModal1() {
    setModal1IsOpen(true);
  }
  function closeModal1() {
    setModal1IsOpen(false);
  }

  useEffect(() => {
    let unsubscribe;
    unsubscribe = db
      .collection("posts")
      .doc(post.id)
      .collection("comments")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        setComments(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        );
      });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    let unsubscribe;
    unsubscribe = db
      .collection("posts")
      .doc(post.id)
      .collection("likes")
      .onSnapshot((snapshot) => {
        setLikes(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        );
      });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (auth.id) {
      if (Object.keys(comments).length > 0) {
        comments.map((comment) => {
          if (comment.data.uid === auth.id) setIsComment(true);
        });
      }
    } else {
      setIsComment(false);
    }
  }, [comments.length, auth.id]);

  useEffect(() => {
    if (auth.id) {
      if (Object.keys(likes).length > 0) {
        likes.map((like) => {
          if (like.data.uid === auth.id) {
            setIsLiked(true);
          }
        });
      }
    } else {
      setIsLiked(false);
    }
  }, [likes.length, auth.id]);

  const postComment = () => {
    if (!auth.id) {
      return toast.error("Must be logged in to comment");
    }
    if (!comment) {
      return toast.error("Comment can't be blank");
    }
    db.collection("posts")
      .doc(post.id)
      .collection("comments")
      .add({
        text: comment,
        uid: auth.id,
        uname: auth.name,
        uavatar: auth.avatar,
        createdAt: serverTimestamp(),
      })
      .then(() => {
        setComment("");
        return toast.success("Commented Successfully!!");
      });
  };

  const postLike = () => {
    if (!auth.id) {
      return toast.error("Must be logged in to like");
    }

    setIsLiked(!isLiked);

    if (isLiked === false) {
      db.collection("posts")
        .doc(post.id)
        .collection("likes")
        .add({ uid: auth.id });
    } else {
      const like = likes.filter((like) => like.data.uid === auth.id);
      db.collection("posts")
        .doc(post.id)
        .collection("likes")
        .doc(like[0].id)
        .delete();
    }
  };

  const handleDelete = () => {
    setLoading(true);
    const Posts = posts.filter((item) => item.id !== post.id);

    db.collection("posts")
      .doc(post.id)
      .delete()
      .then(() => {
        var deleteRef = storage.ref().child(`image/${post.data.imageId}`);
        deleteRef.delete().then(() => {
          dispatch({ type: "ADD_POSTS", payload: Posts });
          setLoading(false);
          closeModal1();
          return toast.success("Deleted Successfully!!");
        });
      });
  };

  return (
    <>
      <CommentsModal
        setIsOpen={setIsOpen}
        closeModal={closeModal}
        modalIsOpen={modalIsOpen}
        comments={comments}
      />
      <Modal
        ariaHideApp={false}
        isOpen={modal1IsOpen}
        onRequestClose={closeModal1}
        style={customStyles}
      >
        {loading && <DeleteLoading />}
        <div className="delete-modal">
          <h3 style={{ marginTop: "-10px" }}>
            Do you want to delete the post?
          </h3>
          <div className="buttons">
            <motion.button whileTap={{ scale: 0.9 }} onClick={handleDelete}>
              Yes
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                closeModal1();
              }}
            >
              No
            </motion.button>
          </div>
        </div>
      </Modal>
      <div data-aos="zoom-in" className="post">
        <div className="post-header">
          <div className="post-header-left">
            <img
              src={post.data.uavatar}
              alt={post.data.uname}
              className="avatar post-avatar"
            />
            <h3>{post.data.uname}</h3>
          </div>
        </div>

        <Image
          src={post.data.imageUrl}
          alt={post.data.caption}
          width={550}
          height={450}
        />

        <div className="post-icons">
          <div>
            <div className="icon">
              <motion.i
                whileHover={{
                  scale: 1.1,
                }}
                whileTap={{
                  scale: 1.0,
                }}
                onClick={postLike}
                className={
                  isLiked ? "fa-2x fas fa-thumbs-up" : "fa-2x far fa-thumbs-up"
                }
              ></motion.i>
              <p style={{ marginLeft: "5px" }}>{likes.length}</p>
            </div>

            <div className="icon">
              <motion.i
                onClick={() => {
                  comments.length > 0 && openModal();
                }}
                whileHover={{
                  scale: 1.1,
                }}
                whileTap={{
                  scale: 1.0,
                }}
                className={
                  isComment ? "fas fa-2x fa-comment" : "far fa-2x fa-comment"
                }
              ></motion.i>

              <p style={{ marginLeft: "5px" }}>{comments.length}</p>
            </div>
          </div>

          <div>
            {auth?.id && auth.id === post.data.uid ? (
              <motion.i
                whileTap={{
                  scale: 0.9,
                }}
                className="fas fa-trash"
                onClick={() => openModal1()}
              ></motion.i>
            ) : (
              <></>
            )}
          </div>
        </div>

        <div className="post-caption">
          <p>
            <b>{post.data.uname}</b> {post.data.caption}
          </p>
        </div>

        <div className="post-write-comment">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            type="text"
            placeholder="Add a comment"
          />
          <motion.button
            onClick={postComment}
            whileTap={{ scale: 0.9 }}
            className="send-btn"
          >
            post
          </motion.button>
        </div>
      </div>
    </>
  );
};

export default Post;
