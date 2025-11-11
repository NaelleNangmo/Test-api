"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const API_KEY = "46a13242f214cb4f97b601c1b782815d";
const BASE_URL = `https://api.countrylayer.com/v2/all?access_key=${API_KEY}`;
// Sélecteurs DOM
let grid;
let searchInput;
let regionFilter;
let refreshBtn;
let modal;
let modalBody;
let modalClose;
let statusBar;
// Initialisation
document.addEventListener("DOMContentLoaded", () => {
    grid = document.getElementById("grid");
    searchInput = document.getElementById("searchInput");
    regionFilter = document.getElementById("regionFilter");
    refreshBtn = document.getElementById("refreshBtn");
    modal = document.getElementById("modal");
    modalBody = document.getElementById("modalBody");
    modalClose = document.getElementById("modalClose");
    statusBar = document.getElementById("statusBar");
    setupEvents();
    loadCountries();
});
// Chargement
function loadCountries() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!statusBar)
            return;
        statusBar.textContent = "Chargement des données…";
        try {
            const res = yield fetch(BASE_URL);
            if (!res.ok)
                throw new Error(`Erreur HTTP ${res.status}`);
            const data = yield res.json();
            localStorage.setItem("countries", JSON.stringify(data));
            renderCountries(data);
            statusBar.textContent = `${data.length} pays chargés avec succès.`;
        }
        catch (e) {
            console.error(e);
            statusBar.textContent = "❌ Impossible de charger les données.";
        }
    });
}
// Rendu
function renderCountries(countries) {
    if (!grid)
        return;
    grid.innerHTML = "";
    countries.forEach((c) => {
        const population = c.population ? c.population.toLocaleString() : "N/A";
        const flagSrc = `https://flagcdn.com/${c.alpha2Code.toLowerCase()}.svg`;
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
        grid.appendChild(card);
    });
}
// Détails
function showCountryDetails(c) {
    var _a, _b;
    if (!modal || !modalBody)
        return;
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
      <li><strong>Langues:</strong> ${((_a = c.languages) === null || _a === void 0 ? void 0 : _a.map(l => l.name).join(", ")) || "N/A"}</li>
      <li><strong>Monnaies:</strong> ${((_b = c.currencies) === null || _b === void 0 ? void 0 : _b.map(cu => `${cu.name} (${cu.symbol || ""})`).join(", ")) || "N/A"}</li>
    </ul>
  `;
    modal.style.display = "flex";
}
// Événements
function setupEvents() {
    if (searchInput)
        searchInput.addEventListener("input", debounce(filterCountries, 400));
    if (regionFilter)
        regionFilter.addEventListener("change", filterCountries);
    if (refreshBtn)
        refreshBtn.addEventListener("click", loadCountries);
    if (modalClose)
        modalClose.addEventListener("click", () => (modal.style.display = "none"));
    window.addEventListener("click", (e) => {
        if (e.target === modal)
            modal.style.display = "none";
    });
}
// Filtrage
function filterCountries() {
    const all = JSON.parse(localStorage.getItem("countries") || "[]");
    if (!Array.isArray(all))
        return;
    const q = (searchInput === null || searchInput === void 0 ? void 0 : searchInput.value.toLowerCase()) || "";
    const r = (regionFilter === null || regionFilter === void 0 ? void 0 : regionFilter.value) || "";
    const filtered = all.filter((c) => c.name.toLowerCase().includes(q) &&
        (!r || c.region === r));
    renderCountries(filtered);
    if (statusBar)
        statusBar.textContent = `${filtered.length} pays trouvés.`;
}
// Utils
function debounce(fn, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = window.setTimeout(() => fn(...args), delay);
    };
}
