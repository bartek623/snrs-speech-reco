import search from "./search.js";
import { getSelectedFilters } from "./utils.js";

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
  get brandsQuery() {
    return this.brand.length ? "brand IN " + JSON.stringify(this.brand) : "";
  },
  get categoryQuery() {
    return this.category.length
      ? "category IN " + JSON.stringify(this.category)
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
export const updateAvailableFilters = (
  availableBrands,
  availableCategories
) => {
  const brandSelectEl = brandFilterCtrlEl.querySelector("#brand-filter");
  const categorySelectEl = catFilterCtrlEl.querySelector("#category-filter");
  brandSelectEl.innerHTML = "";
  categorySelectEl.innerHTML = "";

  availableBrands.forEach(([brand, available]) => {
    const brandOptionTemplate = `
    <li>
      <div>
        <input type="checkbox" id="${brand}" value="${brand}" />
        <label for="${brand}">${brand}</label>
        <span class="filter-available">${available}</span>
      </div>
    </li>`;
    brandSelectEl.insertAdjacentHTML("beforeend", brandOptionTemplate);
  });

  let currentParent = categorySelectEl;
  availableCategories.sort().forEach(([category, available]) => {
    const subcategories = category.split(">");
    const categoryName = subcategories.at(-1);
    const parentCategory = subcategories.at(-2);

    currentParent =
      currentParent.closest(`ul[data-category="${parentCategory}"]`) ||
      currentParent;

    currentParent.parentNode
      .querySelector("button")
      ?.classList.remove("hidden");

    const listItem = document.createElement("li");
    listItem.classList.add("collapsed");
    const childList = document.createElement("ul");
    childList.dataset.category = categoryName;
    const categoryOptionTemplate = `
    <div>
      <input type="checkbox" id="${category}" value="${category}" />
      <label for="${category}">${categoryName}</label>
      <span class="filter-available">${available}</span>
      <button class="hidden"><span class="material-symbols-rounded icon"> keyboard_arrow_up </span></button>
    </div>`;
    listItem.insertAdjacentHTML("beforeend", categoryOptionTemplate);
    listItem.insertAdjacentElement("beforeend", childList);

    listItem.querySelector("button").addEventListener("click", () => {
      listItem.classList.toggle("collapsed");
    });

    currentParent.insertAdjacentElement("beforeend", listItem);
    currentParent = childList;
  });
};

priceMinInputEl.addEventListener("change", (e) => {
  if (+e.target.value > +priceMaxInputEl.value)
    e.target.value = priceMaxInputEl.value;
  priceMaxInputEl.min = e.target.value;
  filters.priceMin = e.target.value;
  search(undefined, false, true);
});

priceMaxInputEl.addEventListener("change", (e) => {
  if (+e.target.value < +priceMinInputEl.value)
    e.target.value = priceMinInputEl.value;
  priceMinInputEl.max = e.target.value;
  filters.priceMax = e.target.value;
  search(undefined, false, true);
});

applyFiltersBtn.addEventListener("click", () => {
  filters.priceMin = priceMinInputEl.value;
  filters.priceMax = priceMaxInputEl.value;
  filters.category = getSelectedFilters(catFilterCtrlEl);
  filters.brand = getSelectedFilters(brandFilterCtrlEl);
  pagination.page = 1;

  closeModal();
  search();
});
