import { useContext, useEffect } from "react";
import { DataContext } from "../store/GlobalState";
import Loading from "./CreatePostLoading";
import { toast, ToastContainer } from "react-toastify";
import { injectStyle } from "react-toastify/dist/inject-style";

const Notify = () => {
  const {
    state: { notify },
    dispatch,
  } = useContext(DataContext);

  useEffect(() => {
    injectStyle();
  });

  return (
    <>
      <ToastContainer />
      {notify.loading && <Loading />}
      {notify.success && toast.success(notify.success)}
      {notify.error && toast.error(notify.error)}
    </>
  );
};

export default Notify;
