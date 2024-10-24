import { CATEGORY_DICT } from "../config.js";
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

const mapCategories = (categories) =>
  categories.flatMap((category) => CATEGORY_DICT[category] ?? []);

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

const tempFilters = {
  brand: [],
  category: [],
  priceMin: 0,
  priceMax: 1000,
};

export const filters = {
  brand: [],
  category: [],
  priceMin: 0,
  priceMax: 1000,
  get brandsQuery() {
    return this.brand.length ? "brand IN " + JSON.stringify(this.brand) : "";
  },
  get categoryQuery() {
    return this.category.length
      ? "category IN " + JSON.stringify(mapCategories(this.category))
      : "";
  },
  get priceQuery() {
    return "price FROM " + this.priceMin + " TO " + this.priceMax;
  },
  get filtersQuery() {
    return [this.brandsQuery, this.categoryQuery, this.priceQuery]
      .filter((filter) => filter)
      .join(" AND ");
  },
};

// Pagination
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

// Sorting
sortOrderBtn.addEventListener("click", function () {
  sortSelectEl.dataset.order =
    sortSelectEl.dataset.order === "asc" ? "desc" : "asc";
  sorting.order = sortSelectEl.dataset.order;
  search();
});

sortSelectEl.addEventListener("change", (e) => {
  sorting.prop = e.target.value;
  pagination.page = 1;
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
const applyAttrFilter = (filterCtrl) => {
  const inputEl = filterCtrl.querySelector("input");
  const selectedContainerEl = filterCtrl.querySelector(
    ".selected-filters-container"
  );

  const propAttr = filterCtrl.dataset.attribute;
  const propName = inputEl.value.toLowerCase().trim();
  if (tempFilters[propAttr].includes(propName) || !propName) return;

  const propItem = document.createElement("span");
  propItem.classList.add("filter-item");
  propItem.textContent = propName;
  tempFilters[propAttr].push(propName);
  selectedContainerEl.appendChild(propItem);
  inputEl.value = "";
};

filterInputCtrlEls.forEach((filterCtrl) => {
  const selectedContainer = filterCtrl.querySelector(
    ".selected-filters-container"
  );
  const inputEl = filterCtrl.querySelector("input");

  inputEl.addEventListener("keyup", function (e) {
    if (e.key !== "Enter") return;
    applyAttrFilter(filterCtrl);
  });

  selectedContainer.addEventListener("click", (e) => {
    if (!e.target.matches(".filter-item")) return;
    const propAttr = filterCtrl.dataset.attribute;
    tempFilters[propAttr].splice(
      tempFilters[propAttr].indexOf(e.target.textContent),
      1
    );
    e.target.remove();
  });
});

priceMinInputEl.addEventListener("change", (e) => {
  if (+e.target.value > +priceMaxInputEl.value)
    e.target.value = priceMaxInputEl.value;
  priceMaxInputEl.min = e.target.value;
  tempFilters.priceMin = e.target.value;
});

priceMaxInputEl.addEventListener("change", (e) => {
  if (+e.target.value < +priceMinInputEl.value)
    e.target.value = priceMinInputEl.value;
  priceMinInputEl.max = e.target.value;
  tempFilters.priceMax = e.target.value;
});

applyFiltersBtn.addEventListener("click", () => {
  applyAttrFilter(brandFilterCtrlEl);
  applyAttrFilter(catFilterCtrlEl);

  filters.priceMin = tempFilters.priceMin;
  filters.priceMax = tempFilters.priceMax;
  filters.category = tempFilters.category;
  filters.brand = tempFilters.brand;
  pagination.page = 1;

  closeModal();
  search();
});
