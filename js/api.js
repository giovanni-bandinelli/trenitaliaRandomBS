// api.js - Gestione delle chiamate API
export async function searchStations(query) {
    if (query.length < 2) return [];
    
    try {
        const response = await fetch(//Get fucked Trenitalia
            `https://corsproxy.io/?https://www.lefrecce.it/Channels.Website.BFF.WEB/website/locations/search?name=${encodeURIComponent(query)}&limit=10`
        );
        return await response.json();
    } catch (error) {
        console.error("Errore nel recupero delle stazioni:", error);
        return [];
    }
}

export async function fetchTrains(departure, arrival) {
    // TODO: Implementare la chiamata API per i treni
    console.log('Fetching trains...', {departure, arrival});
}