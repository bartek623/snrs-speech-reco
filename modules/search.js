import { pagination, sorting, filters } from "./filters.js";
import { TOKEN, INDEX } from "../config.js";

const searchResultsContainerEl = document.querySelector(
  ".search-results_container"
);
const searchLoader = document.querySelector(".grid-loader");
const paginationEl = document.querySelector(".search-results_pagination");

const createCardEl = (data) => `<div class="search-results_card card">
<img src="${data.image}" />
<span class="brand">${data.brand}</span>
                                  <a href="${data.productUrl}">${data.name}</a>
                                  <span class="price">$${Number(
                                    data.price
                                  ).toFixed(2)}</span>
                                  </div>`;

let lastQuery = "";
export default async function search(query = lastQuery) {
  if (query === "") return;
  lastQuery = query;
  searchResultsContainerEl.replaceChildren(searchLoader, paginationEl);
  searchLoader.classList.remove("hidden");
  const URL = `https://api.synerise.com/search/v2/indices/${INDEX}/query?token=${TOKEN}`;
  const reqBody = {
    query,
    includeMeta: true,
    limit: pagination.limit,
    page: pagination.page,
    sortBy: sorting.prop,
    ordering: sorting.order,
    filters: filters.filtersQuery,
  };

  try {
    const res = await fetch(URL, {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Something went wrong");
    const data = await res.json();
    console.log(data);
    data.data.forEach((el) => {
      const cardEl = createCardEl(el);
      paginationEl.insertAdjacentHTML("beforebegin", cardEl);
    });
    pagination.lastPage = data.meta.totalPages;
    pagination.updatePageNrs();
  } catch (err) {
    console.error(err);
  }

  searchLoader.classList.add("hidden");
}
