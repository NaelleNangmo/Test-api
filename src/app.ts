// Interface pour typer les données de l'API
interface Country {
  name: string;
  capital: string;
  population: number;
  area: number;
  currencies: { name: string }[];
  languages: { name: string }[];
  flag: string;
}

class CountryExplorer {
  private apiKey: string = '46a13242f214cb4f97b601c1b782815d'; 
  private url: string = `https://api.countrylayer.com/v2/all?access_key=`;
  private countriesContainer = document.getElementById('countries') as HTMLElement;
  private loadBtn = document.getElementById('loadBtn') as HTMLButtonElement;
  private loading = document.getElementById('loading') as HTMLElement;
  private error = document.getElementById('error') as HTMLElement;

  constructor() {
    this.loadBtn.addEventListener('click', () => this.loadCountries());
  }

  private showLoading() {
    this.loading.classList.remove('hidden');
    this.error.classList.add('hidden');
    this.countriesContainer.innerHTML = '';
  }

  private hideLoading() {
    this.loading.classList.add('hidden');
  }

  private showError(message: string) {
    this.error.textContent = message;
    this.error.classList.remove('hidden');
  }

  private async loadCountries() {
    this.showLoading();
    this.loadBtn.disabled = true;

    try {
      const response = await fetch(`${this.url}${this.apiKey}`);

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
      }

      const data: Country[] = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Aucune donnée reçue ou format invalide.');
      }

      this.displayCountries(data);
    } catch (err) {
      const error = err as Error;
      console.error('Erreur AJAX:', error);
      this.showError(`Échec du chargement : ${error.message}`);
    } finally {
      this.hideLoading();
      this.loadBtn.disabled = false;
    }
  }

  private displayCountries(countries: Country[]) {
    this.countriesContainer.innerHTML = '';

    countries.forEach(country => {
      const card = document.createElement('div');
      card.className = 'card';

      const currency = country.currencies?.[0]?.name || 'N/A';
      const language = country.languages?.[0]?.name || 'N/A';

      card.innerHTML = `
        <h3>(${country.flag}) ${country.name}</h3>
        <p><strong>Capitale :</strong> ${country.capital || 'N/A'}</p>
        <p><strong>Population :</strong> ${country.population.toLocaleString()} hab.</p>
        <p><strong>Superficie :</strong> ${country.area?.toLocaleString() || 'N/A'} km²</p>
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