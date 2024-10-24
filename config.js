export const TOKEN = "FEE539C0-D206-A685-88F8-0E433FCDFD1D";
export const INDEX = "afc98c53b968b4c47ff1e21e7219d4f41668083405";
export const CATEGORIES = [
  "Root Catalog > Default Category > Electronics > Headphones",
  "Root Catalog > Default Category > Electronics > Smartphones",
  "Root Catalog > Default Category > Electronics > Tablets",
  "Root Catalog > Default Category > Electronics > Wireless Speakers",
  "Root Catalog > Default Category > Home > Chairs",
  "Root Catalog > Default Category > Home > Glasses",
  "Root Catalog > Default Category > Home > Knives",
  "Root Catalog > Default Category > Home > Lighting",
  "Root Catalog > Default Category > Home > Mugs & Teacups",
  "Root Catalog > Default Category > Home > Plates",
  "Root Catalog > Default Category > Home > Vases",
  "Root Catalog > Default Category > Home > Water Bottles",
  "Root Catalog > Default Category > Men > Belts",
  "Root Catalog > Default Category > Men > Fragrances",
  "Root Catalog > Default Category > Men > Shoes",
  "Root Catalog > Default Category > Men > Trousers & Shorts",
  "Root Catalog > Default Category > Men > Watches",
  "Root Catalog > Default Category > Toys > Plush",
  "Root Catalog > Default Category > Toys > Teddy Bears",
  "Root Catalog > Default Category > Women > Bags",
  "Root Catalog > Default Category > Women > Dresses",
  "Root Catalog > Default Category > Women > Fragrances",
  "Root Catalog > Default Category > Women > Jewelry",
  "Root Catalog > Default Category > Women > Shoes",
  "Root Catalog > Default Category > Women > Skirts",
  "Root Catalog > Default Category > Women > Tops & Sweatshirts",
  "Root Catalog > Default Category > Women > Watches",
];

export const CATEGORY_DICT = {};

CATEGORIES.map((CATEGORY) => {
  const subCategories = CATEGORY.toLowerCase().split(" > ");
  subCategories.forEach((subCategory, i) => {
    if (CATEGORY_DICT[subCategory]) return;
    CATEGORY_DICT[subCategory] = subCategories.slice(0, i + 1).join(">");
  });
});
