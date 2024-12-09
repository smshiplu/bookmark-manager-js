import { initializeApp } from "firebase/app";
import { 
  getFirestore,
  collection,
  getDocs,
  addDoc,
  where,
  query,
  orderBy,
  updateDoc,
  doc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";

import { getAuth } from "firebase/auth";

import { toastMessage, loadingFull } from "./helper";


const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.API_ID
};


export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); 
export const bookmarkListRef = collection(db, "bookmark_list");


export const addBookmark = async (formData) => {
  loadingFull(true);
  await addDoc(bookmarkListRef, {...formData})
    .then(() => {
      loadingFull(false);
      toastMessage("Added successfully", "success");
    })
    .catch(error => {
      loadingFull(false);
      toastMessage(error.message, "error");
    })
}

export const getAllBookmarks = async (uid) => {
  loadingFull(true);
  const queryBookmarkList = query(bookmarkListRef, where("uid", "==", uid), orderBy("createdAt"));
  const bookmarkList = [];
  await getDocs(queryBookmarkList)
    .then( data => {
      data.docs.forEach(bookmark => {
        bookmarkList.push({...bookmark.data(), id: bookmark.id});
      });
      loadingFull(false);
    })
    .catch( error => {
      loadingFull(false);
      toastMessage(error, "error");
    })
  return bookmarkList;
}

export const getBookmarksByCategory = async (query) => {
  loadingFull(true);
  const bookmarkList = [];
  await getDocs(query)
    .then( data => {
      data.docs.forEach(bookmark => {
        bookmarkList.push({...bookmark.data(), id: bookmark.id});
      });
      loadingFull(false);
    })
    .catch( error => {
      loadingFull(false);
      console.log(error);
      toastMessage(error, "error");
    });
    return bookmarkList;
}

export const updateBookmark = async (id, value) => {
  loadingFull(true);
  const docRef = doc(db, "bookmark_list", id);
  updateDoc(docRef, {
    status: value,
    updatedAt: serverTimestamp()
  })
  .then(() => {
    loadingFull(false);
    toastMessage("Bookmark updated", "success");
  })
  .catch(error => {
    loadingFull(false);
    toastMessage(error, "error");
  })
}

export const deleteBookmark = async (id) => {
  loadingFull(true);
  const docRef = doc(db, "bookmark_list", id);
  await deleteDoc(docRef)
  .then(() => {
    loadingFull(false);
    toastMessage("Bookmark deleted", "success");
  })
  .catch(error => {
    loadingFull(false);
    toastMessage(error, "error");
  })
} 
