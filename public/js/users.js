// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, signOut, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
   apiKey: "AIzaSyBdLyfRnWZ9DlGPbgBq3iE7bGkx81E8ULc",
   authDomain: "web501-1fb4c.firebaseapp.com",
   databaseURL: "https://web501-1fb4c-default-rtdb.asia-southeast1.firebasedatabase.app",
   projectId: "web501-1fb4c",
   storageBucket: "web501-1fb4c.appspot.com",
   messagingSenderId: "986420707541",
   appId: "1:986420707541:web:ed636c48176d233b22e25c",
   measurementId: "G-SELR0DZZBG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Start code
if(document.cookie){
   console.log(document.cookie.split("=")[1]);
   $('#loggedIn').show();
   $('#notLoggedIn').hide();
}  else {
   $('#loggedIn').hide();
   $('#notLoggedIn').show();
   console.log('Not logged in');
   // signInWithRedirect(provider);
}
$('#login').click(() => {
   if(auth.currentUser){
      console.log('logged in');
      console.log(auth.currentUser);
   } else {
      signInWithPopup(auth, provider)
         .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // ...
            document.cookie = `uid=${user.uid}; path=/`;
            location.reload();
         }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
         });
   }
});
$('#logout').click(() => {
   signOut(auth).then(() => {
      // Sign-out successful.
      document.cookie = `uid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
      location.reload();
   }).catch((error) => {
      // An error happened.
      console.log(error);
   });
});