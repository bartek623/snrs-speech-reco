const searchResultsContainerEl = document.querySelector(
  ".search-results_container"
);
const searchLoader = document.querySelector(".grid-loader");

const TOKEN = "FEE539C0-D206-A685-88F8-0E433FCDFD1D";
const INDEX = "afc98c53b968b4c47ff1e21e7219d4f41668083405";

const createCardEl = (data) => `<div class="search-results_card card">
                                  <img src="${data.image}" />
                                  <span class="brand">${data.brand}</span>
                                  <a href="${data.productUrl}">${data.name}</a>
                                  <span class="price">$${Number(
                                    data.price
                                  ).toFixed(2)}</span>
                                </div>`;

export default async function search(query) {
  searchResultsContainerEl.replaceChildren(searchLoader);
  searchLoader.classList.remove("hidden");
  const URL = `https://api.synerise.com/search/v2/indices/${INDEX}/query?token=${TOKEN}&query=${query}`;

  try {
    const res = await fetch(URL);
    if (!res.ok) throw new Error("Something went wrong");
    const data = await res.json();
    data.data.forEach((el) => {
      const cardEl = createCardEl(el);
      searchResultsContainerEl.insertAdjacentHTML("beforeend", cardEl);
    });
  } catch (err) {
    console.error(err);
  }

  searchLoader.classList.add("hidden");
}
