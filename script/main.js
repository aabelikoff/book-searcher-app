const libUrl = "https://openlibrary.org/search.json";
let offset = 0;
let total = 0;
const spin = new Spinner();

const bookSearchForm = document.forms["bookSearch"];
const resultElement = document.querySelector(".result-container");
const paginationElement = document.querySelector(".pagination");

bookSearchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  offset = 0;
  await renderResult();
});

bookSearchForm.addEventListener("change", async (e) => {
  if (e.target.id === "limit" && document.getElementById("results")) {
    await renderResult();
  }
});

paginationElement.addEventListener("click", (e) => {
  changePage(e.target.id);
});
//Returns API request result
async function getBooks({ title = "*", author = "*", offset, limit }) {
  try {
    spin.showSpinner();
    const response = await fetch(libUrl + `?author=${author}&title=${title}&offset=${offset}&limit=${limit}&lang=ua`);
    if (response.status != 200) {
      throw new Error(response.statusText);
    }
    const result = await response.json();
    if (!result["num_found"]) {
      throw new Error("There weren't found any books");
    }
    return result;
  } catch (error) {
    showErrorMessage(resultElement, error.message);
  } finally {
    spin.hideSpinner();
  }
}
//Prepearing parameters for API request from form
function getBookSearchFormInfo(offset) {
  try {
    const searchObj = {
      offset,
    };
    const formData = new FormData(bookSearchForm);
    let key = formData.get("searchBy");
    const value = formData.get("searchField");
    if (!value) {
      throw new Error("Please enter data into search field");
    }
    searchObj[key] = value;
    searchObj.limit = formData.get("limit");
    return searchObj;
  } catch (error) {
    showErrorMessage(resultElement, error.message);
  }
}
//
async function renderResult() {
  try {
    const searchObj = getBookSearchFormInfo(offset);
    let res = await getBooks(searchObj);
    if (!res) return; //we can use try for this part of code
    let { num_found, docs: bookArray } = res;
    total = num_found;
    resultElement.innerHTML = `<h6>We Found ${num_found} Books:</h6>`;
    const bookTableElem = createBookTable(offset, bookArray);
    resultElement.append(bookTableElem);
    createPaginationElement();
  } catch (error) {
    showErrorMessage(resultElement, "Check input");
  }
}
//Pagination
function createPaginationElement() {
  paginationElement.innerHTML = `<button class="col-2 btn" id='prev'><i class="fa-solid fa-angles-left"></i></button>
  <p class="col-md-4 col-8 mb-0 d-flex align-items-center justify-content-center"></p>
  <button class="col-2 btn" id='next'><i class="fa-solid fa-angles-right"></button>`;
  setPaginationInfo();
}

async function changePage(direction) {
  const limit = +bookSearchForm.elements["limit"].value;
  const offsetMax = total - limit;
  if (offsetMax < 0) return;
  switch (direction) {
    case "prev":
      offset = offset - limit > 0 ? (offset -= limit) : 0;
      break;
    case "next":
      offset = offset + limit < offsetMax ? (offset += limit) : offsetMax;
      break;
    default:
      return;
      break;
  }
  await renderResult();
  setPaginationInfo();
}

function setPaginationInfo() {
  const limit = +bookSearchForm.elements["limit"].value;
  const offsetMax = Math.ceil(total / limit);
  const infoElem = paginationElement.querySelector("p");
  infoElem.innerText = `${Math.ceil(offset / limit) + 1} page of ${offsetMax}`;
}
//Error message displaying
function showErrorMessage(container, message) {
  container.innerHTML = `<h3 class='text-danger text-center'>${message}</h3>`;
  paginationElement.innerHTML = "";
}
