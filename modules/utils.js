export const createCardEl = (data) =>
  `<div class="search-results_card card">
    <img src="${data.image}" />
    <span class="brand">${data.brand}</span>
    <a href="${data.productUrl}">${data.name}</a>
    <span class="price">$${Number(data.price).toFixed(2)}</span>
  </div>`;

export const getSelectedFilters = (filterCtrl) =>
  [...filterCtrl.querySelectorAll("input:checked")].map((el) => el.value);

export const expandFilterHandler = (filterEl) => {
  if (filterEl.matches(".collapsed")) filterEl.classList.remove("collapsed");
  else filterEl.classList.add("collapsed");
};

export const showSearchResults = (items) => {
  const paginationEl = document.querySelector(".search-results_pagination");

  items.forEach((el) => {
    const cardEl = createCardEl(el);
    paginationEl.insertAdjacentHTML("beforebegin", cardEl);
  });
};
