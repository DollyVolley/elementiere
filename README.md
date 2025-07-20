# Elementiere - Tier-Element Website

Eine moderne, saubere statische Website, die zufällige Tier- und Element-Paare mit detaillierten Beschreibungen anzeigt.

## Features

- 🎲 Zufällige Tier + Element Paarung
- 📱 Mobile-optimiertes responsives Design
- 🎨 Saubere, moderne UI mit sanften Animationen
- 📊 Statische JSON-Datendateien für einfache Inhaltsverwaltung
- 🖼️ Bildunterstützung für Tiere
- ⌨️ Tastatur-Zugänglichkeit (Leertaste/Enter zum Generieren)

## Struktur

```
/
├── index.html          # Haupt-HTML-Datei
├── styles.css          # CSS-Stile und responsives Design
├── script.js           # JavaScript-Funktionalität
├── data/
│   ├── animals.json    # Tierdaten (Name, Beschreibung, Bild)
│   └── temperaments.json # Elementdaten (Name, Beschreibung)
├── images/
│   ├── placeholder.svg # Standard-Platzhalterbild
│   └── [tier-bilder]   # Füge hier deine Tierbilder hinzu
└── README.md           # Diese Datei
```

## Datenformat

### Tiere (`data/animals.json`)
```json
{
  "id": 1,
  "name": "Tiername",
  "description": "Detaillierte Beschreibung des Tieres...",
  "image": "images/tiername.jpg"
}
```

### Elemente (`data/temperaments.json`)
```json
{
  "id": 1,
  "name": "Elementname", 
  "description": "Detaillierte Beschreibung des Elements..."
}
```

## Inhalt hinzufügen

1. **Tiere**: Bearbeite `data/animals.json` um deine Tiere mit Beschreibungen hinzuzufügen
2. **Elemente**: Bearbeite `data/temperaments.json` um deine Elemente hinzuzufügen
3. **Bilder**: Füge Tierbilder zum `images/` Ordner hinzu und referenziere sie im JSON

## Bildanforderungen

- Empfohlene Größe: 500x400px oder ähnliches Seitenverhältnis
- Formate: JPG, PNG, WebP
- Benenne Bilder beschreibend (z.B. `baer.jpg`)

## Deployment

This is a static website that can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

Simply upload all files to your hosting provider.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers

## Development

To test locally, serve the files through a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`
# elementiere
