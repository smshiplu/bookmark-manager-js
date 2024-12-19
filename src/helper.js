import Toastify from 'toastify-js';

export const handleSelectOption = (arr, elem) => {
  arr.forEach(category => {
    const option = document.createElement("option");
    const text = document.createTextNode(category.name);
    option.appendChild(text);
    elem.appendChild(option);
  })
}

export const generateUserMenu = (parentElem, user) => {
  parentElem.firstChild.textContent = user.email;
}

export const handleUserMenuToggle = (showHideElem) => {
  if(showHideElem.classList.contains("invisible")) {
    showHideElem.classList.remove("invisible");
  } else {
    showHideElem.classList.add("invisible");
  }
}

export const generateSelectOption = (arr, elem) => {
  // remove "All" category from categoryList
  const temp = arr.slice(1, arr.length); 
  temp.forEach(item => {
    elem.innerHTML += `<option>${item.name}</option>`
  });
}

const generateFilterBtnTemplate = (category) => {
  return `<button type="button" data-id="${category.id}" data-name="${category.name}" class="${category.id == 0 ? "active" : ""} filterBtn shadow-xs group py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-gray-100 rounded-full border border-gray-200 hover:bg-blue-700 hover:text-white focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 [&.active]:bg-blue-700 [&.active]:text-white dark:text-gray-400 dark:border-gray-600 dark:hover:text-white [&.active]:dark:text-white dark:hover:bg-blue-700 flex items-center justify-between gap-2 z-10"><span>${ category.icon.includes("w-6 h-6") ? category.icon.replace("w-6 h-6 text-gray-800", "w-4 h-4 group-[.active]:text-white") : category.icon.replace("w-5 h-5 text-gray-800", "w-4 h-4 group-[.active]:text-white") }</span>${category.name}</button>`;
}

export const addFilterToDom = (arr, elem) => {
  elem.innerHTML = "";
  arr.forEach((category) => {
    elem.innerHTML += generateFilterBtnTemplate(category);
  })
}

export const removeFilterBtnActiveClass = (htmlCollection) => {
  htmlCollection.forEach(btn => {
    btn.classList.remove("active");
  })
}

export const addBookmarkCardToDom = (arr, elem) => {
  elem.innerHTML = "";
  arr.length > 0 && arr.forEach( (bookmark) => {
    elem.innerHTML += generateTemplate(bookmark);
  });
} 

export const generateTemplate = (bookmark) => {
  //Convert firebase serverTimestamp to Javascript Date Time 
  const createdAtTimestamp = bookmark.createdAt ? (bookmark.createdAt.seconds + bookmark.createdAt.nanoseconds * 10 ** -9) * 1000 : new Date().toLocaleDateString();
  const updatedAtTimestamp = bookmark.updatedAt ? (bookmark.updatedAt.seconds + bookmark.updatedAt.nanoseconds * 10 ** -9) * 1000 : new Date().toLocaleDateString();
  
  const createdAt = new Date(createdAtTimestamp).toLocaleDateString();
  const updatedAt = new Date(updatedAtTimestamp).toLocaleDateString();

  return `
    <div class="card max-w-80 w-full shadow-md border rounded p-2 dark:bg-slate-800 bg-gray-50">
      <div class="flex flex-col items-start justify-start mb-4 relative">
        ${ bookmark.title.length > 34 ? 
          `<div class="tooltip invisible absolute -top-4 -translate-y-full left-1/2 -translate-x-1/2 inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-500 bg-gray-900 rounded-lg shadow-sm opacity-0 dark:bg-gray-700 text-left w-full">${bookmark.title}<svg class="w-6 h-6 text-gray-900 dark:text-gray-700 absolute -bottom-3 left-1/2 -translate-x-1/2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M18.425 10.271C19.499 8.967 18.57 7 16.88 7H7.12c-1.69 0-2.618 1.967-1.544 3.271l4.881 5.927a2 2 0 0 0 3.088 0l4.88-5.927Z" clip-rule="evenodd"/></svg>
          </div>` : "" }

        <p class="title line-clamp-1 text-left font-semibold dark:text-white overflow-hidden">${bookmark.title}</p>
        <span class="text-xs text-gray-600 italic">${updatedAtTimestamp == createdAtTimestamp ? `Created At: ${createdAt}` : `Updated At: ${updatedAt}`}</span>
      </div>
      <div class="flex items-center justify-between">
        <span>${bookmark.icon}</span>
        <span class="flex-1 flex items-center justify-end gap-2">
          <select data-id="${bookmark.id}" class="status text-xs w-18 bg-gray-50 dark:bg-slate-800 dark:text-white outline-none">
            <option ${bookmark.status == "Pending" ? "selected" : ""}>Pending</option>
            <option ${bookmark.status == "Ongoing" ? "selected" : ""}>Ongoing</option>
            <option ${bookmark.status == "Completed" ? "selected" : ""}>Completed</option>
          </select>
          <a href="${bookmark.url}" target="_blank">
            <svg class="w-4 h-4 text-sky-800 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 14v4.833A1.166 1.166 0 0 1 16.833 20H5.167A1.167 1.167 0 0 1 4 18.833V7.167A1.166 1.166 0 0 1 5.167 6h4.618m4.447-2H20v5.768m-7.889 2.121 7.778-7.778"/>
            </svg>
          </a>
          <a href="https://www.google.com/search?q=${bookmark.title}" target="_blank">
            <svg class="w-4 h-4 text-blue-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M12.037 21.998a10.313 10.313 0 0 1-7.168-3.049 9.888 9.888 0 0 1-2.868-7.118 9.947 9.947 0 0 1 3.064-6.949A10.37 10.37 0 0 1 12.212 2h.176a9.935 9.935 0 0 1 6.614 2.564L16.457 6.88a6.187 6.187 0 0 0-4.131-1.566 6.9 6.9 0 0 0-4.794 1.913 6.618 6.618 0 0 0-2.045 4.657 6.608 6.608 0 0 0 1.882 4.723 6.891 6.891 0 0 0 4.725 2.07h.143c1.41.072 2.8-.354 3.917-1.2a5.77 5.77 0 0 0 2.172-3.41l.043-.117H12.22v-3.41h9.678c.075.617.109 1.238.1 1.859-.099 5.741-4.017 9.6-9.746 9.6l-.215-.002Z" clip-rule="evenodd"/>
            </svg>
          </a>
          <button data-id="${bookmark.id}" class="deleteBtn inline-flex ">
            <svg  class="w-4 h-4 text-rose-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
            </svg>
          </button>
        </span>
      </div>
    </div>`
}

