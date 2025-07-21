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
const generatePromptBtn = document.getElementById('generatePromptBtn');

// Modal elements
const characterModal = document.getElementById('characterModal');
const closeModal = document.querySelector('.close-modal');
const generatedPrompt = document.getElementById('generatedPrompt');
const copyPromptBtn = document.getElementById('copyPrompt');

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
    generatePromptBtn.addEventListener('click', showPromptModal);
    
    // Modal event listeners
    closeModal.addEventListener('click', hideModal);
    copyPromptBtn.addEventListener('click', copyPrompt);
    
    // AI generation
    const generateWithAIBtn = document.getElementById('generateWithAI');
    if (generateWithAIBtn) {
        generateWithAIBtn.addEventListener('click', generateWithAI);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === characterModal) {
            hideModal();
        }
    });
    
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
    
    // Reset images
    animalImage.src = 'images/placeholder.svg';
    elementImage.src = 'images/placeholder.svg';
}

// Show prompt modal with current pair
function showPromptModal() {
    const currentElement = {
        name: elementName.textContent,
        description: elementDescription.textContent
    };
    const currentAnimal = {
        name: animalName.textContent,
        description: animalDescription.textContent
    };
    
    const prompt = createCharacterPrompt(currentElement, currentAnimal);
    generatedPrompt.value = prompt;
    characterModal.style.display = 'block';
}

// Hide modal
function hideModal() {
    characterModal.style.display = 'none';
}

// Copy prompt to clipboard
function copyPrompt() {
    generatedPrompt.select();
    navigator.clipboard.writeText(generatedPrompt.value).then(() => {
        const copyText = copyPromptBtn.querySelector('.copy-text');
        const copySuccess = copyPromptBtn.querySelector('.copy-success');
        
        copyText.style.display = 'none';
        copySuccess.style.display = 'inline';
        
        setTimeout(() => {
            copyText.style.display = 'inline';
            copySuccess.style.display = 'none';
        }, 2000);
    }).catch(() => {
        // Fallback for browsers that don't support clipboard API
        generatedPrompt.select();
        document.execCommand('copy');
        alert('Prompt wurde in die Zwischenablage kopiert!');
    });
}

// Create detailed prompt for character generation
function createCharacterPrompt(element, animal) {
    return `Erstelle eine Charakterbeschreibung für eine Person mit folgenden Eigenschaften:

Element: ${element.name} - ${element.description}
Tier: ${animal.name} - ${animal.description}

Beschreibe in 200-250 Wörtern:
- Wie diese Person sich verhält und kommuniziert
- Ihre Stärken und Schwächen 
- Typische Situationen und Reaktionen
- Lebensstil und Motivationen

Schreibe lebhaft und konkret mit Beispielen.`;
}

// Generate character description using the free LLM API
async function generateWithAI() {
    const generateBtn = document.getElementById('generateWithAI');
    const generateText = generateBtn.querySelector('.generate-text');
    const generatingText = generateBtn.querySelector('.generating-text');
    const aiResult = document.getElementById('aiResult');
    const characterDescription = document.getElementById('characterDescription');
    const promptTextarea = document.getElementById('generatedPrompt');
    
    // Show loading state
    generateText.style.display = 'none';
    generatingText.style.display = 'inline';
    generateBtn.disabled = true;
    
    // Hide previous results
    aiResult.style.display = 'none';
    
    try {
        const response = await fetch('https://mlvoca.com/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'deepseek-r1:1.5b',
                prompt: promptTextarea.value,
                stream: false,
                options: {
                    temperature: 0.7,
                    max_tokens: 500
                }
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Display the generated character description
        characterDescription.textContent = data.response;
        aiResult.style.display = 'block';
        
        // Scroll to the result
        aiResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
    } catch (error) {
        console.error('Error generating character:', error);
        characterDescription.textContent = 'Fehler beim Generieren der Charakterbeschreibung. Bitte versuche es erneut oder verwende den Prompt manuell in einem KI-Assistenten.';
        aiResult.style.display = 'block';
    } finally {
        // Reset button state
        generateText.style.display = 'inline';
        generatingText.style.display = 'none';
        generateBtn.disabled = false;
    }
}
