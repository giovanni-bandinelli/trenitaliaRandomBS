// script.js - Entry point diddio
import { StationSearch } from './stationSearch.js';
import { Calendar } from './calendar.js';
import { fetchTrains } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    // Inizializza i campi di ricerca stazione
    const departureSearch = new StationSearch(document.getElementById('departure'));
    const arrivalSearch = new StationSearch(document.getElementById('arrival'));
    
    // Inizializza il calendario
    const calendar = new Calendar();
    
    // Gestione del form
    document.querySelector('form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const departure = departureSearch.input.value;
        const arrival = arrivalSearch.input.value;
        
        await fetchTrains(departure, arrival);
    });
});