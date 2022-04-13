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

import { FireBaseService } from "./firebaseService.js";
const fb = new FireBaseService();

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Start code
const curUser = async (uid) => {
   let res_usr = await fb.getWithOpt('users', `?orderBy="uid"&equalTo="${uid}"`);
   let usr = await res_usr.json();
   Object.keys(usr).forEach(function (key) {
      let usr_data = usr[key];
      if (usr_data.status == 1) {
         $('#user_photo').attr('src', usr_data.photo);
         $('#loggedIn').attr('title', usr_data.name);
      } else {
         signOut(auth).then(() => {
            // Sign-out successful.
            document.cookie = `uid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
            alert('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ admin để biết thêm chi tiết.');
            location.reload();
         }).catch((error) => {
            // An error happened.
            console.log(error);
         });
      }
   });
}

if (document.cookie) {
   curUser(document.cookie.split('=')[1]);
   $('#loggedIn').show();
   $('#notLoggedIn').hide();
} else {
   $('#loggedIn').hide();
   $('#notLoggedIn').show();
   console.log('Not logged in');
}
$('#login').click(() => {
   if (!auth.currentUser) { // If user is not logged in
      signInWithPopup(auth, provider)
         .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // ...
            document.cookie = `uid=${user.uid}; path=/`;
            // Check if user exists
            checkUser(user);
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

var checkUser = async (user) => {
   let res1 = await fb.getWithOpt('users', `?orderBy="id"&limitToLast=1`);
   let data = await res1.json();
   let last_id = data[Object.keys(data)[0]].id;
   let res_usr = await fb.getWithOpt('users', `?orderBy="uid"&equalTo="${user.uid}"`);
   let usr = await res_usr.json();
   if (jQuery.isEmptyObject(usr)) {
      console.log('Create new user');
      let usr_data = JSON.stringify({
         id: parseInt(last_id) + 1,
         uid: user.uid,
         name: user.displayName,
         email: user.email,
         photo: user.photoURL,
         permission: 0,
         status: 1
      });
      await fb.add('users', usr_data);
   } else {
      console.log('User already exists');
   }
}