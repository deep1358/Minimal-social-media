import Head from "next/head";
import { useContext } from "react";
import { DataContext } from "../store/GlobalState";
import Post from "../components/Post";
import PostLoading from "../components/PostLoading";

export default function Home() {
  const {
    state: { posts },
    dispatch,
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
          <PostLoading />
        )}
      </div>
    </div>
  );
}
