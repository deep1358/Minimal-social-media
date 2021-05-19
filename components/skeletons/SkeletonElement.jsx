import Shimmer from "./Shimmer";

const SkeletonElement = () => {
  return (
    <div className="skeleton">
      <Shimmer />
      <div className="post-header">
        <div className="post-header-left">
          <div className="avatar"></div>
          <h3></h3>
        </div>
      </div>
      <div className="image"></div>
      <div className="icons">
        <div className="left-icons">
          <div className="like-icon"></div>
          <div className="comment-icon"></div>
        </div>
        <div className="delete-icon"></div>
      </div>
      <div className="caption">
        <div className="author"></div>
        <div className="text"></div>
      </div>
      <div className="write">
        <div className="input"></div>
        <div className="post-button"></div>
      </div>
    </div>
  );
};

export default SkeletonElement;
