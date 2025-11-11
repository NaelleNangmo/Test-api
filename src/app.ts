
const API_KEY = "46a13242f214cb4f97b601c1b782815d";
const BASE_URL = `https://api.countrylayer.com/v2/all?access_key=${API_KEY}`;

interface Country {
  alpha2Code: string;
  name: string;
  capital?: string;
  population?: number;
  area?: number;
  region?: string;
  subregion?: string;
  languages?: { name: string }[];
  currencies?: { name: string; symbol?: string }[];
  flag?: string;
}

// Sélecteurs DOM
let grid: HTMLElement | null;
let searchInput: HTMLInputElement | null;
let regionFilter: HTMLSelectElement | null;
let refreshBtn: HTMLButtonElement | null;
let modal: HTMLElement | null;
let modalBody: HTMLElement | null;
let modalClose: HTMLButtonElement | null;
let statusBar: HTMLElement | null;

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  grid = document.getElementById("grid");
  searchInput = document.getElementById("searchInput") as HTMLInputElement;
  regionFilter = document.getElementById("regionFilter") as HTMLSelectElement;
  refreshBtn = document.getElementById("refreshBtn") as HTMLButtonElement;
  modal = document.getElementById("modal");
  modalBody = document.getElementById("modalBody");
  modalClose = document.getElementById("modalClose") as HTMLButtonElement;
  statusBar = document.getElementById("statusBar");

  setupEvents();
  loadCountries();
});

// Chargement
async function loadCountries() {
  if (!statusBar) return;
  statusBar.textContent = "Chargement des données…";

  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
    const data: Country[] = await res.json();

    localStorage.setItem("countries", JSON.stringify(data));
    renderCountries(data);

    statusBar.textContent = `${data.length} pays chargés avec succès.`;
  } catch (e) {
    console.error(e);
    statusBar.textContent = "❌ Impossible de charger les données.";
  }
}

// Rendu
function renderCountries(countries: Country[]) {
  if (!grid) return;
  grid.innerHTML = "";

  countries.forEach((c) => {
    const population = c.population ? c.population.toLocaleString() : "N/A";
    const flagSrc = `https://flagcdn.com/${c.alpha2Code.toLowerCase()}.svg`

    const card = document.createElement("div");
    card.className = "country-card";
    card.innerHTML = `
      <img class="card-flag" src="${flagSrc}" alt="${c.name}" />
      <div class="card-meta">
        <h3>${c.name}</h3>
        <p><strong>Capitale:</strong> ${c.capital || "N/A"}</p>
        <p><strong>Région:</strong> ${c.region || "N/A"}</p>
        <p><strong>Population:</strong> ${population}</p>
      </div>
    `;
    card.addEventListener("click", () => showCountryDetails(c));
    grid!.appendChild(card);
  });
}

// Détails
function showCountryDetails(c: Country) {
  if (!modal || !modalBody) return;
  const population = c.population ? c.population.toLocaleString() : "N/A";
  const area = c.area ? c.area.toLocaleString() + " km²" : "N/A";

  modalBody.innerHTML = `
    <h2>${c.name}</h2>
    <img src="${`https://flagcdn.com/${c.alpha2Code.toLowerCase()}.svg` || "./assets/placeholder-flag.svg"}" alt="${c.name}" />
    <ul>
      <li><strong>Capitale:</strong> ${c.capital || "N/A"}</li>
      <li><strong>Population:</strong> ${population}</li>
      <li><strong>Superficie:</strong> ${area}</li>
      <li><strong>Région:</strong> ${c.region || "N/A"}</li>
      <li><strong>Sous-région:</strong> ${c.subregion || "N/A"}</li>
      <li><strong>Langues:</strong> ${c.languages?.map(l => l.name).join(", ") || "N/A"}</li>
      <li><strong>Monnaies:</strong> ${c.currencies?.map(cu => `${cu.name} (${cu.symbol || ""})`).join(", ") || "N/A"}</li>
    </ul>
  `;
  modal.style.display = "flex";
}

// Événements
function setupEvents() {
  if (searchInput)
    searchInput.addEventListener("input", debounce(filterCountries, 400));
  if (regionFilter) regionFilter.addEventListener("change", filterCountries);
  if (refreshBtn) refreshBtn.addEventListener("click", loadCountries);
  if (modalClose)
    modalClose.addEventListener("click", () => (modal!.style.display = "none"));
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal!.style.display = "none";
  });
}

// Filtrage
function filterCountries() {
  const all = JSON.parse(localStorage.getItem("countries") || "[]");
  if (!Array.isArray(all)) return;
  const q = searchInput?.value.toLowerCase() || "";
  const r = regionFilter?.value || "";

  const filtered = all.filter(
    (c: Country) =>
      c.name.toLowerCase().includes(q) &&
      (!r || c.region === r)
  );
  renderCountries(filtered);
  if (statusBar) statusBar.textContent = `${filtered.length} pays trouvés.`;
}

// Utils
function debounce(fn: Function, delay: number) {
  let timer: number;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), delay);
  };
}
