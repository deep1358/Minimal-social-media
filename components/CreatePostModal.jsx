import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import Modal from "react-modal";
import { v4 as uuidv4 } from "uuid";
import db, { storage, serverTimestamp } from "../firebase";
import { DataContext } from "../store/GlobalState";
import CreatePostLoading from "./CreatePostLoading";
import { toast } from "react-toastify";
import imageCompression from "browser-image-compression";

const CreatePostModal = ({ modalIsOpen, closeModal, setIsOpen }) => {
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  const {
    state: { auth, posts },
    dispatch,
  } = useContext(DataContext);

  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption || !image) {
      return toast.error("Every field must be filled");
    }
    if (image.size >= 1024 * 1024 * 7) {
      return toast.error("Maximum image size is 7MB");
    }
    const id = uuidv4();

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedImage = await imageCompression(image, options);

      setLoading(true);

      var uploadTask = storage.ref().child(`image/${id}`).put(compressedImage);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          toast.error(error);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            db.collection("posts")
              .add({
                uid: auth.id,
                uname: auth.name,
                uavatar: auth.avatar,
                imageUrl: downloadURL,
                imageId: id,
                caption,
                createdAt: serverTimestamp(),
              })
              .then((res) => {
                dispatch({
                  type: "ADD_POSTS",
                  payload: {
                    ...posts,
                    id: res.id,
                    data: {
                      uid: auth.id,
                      uname: auth.uname,
                      uavatar: auth.avatar,
                      imageUrl: downloadURL,
                      caption,
                      createdAt: serverTimestamp(),
                    },
                  },
                });
                setLoading(false);
                setIsOpen(false);
                setCaption("");
                setImage(null);
                toast.success("Post Created successfully!!!");
              });
          });
        }
      );
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <Modal
        ariaHideApp={false}
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        {loading && <CreatePostLoading />}
        <div className="modal">
          <h1>Create Post</h1>
          <form onSubmit={handleSubmit}>
            <input
              accept="image/*"
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <input
                className="caption-input"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                type="text"
                name="caption"
                placeholder="Enter Caption"
                maxLength="60"
              />
              <span className="maxlength-indicator">
                max-characters: {60 - Number(caption.length)}
              </span>
            </div>
            <motion.button
              whileHover={{ letterSpacing: ".5px" }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={handleSubmit}
            >
              Create Post
            </motion.button>
          </form>
          {(caption !== "" || image !== null) && (
            <div className="post-preview">
              <div>
                <img
                  src={image !== null && URL.createObjectURL(image)}
                  alt={image !== null && URL.createObjectURL(image)}
                />
                {image !== null && (
                  <div className="image-close">
                    <i
                      onClick={() => setImage(null)}
                      className="fas fa-times"
                    ></i>
                  </div>
                )}
              </div>
              <p>{caption}</p>
            </div>
          )}
        </div>
        <motion.i
          whileTap={{
            scale: 0.8,
          }}
          onClick={closeModal}
          className="close fa-2x fas fa-times"
        ></motion.i>
      </Modal>
    </>
  );
};

export default CreatePostModal;
