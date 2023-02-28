document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    window.alert("Success adding new book.");
    addBook();
  });

  const searchForm = document.getElementById("searchBook");
  searchForm.addEventListener("submit", function(event) {
    event.preventDefault();
    searchBook();
  });

  if (isStorageExist) {
    loadDataFromStorage();
  }
});

const books = [];
const RENDER_EVENT = "render-books";

function addBook() {
  const bookTitle = document.getElementById("inputBookTitle").value;
  const bookAuthor = document.getElementById("inputBookAuthor").value;
  const bookYear = document.getElementById("inputBookYear").value;
  const inputCheckBox = document.getElementById("inputBookIsComplete");

  function generateCheckBox() {
    if (inputCheckBox.checked) {
      return true;
    } else {
      return false;
    }
  }

  const checkBox = generateCheckBox();
  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, checkBox);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function isChecked() {
  if (document.getElementById("inputBookIsComplete").checked) {
    document.getElementById("option").innerText = "Finish Read";
  } else {
    document.getElementById("option").innerText = "Not Finish Read yet";
  }
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookList = document.getElementById("incompleteBookshelfList");
  uncompletedBookList.innerHTML = "";

  const completedBookList = document.getElementById("completeBookshelfList");
  completedBookList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isCompleted) uncompletedBookList.append(bookElement);
    else completedBookList.append(bookElement);
  }
});

function makeBook(bookObject) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = "Author : " + bookObject.author;

  const textYear = document.createElement("p");
  textYear.innerText = "Year : " + bookObject.year;

  const articleButton = document.createElement("div");
  articleButton.classList.add("action");

  const article = document.createElement("article");
  article.classList.add("book_item");
  article.append(textTitle, textAuthor, textYear, articleButton);
  article.setAttribute("id", `${bookObject.id}`);

  if (bookObject.isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("btn-1");
    undoButton.innerText = "Not Finish Read yet";

    undoButton.addEventListener("click", function () {
      undoBookFromCompleted(bookObject.id);
      window.alert("Success move book.");
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("btn-2");
    trashButton.innerText = "Delete Book";

    trashButton.addEventListener("click", function () {
      removeBook(bookObject.id);
      window.alert("Success Deleting the Book Choses");
    });

    articleButton.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("btn-1");
    checkButton.innerText = "Finish Read";

    checkButton.addEventListener("click", function () {
      addBookToCompleted(bookObject.id);
      window.alert("Success move book.");
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("btn-2");
    trashButton.innerText = "Delete Book";

    trashButton.addEventListener("click", function () {
      removeBook(bookObject.id);
      window.alert("Success Deleting the Book Chose.");
    });

    articleButton.append(checkButton, trashButton);
  }

  return article;
}

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
      
    }
  }
  return null;
}

function removeBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData;
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

const SAVED_EVENT = "saved-book";
const STORAGE_KEY = " BOOK_APPS";

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Your browser not support for local storage!");
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

