const CATEGORY_GLYPHS = {
  Savings: "▤",
  "Credit Card": "▭",
  Loan: "⌂",
  Wealth: "↗",
};

const CATEGORY_COLORS = {
  Savings: "#0f9d6b",
  "Credit Card": "#0b5cff",
  Loan: "#f5a623",
  Wealth: "#8b6fe0",
};

const STATUS_COLORS = {
  Active: "#0f9d6b",
  Eligible: "#0b5cff",
  Pending: "#f5a623",
};

const glyphFor = (category) => CATEGORY_GLYPHS[category] || "▣";
const colorFor = (category) => CATEGORY_COLORS[category] || "#94a3b8";
const slug = (text) => text.toLowerCase().replace(/\s+/g, "-");
const pad = (number) => String(number).padStart(2, "0");

const filterState = {
  selectedCategory: "All",
  searchText: "",
};
let currentProduct = null;

const navEl = document.getElementById("nav");
const todayEl = document.getElementById("today");
const summaryEl = document.getElementById("summary");
const distFilter = document.getElementById("dist-filter");
const donutEl = document.getElementById("donut");
const donutTotal = document.getElementById("donut-total");
const legendEl = document.getElementById("legend");
const overviewEl = document.getElementById("overview");
const productsSection = document.getElementById("products-section");
const categoryTabs = document.getElementById("tabs");
const productGrid = document.getElementById("grid");
const searchInput = document.getElementById("search");
const productCount = document.getElementById("result-count");
const viewAllBtn = document.getElementById("view-all");
const supportBtn = document.getElementById("support-btn");

const detailsDialog = document.getElementById("details-dialog");
const detailsIcon = document.getElementById("dialog-icon");
const detailsTitle = document.getElementById("dialog-title");
const detailsContent = document.getElementById("dialog-body");
const actionBtn = document.getElementById("dialog-action");
const toastEl = document.getElementById("toast");

const categoryList = ["All", ...new Set(PRODUCTS.map((product) => product.category))];

function isProductOwned(product) {
  return product.status === "Active";
}

function escapeHTML(text) {
  const element = document.createElement("div");
  element.textContent = text;
  return element.innerHTML;
}

function countByStatus(status) {
  return PRODUCTS.filter((product) => product.status === status).length;
}

function getFilteredProducts() {
  const searchText = filterState.searchText.trim().toLowerCase();

  return PRODUCTS.filter((product) => {
    const matchesCategory =
      filterState.selectedCategory === "All" ||
      product.category === filterState.selectedCategory;

    const matchesSearch =
      !searchText ||
      product.name.toLowerCase().includes(searchText) ||
      product.category.toLowerCase().includes(searchText) ||
      product.status.toLowerCase().includes(searchText) ||
      product.metrics.some(
        (metric) =>
          metric.label.toLowerCase().includes(searchText) ||
          metric.value.toLowerCase().includes(searchText)
      );

    return matchesCategory && matchesSearch;
  });
}

let toastTimer;
function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2800);
}

function renderToday() {
  const now = new Date();
  const weekday = now.toLocaleDateString("en-US", { weekday: "long" });
  const month = now.toLocaleDateString("en-US", { month: "long" });
  todayEl.textContent = `${weekday}, ${pad(now.getDate())} ${month} ${now.getFullYear()}`;
}

function renderSummary() {
  const stats = [
    { glyph: "▦", tone: "tone-blue", tag: "Portfolio", value: PRODUCTS.length, label: "Total products" },
    { glyph: "✓", tone: "tone-green", tag: "In use", value: countByStatus("Active"), label: "Active products" },
    { glyph: "◔", tone: "tone-orange", tag: "In review", value: countByStatus("Pending"), label: "Pending applications" },
    { glyph: "✦", tone: "tone-purple", tag: "Available", value: countByStatus("Eligible"), label: "Eligible products" },
  ];

  summaryEl.innerHTML = stats
    .map(
      (stat) => `
      <div class="stat">
        <div class="stat-top">
          <div class="stat-icon ${stat.tone}">${stat.glyph}</div>
          <span class="stat-tag">${stat.tag}</span>
        </div>
        <div class="stat-value">${pad(stat.value)}</div>
        <div class="stat-label">${stat.label}</div>
      </div>`
    )
    .join("");
}

function renderDistribution() {
  const status = distFilter.value;
  const list = status === "All" ? PRODUCTS : PRODUCTS.filter((product) => product.status === status);
  const total = list.length;

  const counts = categoryList.slice(1).map((category) => ({
    name: category,
    count: list.filter((product) => product.category === category).length,
  }));

  let start = 0;
  const stops = total
    ? counts
        .filter((item) => item.count > 0)
        .map((item) => {
          const from = start;
          start += (item.count / total) * 100;
          return `${colorFor(item.name)} ${from}% ${start}%`;
        })
    : ["#e2e8f0 0% 100%"];

  donutEl.style.background = `conic-gradient(${stops.join(", ")})`;
  donutTotal.textContent = pad(total);

  legendEl.innerHTML = counts
    .map(
      (item) => `
      <li>
        <span class="legend-dot" style="background:${colorFor(item.name)}"></span>
        <span class="legend-name">${escapeHTML(item.name)}</span>
        <span class="legend-count">${item.count}</span>
      </li>`
    )
    .join("");
}

