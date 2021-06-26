import { motion } from "framer-motion";
import { useContext, useState } from "react";
import Modal from "react-modal";
import { v4 as uuidv4 } from "uuid";
import db, { storage, serverTimestamp } from "../firebase";
import { DataContext } from "../store/GlobalState";
import { toast } from "react-toastify";
import imageCompression from "browser-image-compression";
import EditPostLoading from "./EditPostloading";

const EditPostModal = ({ modalIsOpen, closeModal, setIsOpen, post }) => {
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

  const [caption, setCaption] = useState(post.data.caption || "");
  const [image, setImage] = useState(post.data.imageUrl || null);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!caption || !image) {
      return toast.error("Every field must be filled");
    }
    if (image.size >= 1024 * 1024 * 7) {
      return toast.error("Maximum image size is 7MB");
    }
    if (typeof image !== "string") {
      const id = uuidv4();

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      try {
        const compressedImage = await imageCompression(image, options);

        setLoading(true);

        var uploadTask = storage
          .ref()
          .child(`image/${id}`)
          .put(compressedImage);
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
                .doc(post.id)
                .delete()
                .then(() => {
                  var deleteRef = storage
                    .ref()
                    .child(`image/${post.data.imageId}`);
                  deleteRef.delete().then(() => {
                    db.collection("posts")
                      .doc(post.id)
                      .set({
                        ...post.data,
                        imageUrl: downloadURL,
                        imageId: id,
                        caption,
                        createdAt: serverTimestamp(),
                      })
                      .then((res) => {
                        const Post = posts.filter((p) => p.id !== post.id);
                        dispatch({
                          type: "ADD_POSTS",
                          payload: {
                            ...Post,
                            id: post.id,
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
                        toast.success("Post Updated successfully!!!");
                      });
                  });
                });
            });
          }
        );
      } catch (error) {
        toast.error(error);
      }
    } else {
      setLoading(true);
      db.collection("posts")
        .doc(post.id)
        .set({
          ...post.data,
          caption,
          createdAt: serverTimestamp(),
        })
        .then((res) => {
          const Post = posts.filter((p) => p.id !== post.id);
          dispatch({
            type: "ADD_POSTS",
            payload: {
              ...Post,
              id: post.id,
              data: {
                uid: auth.id,
                uname: auth.uname,
                uavatar: auth.avatar,
                imageUrl: image,
                caption,
                createdAt: serverTimestamp(),
              },
            },
          });
          setLoading(false);
          setIsOpen(false);
          setCaption("");
          setImage(null);
          toast.success("Post Updated successfully!!!");
        });
    }
  };

  // console.log(image);

  return (
    <>
      <Modal
        ariaHideApp={false}
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        {loading && <EditPostLoading />}
        <div className="modal">
          <h1>Update Post</h1>
          <form onSubmit={handleUpdate}>
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
              onClick={handleUpdate}
            >
              Update Post
            </motion.button>
          </form>
          {(caption !== "" || image !== null) && (
            <div className="post-preview">
              <div>
                <img
                  src={
                    typeof image === "string"
                      ? image
                      : image !== null && URL.createObjectURL(image)
                  }
                  alt={
                    typeof image === "string"
                      ? image
                      : image !== null && URL.createObjectURL(image)
                  }
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

export default EditPostModal;
