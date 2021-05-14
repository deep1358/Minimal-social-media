import { createContext, useContext, useEffect, useReducer } from "react";
import { Auth } from "../firebase";
import reducers from "./Reducers";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const initialState = {
    notify: {},
    auth: {},
    post: [],
  };

  const [state, dispatch] = useReducer(reducers, initialState);

  useEffect(() => {
    Auth.onAuthStateChanged((user) => {
      dispatch({
        type: "AUTH",
        payload: user
          ? { name: user.displayName, email: user.email, avatar: user.photoURL }
          : {},
      });
    });
  }, []);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};
