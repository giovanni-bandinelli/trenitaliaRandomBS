// stationSearch.js - Gestione del dropdown delle stazioni
import { searchStations } from './api.js';

export class StationSearch {
    constructor(inputElement) {
        this.input = inputElement;
        this.suggestionList = inputElement.nextElementSibling;
        this.selectedIndex = -1;
        this.suggestions = [];
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Eventi dell'input
        this.input.addEventListener('input', () => this.handleInput());
        this.input.addEventListener('focus', () => this.handleInput());
        this.input.addEventListener('keydown', (e) => this.handleKeyNavigation(e));

        // Chiudi suggerimenti quando si clicca fuori
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.input-container')) {
                this.hideSuggestions();
            }
        });
    }

    async handleInput() {
        const query = this.input.value;
        if (query.length < 2) {
            this.hideSuggestions();
            return;
        }
    
        this.suggestions = await searchStations(query);
        this.renderSuggestions();
    
        if (this.suggestions.length > 0) {
            this.selectedIndex = 0;  // Se ci sono suggerimenti, pre-seleziona il primo
            this.highlightSelection();
        } else {
            this.selectedIndex = -1;
        }
    }
    

    handleKeyNavigation(event) {
        const items = this.suggestionList.querySelectorAll('li');
        if (!items.length) return;
    
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                this.moveSelection(1);
                break;
            case 'ArrowUp':
                event.preventDefault();
                this.moveSelection(-1);
                break;
            case 'Enter':
                event.preventDefault();
                if (this.selectedIndex >= 0) {
                    this.selectSuggestion(this.suggestions[this.selectedIndex]);
                }
                break;
            case 'Escape':
                this.hideSuggestions();
                break;
        }
    }
    

    moveSelection(direction) {
        const items = this.suggestionList.querySelectorAll('li');
        if (!items.length) return;
    
        // Aggiorna l'indice, assicurandosi che sia nei limiti
        this.selectedIndex = Math.max(0, Math.min(this.selectedIndex + direction, items.length - 1));
    
        this.highlightSelection();
    
        // Scorri la lista se necessario
        items[this.selectedIndex]?.scrollIntoView({ block: 'nearest' });
    }

    highlightSelection() {
        const items = this.suggestionList.querySelectorAll('li');
        items.forEach((item, index) => {
            item.classList.toggle('selected', index === this.selectedIndex);
        });
    }

    renderSuggestions() {
        this.suggestionList.innerHTML = '';
        this.suggestionList.classList.remove('hidden');

        this.suggestions.forEach((station, index) => {
            const li = document.createElement('li');
            li.textContent = station.displayName;
            li.onclick = () => this.selectSuggestion(station);
            if (index === this.selectedIndex) {
                li.classList.add('selected');
            }
            this.suggestionList.appendChild(li);
        });
    }

    selectSuggestion(station) {
        this.input.value = station.displayName;
        this.selectedIndex = -1;  // Resetta l'indice selezionato
        this.hideSuggestions();
    }
    

    hideSuggestions() {
        this.suggestionList.classList.add('hidden');
        this.selectedIndex = -1;
    }
}
