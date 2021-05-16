import { motion } from "framer-motion";
import "aos/dist/aos.css";
import { useContext, useEffect, useState } from "react";
import Aos from "aos";
import db, { serverTimestamp } from "../firebase";
import { DataContext } from "../store/GlobalState";
import CommentsModal from "./CommentsModal";
import { toast } from "react-toastify";

const Post = ({ post }) => {
  useEffect(() => {
    Aos.init();
    Aos.refresh();
  }, []);

  const {
    state: { auth },
  } = useContext(DataContext);

  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isComment, setIsComment] = useState(false);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [likeFlag, setLikeFlag] = useState(false);

  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
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
            setLikeFlag(true);
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
      return toast.error("Must be loggged in to like");
    }
    setIsLiked(!isLiked);
    if (isLiked === false && !likeFlag) {
      db.collection("posts")
        .doc(post.id)
        .collection("likes")
        .add({ uid: auth.id });
    } else {
      db.collection("posts")
        .doc(post.id)
        .collection("likes")
        .doc(auth.id)
        .delete();
      // .then(() => setLikeFlag(false));
    }
  };

  return (
    <>
      <CommentsModal
        setIsOpen={setIsOpen}
        closeModal={closeModal}
        modalIsOpen={modalIsOpen}
        comments={comments}
      />
      <div data-aos="zoom-in" className="post">
        <div className="post-header">
          <div className="post-header-left">
            <img src={post.data.uavatar} className="avatar post-avatar" />
            <h3>{post.data.uname}</h3>
          </div>
        </div>

        <img src={post.data.imageUrl} alt={post.data.imageUrl} />

        <div className="post-icons">
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
