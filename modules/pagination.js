import search from "./search.js";

const pageSizeSelectEl = document.getElementById("page-size-select");
const firstPageBtn = document.querySelector(".pagination-first-arrow");
const prevPageBtn = document.querySelector(".pagination-prev");
const currPageBtn = document.querySelector(".pagination-current");
const nextPageBtn = document.querySelector(".pagination-next");
const lastPageBtn = document.querySelector(".pagination-last-arrow");

export const pagination = {
  limit: 10,
  page: 1,
  lastPage: 1,
  updatePageNrs: function () {
    prevPageBtn.textContent = this.page === 1 ? "" : this.page - 1;
    currPageBtn.textContent = this.page;
    nextPageBtn.textContent = this.page === this.lastPage ? "" : this.page + 1;
  },
};

pageSizeSelectEl.addEventListener("change", (e) => {
  pagination.limit = +e.target.value;
  pagination.page = 1;
  search();
});

firstPageBtn.addEventListener("click", () => {
  pagination.page = 1;
  search();
});

prevPageBtn.addEventListener("click", () => {
  pagination.page -= 1;
  search();
});

nextPageBtn.addEventListener("click", () => {
  pagination.page += 1;
  search();
});

lastPageBtn.addEventListener("click", () => {
  pagination.page = pagination.lastPage;
  search();
});
