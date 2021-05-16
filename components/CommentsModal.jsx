import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import Modal from "react-modal";
import { DataContext } from "../store/GlobalState";

const CommentsModal = ({ comments, setIsOpen, closeModal, modalIsOpen }) => {
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: "0px",
    },
  };

  const {
    state: { auth, posts },
    dispatch,
  } = useContext(DataContext);

  return (
    <>
      <Modal
        ariaHideApp={false}
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <div className="comment-modal">
          <h1>Comments</h1>
          <div className="comment-body">
            {comments.map((comment) => (
              <div key={comment.id} className="comment">
                <div>
                  <img
                    src={comment.data.uavatar}
                    className="avatar comment-avatar"
                    alt={comment.data.uavatar}
                  />
                  <p>
                    <b>{comment.data.uname}</b>
                  </p>
                </div>
                <div>
                  <p>{comment.data.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <motion.i
          whileTap={{
            scale: 0.8,
          }}
          onClick={closeModal}
          className="close comment-close fa-2x fas fa-times"
        ></motion.i>
      </Modal>
    </>
  );
};

export default CommentsModal;
