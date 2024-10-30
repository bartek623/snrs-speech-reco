import { sorting } from "./sorting.js";
import { pagination } from "./pagination.js";
import { filters, updateAvailableFilters } from "./filters.js";
import { TOKEN, INDEX } from "../config.js";
import { showSearchResults } from "./utils.js";

const searchResultsContainerEl = document.querySelector(
  ".search-results_container"
);
const searchOptionsEl = document.querySelector(".search-opts");
const searchLoader = document.querySelector(".grid-loader");
const paginationEl = document.querySelector(".search-results_pagination");

let lastQuery = "";
export default async function search(
  query = lastQuery,
  showResults = true,
  updateFilters = false,
  facets = ["brand", "category"]
) {
  lastQuery = query;
  if (showResults) {
    searchOptionsEl.classList.remove("hidden");
    searchResultsContainerEl.replaceChildren(searchLoader, paginationEl);
  }

  searchLoader.classList.remove("hidden");
  const URL = `https://api.synerise.com/search/v2/indices/${INDEX}/${
    query ? "query" : "list"
  }?token=${TOKEN}`;
  const reqBody = {
    query,
    includeMeta: true,
    limit: pagination.limit,
    page: pagination.page,
    sortBy: sorting.prop,
    ordering: sorting.order,
    filters: filters.filtersQuery,
    facets: facets,
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
    const items = data.data;

    if (showResults && query) showSearchResults(items);

    pagination.lastPage = data.meta.totalPages;
    pagination.updatePageNrs();
    if (updateFilters)
      updateAvailableFilters(
        Object.entries(data.extras.filteredFacets?.brand || []),
        Object.entries(data.extras.filteredFacets?.category || [])
      );
  } catch (err) {
    console.error(err);
  }

  searchLoader.classList.add("hidden");
}