export const handleTooltip = (htmlCollection) => {
  htmlCollection.forEach(title => {
    title.addEventListener("mouseover", e => {
      if(title.previousElementSibling) {
        title.previousElementSibling.classList.remove("opacity-0");
        title.previousElementSibling.classList.remove("invisible");
        title.previousElementSibling.classList.add("visible");
        title.previousElementSibling.classList.add("opacity-100");
      }
    }, false);
    title.addEventListener("mouseout", e => {
      if(title.previousElementSibling) {
        title.previousElementSibling.classList.add("opacity-0");
        title.previousElementSibling.classList.add("invisible");
        title.previousElementSibling.classList.remove("opacity-100");
        title.previousElementSibling.classList.remove("visible");
      }
    }, false);
  });
}

export const validateForm = (arr) => {
  let pass = true;
  const expression = new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/);

  for (let index = 0; index < arr.length; index++) {
    const element = arr[index];
    if(!element.value || element.value === "Choose Category") {
      pass = false;
      toastMessage(element.dataset.error, "error")
      break;
    }
    
    if( element.name == "url" ) {
      if (!expression.test(element.value)) {
        pass = false;
        toastMessage("Enter a valid url", "error");
        break;
      }
    }
  }
  return pass;
}

export const toastMessage = (message, type) => {
  Toastify({
    text: message,
    close: true,
    gravity: "top",
    position: "center",
    stopOnFocus: true,
    className: `${type === "success" ? "text-green-600" : type === "error" ? "text-rose-600" : type === "warning" ? "text-orange-600" : "text-gray-500"} fixed flex items-center justify-between w-full max-w-sm p-4 space-x-4 bg-gray-50 divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow left-1/2 -translate-x-1/2 transition-translate   dark:divide-gray-700 dark:bg-gray-800 text-sm font-normal z-40`,
    offset: {
      x: "50%",
      y: 10
    }
  }).showToast();
}

export const loadingFull = (boolean) => {
  const divElement = document.createElement("div");
  divElement.className += "loading-full overlay fixed w-full h-full top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-gray-900 bg-opacity-90 z-50";
  if(boolean) {
    const innerDiv = document.createElement("div");
    innerDiv.className =+ "bg-white max-w-32 w-full";

    innerDiv.innerHTML =`<svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg><span class="sr-only">Loading...</span>`;

    divElement.appendChild(innerDiv);
    document.querySelector("body").appendChild(divElement);
  } else {
    const loadingFull = document.querySelector(".loading-full");
    loadingFull && loadingFull.remove();
  }

}

export const handleDarkMode = (htmlCollection) => {
  const storageValue = JSON.parse(localStorage.getItem("bookmark-manager-js-dark-mode"));
  let darkModeToggle = storageValue != null || storageValue != "undefined" ? storageValue : false;
  
  if(darkModeToggle) {
    if(!document.querySelector("html").classList.contains("dark")) {
      document.querySelector("html").classList.add("dark");
    } else {
      document.querySelector("html").classList.remove("dark");
    }
  } else {
    document.querySelector("html").classList.remove("dark");
  }
  htmlCollection.forEach( item => {
    item.addEventListener("click", e => {
      darkModeToggle = !darkModeToggle;
      if(darkModeToggle) {
        document.querySelector("html").classList.add("dark");
        localStorage.setItem("bookmark-manager-js-dark-mode", JSON.stringify(true));
      } else {
        document.querySelector("html").classList.remove("dark");
        localStorage.setItem("bookmark-manager-js-dark-mode", JSON.stringify(false));
      }
    });
  } )

}