function renderOverview() {
  const rows = [
    { label: "Active products", status: "Active" },
    { label: "Eligible products", status: "Eligible" },
    { label: "Pending applications", status: "Pending" },
  ];

  overviewEl.innerHTML = rows
    .map((row) => {
      const count = countByStatus(row.status);
      const percent = Math.round((count / PRODUCTS.length) * 100);
      return `
        <div>
          <div class="bar-row-top">
            <span>${row.label}</span>
            <span>${count} (${percent}%)</span>
          </div>
          <div class="bar-track">
            <div class="bar-fill" style="width:${percent}%; background:${STATUS_COLORS[row.status]}"></div>
          </div>
        </div>`;
    })
    .join("");
}

function renderCategoryTabs() {
  categoryTabs.innerHTML = categoryList
    .map((category) => {
      const categoryCount =
        category === "All"
          ? PRODUCTS.length
          : PRODUCTS.filter((product) => product.category === category).length;
      const isActive = category === filterState.selectedCategory;

      return `
        <button class="tab ${isActive ? "active" : ""}"
                role="tab"
                aria-selected="${isActive}"
                data-category="${escapeHTML(category)}">
          ${escapeHTML(category)}
          <span class="tab-count">${categoryCount}</span>
        </button>`;
    })
    .join("");
}

function createProductCard(product) {
  const owned = isProductOwned(product);

  const metricsHTML = product.metrics
    .map(
      (metric) => `
        <div class="metric">
          <span class="metric-label">${escapeHTML(metric.label)}</span>
          <span class="metric-value">${escapeHTML(metric.value)}</span>
        </div>`
    )
    .join("");

  return `
    <article class="card">
      <div class="card-top">
        <div class="card-head">
          <div class="card-icon icon-${slug(product.category)}">${glyphFor(product.category)}</div>
          <div>
            <h3 class="card-title">${escapeHTML(product.name)}</h3>
            <div class="card-category">${escapeHTML(product.category)}</div>
          </div>
        </div>
        <span class="badge status-${product.status.toLowerCase()}">${escapeHTML(product.status)}</span>
      </div>

      <div class="metrics">${metricsHTML}</div>

      <div class="card-foot">
        <span class="pid">Product ID: #${String(product.id).padStart(3, "0")}</span>
        <button class="link-btn ${owned ? "" : "apply"}" data-id="${product.id}">
          ${owned ? "View details →" : "Apply now →"}
        </button>
      </div>
    </article>`;
}

function renderProductGrid() {
  const filteredProducts = getFilteredProducts();

  productCount.textContent = `Showing ${filteredProducts.length} of ${PRODUCTS.length} products`;

  if (filteredProducts.length === 0) {
    productGrid.innerHTML = `
      <div class="empty">
        <div class="empty-icon">🔎</div>
        <p>No products match your search.</p>
        <button class="btn btn-secondary" id="reset-btn">Clear filters</button>
      </div>`;
    return;
  }

  productGrid.innerHTML = filteredProducts.map(createProductCard).join("");
}

function renderProducts() {
  renderCategoryTabs();
  renderProductGrid();
}

function renderPage() {
  renderToday();
  renderSummary();
  renderDistribution();
  renderOverview();
  renderProducts();
}

function openProductDetails(product) {
  currentProduct = product;
  const owned = isProductOwned(product);

  detailsIcon.textContent = glyphFor(product.category);
  detailsIcon.className = "dialog-icon icon-" + slug(product.category);
  detailsTitle.textContent = owned ? product.name : `Apply for ${product.name}`;

  detailsContent.innerHTML = `
    <div class="dialog-row"><span>Product ID</span><span>#${String(product.id).padStart(3, "0")}</span></div>
    <div class="dialog-row"><span>Category</span><span>${escapeHTML(product.category)}</span></div>
    <div class="dialog-row"><span>Status</span><span>${escapeHTML(product.status)}</span></div>
    ${product.metrics
      .map(
        (metric) => `
        <div class="dialog-row">
          <span>${escapeHTML(metric.label)}</span>
          <span>${escapeHTML(metric.value)}</span>
        </div>`
      )
      .join("")}
  `;

  actionBtn.style.display = owned ? "none" : "block";
  detailsDialog.showModal();
}

function selectCategory(category) {
  filterState.selectedCategory = category;
  renderProducts();
}

navEl.addEventListener("click", (event) => {
  const item = event.target.closest(".nav-item");
  if (!item) return;

  navEl.querySelectorAll(".nav-item").forEach((el) => el.classList.remove("active"));
  item.classList.add("active");

  if (item.dataset.category) {
    selectCategory(item.dataset.category);
    productsSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

categoryTabs.addEventListener("click", (event) => {
  const selectedTab = event.target.closest(".tab");
  if (!selectedTab) return;
  selectCategory(selectedTab.dataset.category);
});

searchInput.addEventListener("input", (event) => {
  filterState.searchText = event.target.value;
  renderProductGrid();
});

distFilter.addEventListener("change", renderDistribution);

viewAllBtn.addEventListener("click", () => {
  filterState.searchText = "";
  searchInput.value = "";
  selectCategory("All");
});

supportBtn.addEventListener("click", () => {
  showToast("Support team will contact you soon (demo)");
});

productGrid.addEventListener("click", (event) => {
  if (event.target.id === "reset-btn") {
    filterState.searchText = "";
    searchInput.value = "";
    selectCategory("All");
    return;
  }

  const selectedButton = event.target.closest("button[data-id]");
  if (!selectedButton) return;

  const selectedProduct = PRODUCTS.find(
    (product) => product.id === Number(selectedButton.dataset.id)
  );
  if (selectedProduct) openProductDetails(selectedProduct);
});

document.getElementById("dialog-close").addEventListener("click", () => {
  detailsDialog.close();
});

actionBtn.addEventListener("click", () => {
  detailsDialog.close();
  if (currentProduct) {
    showToast(`Application started for ${currentProduct.name} (demo)`);
  }
});

renderPage();