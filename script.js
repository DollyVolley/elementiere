// Global variables to store data
let animalsData = [];
let elementsData = [];

// DOM elements
const pairCard = document.querySelector('.pair-card');
const animalName = document.getElementById('animalName');
const animalDescription = document.getElementById('animalDescription');
const animalImage = document.getElementById('animalImage');
const elementName = document.getElementById('elementName');
const elementDescription = document.getElementById('elementDescription');
const elementImage = document.getElementById('elementImage');
const generateBtn = document.getElementById('generateBtn');

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    setupEventListeners();
    // Show initial pair
    generateRandomPair();
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

// Set up event listeners
function setupEventListeners() {
    generateBtn.addEventListener('click', generateRandomPair);
    
    // Add keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.code === 'Enter') {
            e.preventDefault();
            generateRandomPair();
        }
    });
}

// Generate and display a random animal-element pair
function generateRandomPair() {
    if (animalsData.length === 0 || elementsData.length === 0) {
        showError('Daten noch nicht geladen. Bitte warten...');
        return;
    }

    // Add loading state
    pairCard.classList.add('loading');
    generateBtn.disabled = true;

    // Simulate a brief delay for better UX
    setTimeout(() => {
        const randomAnimal = getRandomItem(animalsData);
        const randomElement = getRandomItem(elementsData);

        displayPair(randomAnimal, randomElement);
        
        // Remove loading state
        pairCard.classList.remove('loading');
        generateBtn.disabled = false;
    }, 200);
}

// Display the selected animal-element pair
function displayPair(animal, element) {
    // Update content
    animalName.textContent = animal.name;
    animalDescription.textContent = animal.description;
    animalImage.src = animal.image || 'images/placeholder.svg';
    animalImage.alt = animal.name;
    
    elementName.textContent = element.name;
    elementDescription.textContent = element.description;
    elementImage.src = element.image || 'images/placeholder.svg';
    elementImage.alt = element.name;

    // Add animation
    pairCard.style.animation = 'none';
    pairCard.offsetHeight; // Trigger reflow
    pairCard.style.animation = 'slideIn 0.4s ease-out';
}

// Get a random item from an array
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Show error message
function showError(message) {
    animalName.textContent = 'Fehler!';
    animalDescription.textContent = message;
    elementName.textContent = 'Fehler!';
    elementDescription.textContent = '';
}
