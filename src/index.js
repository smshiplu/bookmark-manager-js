import "./style.css";
import favicon from  "./images/icon.png";

import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup} from "firebase/auth";
import { onSnapshot, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import { validateForm, addBookmarkCardToDom, handleDarkMode, handleUserMenuToggle, generateUserMenu, generateSelectOption, addFilterToDom, removeFilterBtnActiveClass, handleTooltip } from "./helper";
import { auth, bookmarkListRef, addBookmark, updateBookmark, deleteBookmark, getAllBookmarks, getBookmarksByCategory } from "./firebase";
import { categoryList } from "./data";


const provider = new GoogleAuthProvider();

const linkTag = document.querySelector("link");
const whenLoggedIn = document.querySelector(".whenLoggedIn");
const whenLoggedOut = document.querySelector(".whenLoggedOut");
const signInBtn = document.querySelector(".signInBtn");
const userMenuBtn = document.querySelector(".userMenuBtn");
const dropdown = document.querySelector(".dropdown");
const category = document.querySelector(".category");
const dropdownUl = document.querySelector(".dropdown > ul");
const logOutBtn = document.querySelector(".logOutBtn");
const addForm = document.querySelector(".addForm");
const cards = document.querySelector(".cards");
const filter = document.querySelector(".filter");
const themeToggleBtn = document.querySelectorAll(".themeToggleBtn")



linkTag.href = favicon;

onAuthStateChanged(auth, user => {
  if (user) {
    // console.log("User Logged In");
    if (window.location.pathname != "/") {
      window.location.href = "/";
    }
    
    whenLoggedIn.hidden = false;
    whenLoggedOut.hidden = true;

    generateUserMenu(dropdownUl, user);
    generateSelectOption(categoryList, category);
    handleDarkMode(themeToggleBtn);
    userMenuBtn.addEventListener("click", e => handleUserMenuToggle(dropdown));

    logOutBtn.addEventListener("click",  e => {
      auth.signOut()
      .then(() => {
        whenLoggedOut.hidden = false;
        whenLoggedIn.hidden = true;
        location.reload(true);
      })
      .catch(error => {
        console.log(error);
      })

    });

    const showBookmark = async ( dataArray ) => {
 
      if(!dataArray) {
        const bookmarks = await getAllBookmarks(user.uid);
        addBookmarkCardToDom(bookmarks, cards);
      } else {
        addBookmarkCardToDom(dataArray, cards);
      }

      function deleteItem () {
        const deleteBtnCollection = document.querySelectorAll(".deleteBtn");
        deleteBtnCollection && deleteBtnCollection.forEach(btn => {
          btn.addEventListener("click", async e => {
            if(confirm("Are you sure to delete?")) {
              await deleteBookmark(btn.dataset.id);
              const data = await getAllBookmarks(user.uid);
              // addBookmarkCardToDom(data, cards);
              showBookmark(data);
              const titleHtmlCollection = document.querySelectorAll(".title");
              handleTooltip(titleHtmlCollection);
            }
          });
        });
      }
      deleteItem ();

      function updateItem () {
        const selectTagCollection = document.querySelectorAll(".status");
        selectTagCollection && selectTagCollection.forEach(select => {
          select.addEventListener("change", async e => {
            await updateBookmark(select.dataset.id, select.value);
            const data = await getAllBookmarks(user.uid);
            // addBookmarkCardToDom(data, cards);
            showBookmark(data);
            const titleHtmlCollection = document.querySelectorAll(".title");
            handleTooltip(titleHtmlCollection);
          }, false);
        })
      }
      updateItem();
    }
    showBookmark();

    const queryBookmarkList = query(bookmarkListRef, where("uid", "==", user.uid), orderBy("createdAt"));
    onSnapshot(queryBookmarkList, data => {
      const bookmarks = [];
      data.docs.forEach(data => {
        bookmarks.push({...data.data()});
      })
      
      const availableCategoriesInDB = bookmarks.filter(item => item.category).map(({category}) => category);
      const uniqueAvailableCategoriesInDB = [...new Set(availableCategoriesInDB)];
      const categories = categoryList.filter( item => uniqueAvailableCategoriesInDB.includes(item.name));
      if(categories.length > 0) {
        categories.unshift(categoryList[0]);
      }
      addFilterToDom(categories, filter);
      
      const filterBtnCollection = document.querySelectorAll(".filterBtn");
      filterBtnCollection.forEach(btn => {
        btn.addEventListener("click", async e => {
          removeFilterBtnActiveClass(filterBtnCollection);
          btn.classList.add("active");
          if(btn.dataset.name !== "All") {
            const queryBookmarkList = query(
              bookmarkListRef, 
              where("uid", "==", user.uid),
              where("category", "==", btn.dataset.name),
              orderBy("createdAt"));

            const data = await getBookmarksByCategory(queryBookmarkList);
            // addBookmarkCardToDom(data, cards);
            showBookmark(data);
            const titleHtmlCollection = document.querySelectorAll(".title");
            handleTooltip(titleHtmlCollection);
          } else {
            const data = await getAllBookmarks(user.uid);
            // addBookmarkCardToDom(data, cards);
            showBookmark(data);
            const titleHtmlCollection = document.querySelectorAll(".title");
            handleTooltip(titleHtmlCollection);
          }
        });
      });

      const titleHtmlCollection = document.querySelectorAll(".title");
      handleTooltip(titleHtmlCollection);
    });

    addForm.addEventListener("submit", async e => {
      e.preventDefault();
      const allField = Array.from(document[e.target.name].elements);
      const selectedFields = allField.slice(0, allField.length - 1);
      const isValidate = validateForm(selectedFields);
      if(isValidate) {
        const formData = {
          uid: user.uid,
          title: addForm.title.value,
          url: addForm.url.value,
          category: addForm.category.value,
          status: "Pending",
          themeColor: categoryList.filter(item => item.name === addForm.category.value).map(({theme_color}) => theme_color).toString(),
          icon: categoryList.filter(item => item.name === addForm.category.value).map(({icon}) => icon).toString(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }
        try {
          await addBookmark(formData);
          addForm.reset();
          const bookmarks = await getAllBookmarks(user.uid);
          showBookmark(bookmarks);
          const titleHtmlCollection = document.querySelectorAll(".title");
          handleTooltip(titleHtmlCollection);
        } catch (error) {
          console.log(error);
        }
      }
    });

  } else {
    // console.log("User Logged Out");
    if (window.location.pathname != "/") {
      window.location.href = "/";
    }
    
    whenLoggedOut.hidden = false;
    whenLoggedIn.hidden = true;
    signInBtn.addEventListener("click", async e => {
      await signInWithPopup(auth, provider)
      .then(() => {
        whenLoggedIn.hidden = false;
        whenLoggedOut.hidden = true;
        location.reload(true);
      })
      .catch(error => {
        console.log(error);
      })
    });
  }

});




