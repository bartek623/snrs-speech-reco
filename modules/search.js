import { pagination, sorting, filters } from "./filters.js";

const searchResultsContainerEl = document.querySelector(
  ".search-results_container"
);
const searchLoader = document.querySelector(".grid-loader");
const paginationEl = document.querySelector(".search-results_pagination");

const TOKEN = "FEE539C0-D206-A685-88F8-0E433FCDFD1D";
const INDEX = "afc98c53b968b4c47ff1e21e7219d4f41668083405";
let lastQuery = "";

const createCardEl = (data) => `<div class="search-results_card card">
                                  <img src="${data.image}" />
                                  <span class="brand">${data.brand}</span>
                                  <a href="${data.productUrl}">${data.name}</a>
                                  <span class="price">$${Number(
                                    data.price
                                  ).toFixed(2)}</span>
                                </div>`;

export default async function search(query = lastQuery) {
  if (query === "") return;
  lastQuery = query;
  searchResultsContainerEl.replaceChildren(searchLoader, paginationEl);
  searchLoader.classList.remove("hidden");
  const URL = `https://api.synerise.com/search/v2/indices/${INDEX}/query?token=${TOKEN}&query=${query}&includeMeta=true&limit=${pagination.limit}&page=${pagination.page}&sortBy=${sorting.prop}&ordering=${sorting.order}`;

  try {
    const res = await fetch(URL);
    if (!res.ok) throw new Error("Something went wrong");
    const data = await res.json();
    data.data.forEach((el) => {
      const cardEl = createCardEl(el);
      searchResultsContainerEl.insertAdjacentHTML("afterbegin", cardEl);
    });
    pagination.lastPage = data.meta.totalPages;
    pagination.updatePageNrs();
  } catch (err) {
    console.error(err);
  }

  searchLoader.classList.add("hidden");
}
