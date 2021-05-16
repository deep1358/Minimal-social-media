import { createContext, useEffect, useReducer, useState } from "react";
import db, { Auth } from "../firebase";
import reducers from "./Reducers";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const initialState = {
    auth: {},
    posts: [],
  };

  const [Posts, setPosts] = useState([]);
  const [flag, setFlag] = useState(false);

  const [state, dispatch] = useReducer(reducers, initialState);

  useEffect(() => {
    Auth.onAuthStateChanged((user) => {
      dispatch({
        type: "AUTH",
        payload: user
          ? {
              name: user.displayName,
              email: user.email,
              avatar: user.photoURL,
              id: user.uid,
            }
          : {},
      });
    });
  }, []);

  useEffect(() => {
    const getPosts = () => {
      db.collection("posts")
        .orderBy("createdAt", "desc")
        .onSnapshot((snapshot) => {
          setPosts(
            snapshot.docs.map((doc) => {
              return { id: doc.id, data: doc.data() };
            })
          );
          setFlag(true);
        });
      dispatch({ type: "ADD_POSTS", payload: Posts });
    };
    getPosts();
  }, [flag, state.posts.length]);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};
