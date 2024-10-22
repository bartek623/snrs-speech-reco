import search from "./search.js";

const filtersBtn = document.querySelector(".filters-btn");
const filtersModalOverlayEl = document.querySelector(".modal-overlay");
const filtersModalEl = document.querySelector(".filters-modal");
const filtersCloseBtn = filtersModalEl.querySelector(".modal-close-btn");

const pageSizeSelectEl = document.getElementById("page-size-select");
const firstPageBtn = document.querySelector(".pagination-first-arrow");
const prevPageBtn = document.querySelector(".pagination-prev");
const currPageBtn = document.querySelector(".pagination-current");
const nextPageBtn = document.querySelector(".pagination-next");
const lastPageBtn = document.querySelector(".pagination-last-arrow");

const sortSelectEl = document.getElementById("sorting-select");
const sortOrderBtn = document.querySelector(".sort-box button");

const brandFilterCtrlEl = filtersModalEl.querySelector(".filter-brand-ctrl");
const catFilterCtrlEl = filtersModalEl.querySelector(".filter-category-ctrl");
const filterInputCtrlEls = [brandFilterCtrlEl, catFilterCtrlEl];
const priceMinInputEl = filtersModalEl.querySelector("#price-min-filter");
const priceMaxInputEl = filtersModalEl.querySelector("#price-max-filter");
const applyFiltersBtn = filtersModalEl.querySelector(".apply-filters-btn");

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

export const sorting = {
  order: "asc",
  prop: "name",
};

export const filters = {
  brand: [],
  category: [],
  priceMin: 0,
  priceMax: 1000,
};

// Pagination
pageSizeSelectEl.addEventListener("change", (e) => {
  pagination.limit = e.target.value;
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

// Sorting
sortOrderBtn.addEventListener("click", function () {
  sortSelectEl.dataset.order =
    sortSelectEl.dataset.order === "asc" ? "desc" : "asc";
  sorting.order = sortSelectEl.dataset.order;
  search();
});

sortSelectEl.addEventListener("change", (e) => {
  sorting.prop = e.target.value;
  search();
});

// Modal handling
const closeModal = () => filtersModalOverlayEl.classList.add("hidden");
const openModal = () => filtersModalOverlayEl.classList.remove("hidden");

filtersBtn.addEventListener("click", openModal);
filtersCloseBtn.addEventListener("click", closeModal);
filtersModalOverlayEl.addEventListener("click", function (e) {
  if (e.target !== this) return;
  closeModal();
});

// Filters
filterInputCtrlEls.forEach((filterCtrl) => {
  const selectedContainer = filterCtrl.querySelector(
    ".selected-filters-container"
  );
  const inputEl = filterCtrl.querySelector("input");

  inputEl.addEventListener("keyup", function (e) {
    const brandName = this.value;
    if (e.key !== "Enter" || filters.brand.includes(brandName)) return;

    const brandItem = document.createElement("span");
    brandItem.classList.add("filter-item");
    brandItem.textContent = brandName;
    selectedContainer.appendChild(brandItem);
    this.value = "";
  });

  selectedContainer.addEventListener("click", (e) => {
    if (!e.target.matches(".filter-item")) return;
    e.target.remove();
  });
});

priceMinInputEl.addEventListener("change", (e) => {
  if (+e.target.value > +priceMaxInputEl.value)
    e.target.value = priceMaxInputEl.value;
  priceMaxInputEl.min = e.target.value;
});

priceMaxInputEl.addEventListener("change", (e) => {
  if (+e.target.value < +priceMinInputEl.value)
    e.target.value = priceMinInputEl.value;
  priceMinInputEl.max = e.target.value;
});

applyFiltersBtn.addEventListener("click", () => {
  filters.priceMin = priceMinInputEl.value;
  filters.priceMax = priceMaxInputEl.value;
  filters.brand = [...brandFilterCtrlEl.querySelectorAll(".filter-item")].map(
    (el) => el.textContent
  );
  filters.category = [...catFilterCtrlEl.querySelectorAll(".filter-item")].map(
    (el) => el.textContent
  );

  closeModal();
  search();
});
