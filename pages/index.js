import Head from "next/head";
import {
  auth,
  googleProvider,
  facebookProvider,
  githubProvider,
} from "../firebase.js";

export default function Home() {
  const fb = () => {
    // facebookProvider.addScope("user_birthday");
    auth.signInWithPopup(facebookProvider).then(function (result) {
      // This gives you a Facebook Access Token.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      console.log(user, token);
    });
  };

  const google = () => {
    googleProvider.addScope("profile");
    googleProvider.addScope("email");
    auth.signInWithPopup(googleProvider).then(function (result) {
      // This gives you a Facebook Access Token.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      console.log(user, token);
    });
  };

  const github = () => {
    githubProvider.addScope("repo");
    auth
      .signInWithPopup(githubProvider)
      .then(function (result) {
        // This gives you a GitHub Access Token.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log(user);
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        if (errorCode === "auth/account-exists-with-different-credential") {
          alert("You have signed up with a different provider for that email.");
          // Handle linking here if your app allows it.
        } else {
          console.error(error);
        }
      });
  };

  return (
    <>
      <Head>
        <title>Social Media</title>
      </Head>

      <div className="Hello">
        <button onClick={fb}>FB</button>
        <button onClick={google}>Google</button>
        <button onClick={github}>Github</button>
      </div>
    </>
  );
}
