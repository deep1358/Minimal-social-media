import Head from "next/head";
import { useContext } from "react";
import { DataContext } from "../store/GlobalState";
import Post from "../components/Post";
import SkeletonElement from "../components/skeletons/SkeletonElement";

export default function Home() {
  const {
    state: { posts },
  } = useContext(DataContext);

  return (
    <div>
      <Head>
        <title>Social Media</title>
      </Head>

      <div style={{ marginTop: "3vh" }}>
        {posts.length > 0 ? (
          posts.map((post) => <Post post={post} key={post.id} />)
        ) : (
          <SkeletonElement />
        )}
      </div>
    </div>
  );
}
