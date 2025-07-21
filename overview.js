// Global variables to store data
let animalsData = [];
let elementsData = [];

// Initialize the overview page
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    renderElements();
    renderAnimals();
});

// Load JSON data files
async function loadData() {
    try {
        const [animalsResponse, elementsResponse] = await Promise.all([
            fetch('data/animals.json'),
            fetch('data/temperaments.json')
        ]);

        if (!animalsResponse.ok || !elementsResponse.ok) {
            throw new Error('Fehler beim Laden der Dateien');
        }

        animalsData = await animalsResponse.json();
        elementsData = await elementsResponse.json();

        console.log(`${animalsData.length} Tiere und ${elementsData.length} Elemente geladen`);
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Fehler beim Laden der Daten. Bitte Seite neu laden.');
    }
}

// Render elements grid
function renderElements() {
    const elementsGrid = document.getElementById('elementsGrid');
    if (!elementsGrid) return;

    elementsGrid.innerHTML = '';
    
    elementsData.forEach(element => {
        const elementCard = createOverviewCard(element, 'element');
        elementsGrid.appendChild(elementCard);
    });
}

// Render animals grid
function renderAnimals() {
    const animalsGrid = document.getElementById('animalsGrid');
    if (!animalsGrid) return;

    animalsGrid.innerHTML = '';
    
    animalsData.forEach(animal => {
        const animalCard = createOverviewCard(animal, 'animal');
        animalsGrid.appendChild(animalCard);
    });
}

// Create overview card for an item
function createOverviewCard(item, type) {
    const card = document.createElement('div');
    card.className = 'overview-card';
    
    card.innerHTML = `
        <div class="overview-image-container">
            <img src="${item.image || 'images/placeholder.svg'}" alt="${item.name}" class="overview-image">
        </div>
        <h3 class="overview-name">${item.name}</h3>
        <p class="overview-description">${item.description}</p>
    `;
    
    return card;
}

// Show error message
function showError(message) {
    const elementsGrid = document.getElementById('elementsGrid');
    const animalsGrid = document.getElementById('animalsGrid');
    
    if (elementsGrid) {
        elementsGrid.innerHTML = `<div class="error-message">${message}</div>`;
    }
    if (animalsGrid) {
        animalsGrid.innerHTML = `<div class="error-message">${message}</div>`;
    }
}
