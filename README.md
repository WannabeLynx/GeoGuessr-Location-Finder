# GeoGuessr Location Finder

This is a user script for Tampermonkey that displays helpful information about the current round in GeoGuessr. It works by intercepting and reading the game's network requests to provide you with the exact location data.

This script is intended for **educational purposes only**, such as for content creation or understanding how GeoGuessr fetches its data.

---

## Features

* **Coordinate Display**: Shows the precise latitude and longitude of the current location.
* **Country and Flag**: Fetches and displays the country name and national flag for the location.
* **Keyboard Controls**: Easily toggle the display and switch views using simple key presses.
* **Movable UI**: Drag and drop the info box anywhere on your screen.
* **Automatic Disabling**: The script deactivates itself in competitive modes to ensure fair play.

---

## Controls

* **Press `1`**: Show or hide the location info box.
* **Press `2`**: Switch the view between coordinates (lat/lng) and country info (name/flag).

---

## A Note on Fair Play

The integrity of any competitive game relies on the honesty of its players. Using this script during any ranked gameplay, such as **Duels**, **Battle Royale**, or **Team Duels**, is cheating.

Cheating undermines the spirit of the game. The enjoyment of GeoGuessr comes from testing and improving your own deductive skills, not from exploiting the game's data. Using a tool like this in a competitive setting devalues the effort of other players and spoils the fun for the entire community.

This script includes a feature that **automatically disables it when a competitive game mode is detected**. This is a "good faith" measure to prevent accidental cheating. Please respect the game and its players by not attempting to circumvent this feature.

Play fair. The satisfaction of a well-earned victory is far greater than that of a hollow one.

---

##  How It Works

The script intercepts `fetch` requests made by the GeoGuessr website. When it detects a request to the game's API containing round data, it performs two actions:

1.  It reads the JSON response to extract the **latitude and longitude**.
2.  It sends these coordinates to the free [Nominatim API](https://nominatim.openstreetmap.org/) to perform a reverse geocoding lookup, which returns the country name and country code.

This information is then displayed in a small, movable box on the screen.

---

## Installation

1.  **Install a user script manager**: You need a browser extension to run this script. The most common one is **Tampermonkey**. Install it for your preferred browser (Chrome, Firefox, Edge, etc.).
2.  **Install the script**:
    * Go to the script's page on Greasy Fork or GitHub.
    * Click the "Install this script" button.
    * Tampermonkey will open a new tab showing the script's source code. Click "Install" to confirm.
3.  **Play GeoGuessr**: The script will now run automatically whenever you are on the GeoGuessr website.

---

## Disclaimer

This script is provided as-is. The user assumes all responsibility for its use. The author is not responsible for any consequences that may arise from using this script, including any actions taken against your GeoGuessr account.
