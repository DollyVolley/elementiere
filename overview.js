// Global variables to store data
let animalsData = [];
let elementsData = [];

// Initialize the overview page
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    renderElements();
    renderAnimals();
    initializeCharacterGenerator();
    setupModalEventListeners();
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

// Initialize character generator
function initializeCharacterGenerator() {
    populateDropdowns();
    setupEventListeners();
}

// Populate dropdown menus with data
function populateDropdowns() {
    const elementSelect = document.getElementById('elementSelect');
    const animalSelect = document.getElementById('animalSelect');
    
    if (!elementSelect || !animalSelect) return;
    
    // Populate elements dropdown
    elementsData.forEach(element => {
        const option = document.createElement('option');
        option.value = element.id;
        option.textContent = element.name;
        elementSelect.appendChild(option);
    });
    
    // Populate animals dropdown
    animalsData.forEach(animal => {
        const option = document.createElement('option');
        option.value = animal.id;
        option.textContent = animal.name;
        animalSelect.appendChild(option);
    });
}

// Setup event listeners for character generator
function setupEventListeners() {
    const elementSelect = document.getElementById('elementSelect');
    const animalSelect = document.getElementById('animalSelect');
    const generateBtn = document.getElementById('generateCharacter');
    
    if (!elementSelect || !animalSelect || !generateBtn) return;
    
    // Enable/disable generate button based on selections
    function updateGenerateButton() {
        const elementSelected = elementSelect.value !== '';
        const animalSelected = animalSelect.value !== '';
        generateBtn.disabled = !(elementSelected && animalSelected);
    }
    
    elementSelect.addEventListener('change', updateGenerateButton);
    animalSelect.addEventListener('change', updateGenerateButton);
    
    // Handle character generation
    generateBtn.addEventListener('click', generateCharacterDescription);
}

// Generate character description using external LLM
function generateCharacterDescription() {
    const elementSelect = document.getElementById('elementSelect');
    const animalSelect = document.getElementById('animalSelect');
    
    const selectedElementId = parseInt(elementSelect.value);
    const selectedAnimalId = parseInt(animalSelect.value);
    
    const selectedElement = elementsData.find(e => e.id === selectedElementId);
    const selectedAnimal = animalsData.find(a => a.id === selectedAnimalId);
    
    if (!selectedElement || !selectedAnimal) {
        alert('Bitte wähle sowohl ein Element als auch ein Tier aus.');
        return;
    }
    
    // Create detailed prompt for LLM
    const prompt = createCharacterPrompt(selectedElement, selectedAnimal);
    
    // Show the modal with the generated prompt
    showCharacterModal(prompt);
}

function showCharacterModal(prompt) {
    const modal = document.getElementById('characterModal');
    const promptTextarea = document.getElementById('generatedPrompt');
    
    promptTextarea.value = prompt;
    modal.style.display = 'block';
    
    // Focus the textarea for easy selection
    setTimeout(() => {
        promptTextarea.focus();
        promptTextarea.select();
    }, 100);
}

function setupModalEventListeners() {
    const modal = document.getElementById('characterModal');
    const closeBtn = document.querySelector('.close-modal');
    const copyBtn = document.getElementById('copyPrompt');
    const generateWithAIBtn = document.getElementById('generateWithAI');
    const copyText = copyBtn.querySelector('.copy-text');
    const copySuccess = copyBtn.querySelector('.copy-success');

    // Close modal when clicking X
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });

    // Copy prompt to clipboard
    copyBtn.addEventListener('click', async () => {
        const promptTextarea = document.getElementById('generatedPrompt');
        
        try {
            await navigator.clipboard.writeText(promptTextarea.value);
            
            // Show success feedback
            copyText.style.display = 'none';
            copySuccess.style.display = 'inline';
            
            // Reset after 2 seconds
            setTimeout(() => {
                copyText.style.display = 'inline';
                copySuccess.style.display = 'none';
            }, 2000);
            
        } catch (err) {
            // Fallback for older browsers
            promptTextarea.select();
            document.execCommand('copy');
            
            // Show success feedback
            copyText.style.display = 'none';
            copySuccess.style.display = 'inline';
            
            setTimeout(() => {
                copyText.style.display = 'inline';
                copySuccess.style.display = 'none';
            }, 2000);
        }
    });

    // Generate with AI
    generateWithAIBtn.addEventListener('click', generateWithAI);
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
