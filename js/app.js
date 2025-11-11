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
class CountryExplorer {
    constructor() {
        this.apiKey = '46a13242f214cb4f97b601c1b782815d';
        this.url = `https://api.countrylayer.com/v2/all?access_key=`;
        this.countriesContainer = document.getElementById('countries');
        this.loadBtn = document.getElementById('loadBtn');
        this.loading = document.getElementById('loading');
        this.error = document.getElementById('error');
        this.loadBtn.addEventListener('click', () => this.loadCountries());
    }
    showLoading() {
        this.loading.classList.remove('hidden');
        this.error.classList.add('hidden');
        this.countriesContainer.innerHTML = '';
    }
    hideLoading() {
        this.loading.classList.add('hidden');
    }
    showError(message) {
        this.error.textContent = message;
        this.error.classList.remove('hidden');
    }
    loadCountries() {
        return __awaiter(this, void 0, void 0, function* () {
            this.showLoading();
            this.loadBtn.disabled = true;
            try {
                const response = yield fetch(`${this.url}${this.apiKey}`);
                if (!response.ok) {
                    throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
                }
                const data = yield response.json();
                if (!Array.isArray(data) || data.length === 0) {
                    throw new Error('Aucune donnée reçue ou format invalide.');
                }
                this.displayCountries(data);
            }
            catch (err) {
                const error = err;
                console.error('Erreur AJAX:', error);
                this.showError(`Échec du chargement : ${error.message}`);
            }
            finally {
                this.hideLoading();
                this.loadBtn.disabled = false;
            }
        });
    }
    displayCountries(countries) {
        this.countriesContainer.innerHTML = '';
        countries.forEach(country => {
            var _a, _b, _c, _d, _e;
            const card = document.createElement('div');
            card.className = 'card';
            const currency = ((_b = (_a = country.currencies) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.name) || 'N/A';
            const language = ((_d = (_c = country.languages) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.name) || 'N/A';
            card.innerHTML = `
        <h3>(${country.flag}) ${country.name}</h3>
        <p><strong>Capitale :</strong> ${country.capital || 'N/A'}</p>
        <p><strong>Population :</strong> ${country.population.toLocaleString()} hab.</p>
        <p><strong>Superficie :</strong> ${((_e = country.area) === null || _e === void 0 ? void 0 : _e.toLocaleString()) || 'N/A'} km²</p>
        <p><strong>Monnaie :</strong> ${currency}</p>
        <p><strong>Langue :</strong> ${language}</p>
      `;
            this.countriesContainer.appendChild(card);
        });
    }
}
// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    new CountryExplorer();
});
