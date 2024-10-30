import { pagination } from "./pagination.js";
import search from "./search.js";

const filtersBtn = document.querySelector(".filters-btn");
const filtersModalOverlayEl = document.querySelector(".modal-overlay");
const filtersModalEl = document.querySelector(".filters-modal");
const filtersCloseBtn = filtersModalEl.querySelector(".modal-close-btn");

const brandFilterCtrlEl = filtersModalEl.querySelector(".filter-brand-ctrl");
const catFilterCtrlEl = filtersModalEl.querySelector(".filter-category-ctrl");
const priceMinInputEl = filtersModalEl.querySelector("#price-min-filter");
const priceMaxInputEl = filtersModalEl.querySelector("#price-max-filter");
const applyFiltersBtn = filtersModalEl.querySelector(".apply-filters-btn");

const clearBrandFilterBtn =
  brandFilterCtrlEl.querySelector(".clear-filter-btn");
const clearCategoryFilterBtn =
  catFilterCtrlEl.querySelector(".clear-filter-btn");

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
const getBrandContent = (brand, available) => {
  const isChecked = filters.brand.includes(brand);
  return `
    <div>
      <input type="checkbox" id="${brand}" value="${brand}"
      ${isChecked ? "checked" : ""} />
      <label for="${brand}">${brand}</label>
      <span class="filter-available">${available}</span>
    </div>`;
};

const addBrandFilter =
  (parent) =>
  ([brand, available]) => {
    const listItem = document.createElement("li");
    const brandOptionTemplate = getBrandContent(brand, available);
    listItem.insertAdjacentHTML("beforeend", brandOptionTemplate);

    listItem.querySelector("input").addEventListener("change", (e) => {
      if (e.target.checked) {
        filters.brand.push(brand);
      } else {
        filters.brand.splice(filters.brand.indexOf(brand), 1);
      }
      search(undefined, false, true, ["category"]);
    });

    parent.insertAdjacentElement("beforeend", listItem);
  };

const getCategoryContent = (category, available) => {
  const categoryName = category.split(">").at(-1);
  const isChecked = filters.category.some((el) => category.includes(el));
  return `<div>
            <input type="checkbox" id="${category}" value="${category}"
            ${isChecked ? "checked" : ""} />
            <label for="${category}">${categoryName}</label>
            <span class="filter-available">${available}</span>
            <button class="hidden"><span class="material-symbols-rounded icon"> keyboard_arrow_up </span></button>
          </div>`;
};

const setIndeterminate = (parent) => {
  const checkbox = parent.querySelector("input");
  if (checkbox.checked) return;

  // if any children checked
  if (
    parent.querySelector(`ul[data-category="${checkbox.value}"] input:checked`)
  )
    checkbox.indeterminate = true;
  // if no children checked
  else checkbox.indeterminate = false;
};

const addCategoryHandler = (parent, category, listItem) => {
  const subcategories = category.split(">");
  // check all child categories
  const childCategoryEls = listItem.querySelectorAll("input");
  childCategoryEls.forEach((input) => {
    input.checked = true;
    const filterIndex = filters.category.indexOf(input.value);
    if (filterIndex >= 0) filters.category.splice(filterIndex, 1);
  });

  // push only parent
  filters.category.push(category);

  // check for parents if all its children are checked
  subcategories.slice(0, -1).forEach((_, i, categories) => {
    const levelCategory = categories.slice(0, categories.length - i).join(">");
    const levelParent = parent.querySelector(
      `li[data-category="${levelCategory}"]`
    );
    const levelParentCheckbox = levelParent.querySelector("input");

    // if all children checked
    if (
      !levelParent.querySelector(
        `ul[data-category="${levelCategory}"] input:not(:checked)`
      )
    ) {
      levelParentCheckbox.checked = true;
      levelParentCheckbox.indeterminate = false;
      [...filters.category].forEach((filter) => {
        const filterIndex = filters.category.indexOf(filter);
        if (
          levelParent.querySelector(
            `li[data-category="${filter}"] > div > input`
          )
        )
          filters.category.splice(filterIndex, 1);
      });
      filters.category.push(levelCategory);
    }

    setIndeterminate(levelParent);
  });
};

const removeCategoryHandler = (parent, category, listItem) => {
  const subcategories = category.split(">");
  subcategories.forEach((_, i, categories) => {
    // uncheck parents for each level and remove from filters
    const levelCategory = categories.slice(0, i + 1).join(">");
    const levelParent = parent.querySelector(
      `li[data-category="${levelCategory}"]`
    );
    const levelParentCheckbox = levelParent.querySelector("input");

    const filterIndex = filters.category.indexOf(levelParentCheckbox.value);
    if (filterIndex >= 0) filters.category.splice(filterIndex, 1);
    if (!levelParentCheckbox.checked) return;
    levelParentCheckbox.checked = false;

    // push all siblings category to filters
    levelParent
      .querySelectorAll(
        `ul[data-category="${levelCategory}"] > li > div > input`
      )
      .forEach((categoryItem) => {
        if (categoryItem.value === category) return;
        filters.category.push(categoryItem.value);
      });
  });

  // uncheck all children
  listItem
    .querySelectorAll("input")
    .forEach((input) => (input.checked = false));

  parent.querySelectorAll("li").forEach((item) => setIndeterminate(item));
};

const addCategoryFilter = (parent) => {
  let currentParent = parent;
  return ([category, available]) => {
    const subcategories = category.split(">");
    const parentCategory = subcategories.slice(0, -1).join(">");

    currentParent =
      currentParent.closest(`ul[data-category="${parentCategory}"]`) ||
      currentParent;

    currentParent.parentNode
      .querySelector("button")
      ?.classList.remove("hidden");

    const listItem = document.createElement("li");
    listItem.classList.add("collapsed");
    listItem.dataset.category = category;
    const childList = document.createElement("ul");
    childList.dataset.category = category;
    const categoryOptionTemplate = getCategoryContent(category, available);
    listItem.insertAdjacentHTML("beforeend", categoryOptionTemplate);
    listItem.insertAdjacentElement("beforeend", childList);

    listItem.querySelector("input").addEventListener("change", (e) => {
      if (e.target.checked) addCategoryHandler(parent, category, listItem);
      else removeCategoryHandler(parent, category, listItem);

      search(undefined, false, true, ["brand"]);
    });
    listItem.querySelector("button").addEventListener("click", () => {
      listItem.classList.toggle("collapsed");
    });

    currentParent.insertAdjacentElement("beforeend", listItem);
    currentParent = childList;
  };
};

export const updateAvailableFilters = (
  availableBrands,
  availableCategories
) => {
  const brandFiltersEl = brandFilterCtrlEl.querySelector("#brand-filter");
  const categoryFiltersEl = catFilterCtrlEl.querySelector("#category-filter");
  if (availableBrands.length) brandFiltersEl.innerHTML = "";
  if (availableCategories.length) categoryFiltersEl.innerHTML = "";

  availableBrands.forEach(addBrandFilter(brandFiltersEl));
  availableCategories.forEach(addCategoryFilter(categoryFiltersEl));
};

clearBrandFilterBtn.addEventListener("click", () => {
  filters.brand.splice(0, filters.brand.length);
  search(undefined, false, true);
});
clearCategoryFilterBtn.addEventListener("click", () => {
  filters.category.splice(0, filters.category.length);
  search(undefined, false, true);
});

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
  pagination.page = 1;

  closeModal();
  search(undefined, true, true);
});
