// ==UserScript==
// @name         Rorys Geoguessr Location Finder
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Displays the exact coordinates of the current GeoGuessr location by intercepting network requests. For educational purposes only. Cheating sucks ass. So don't use it in duels.
// @author       WannabeLynx
// @match        https://www.geoguessr.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // --- SCRIPT CONFIGURATION ---
    const SHOW_ON_START = true;
    let currentCoordinates = { lat: null, lng: null };

    const style = `
        #location-finder-container {
            position: fixed;
            top: 10px;
            left: 10px;
            background-color: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 15px;
            border-radius: 10px;
            z-index: 9999;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            display: none; /* Initially hidden until data is found */
            cursor: move;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
            border: 1px solid #444;
            min-width: 250px;
        }
        #location-finder-container h3 {
            margin: 0 0 10px 0;
            font-size: 16px;
            text-align: center;
            border-bottom: 1px solid #555;
            padding-bottom: 8px;
        }
        #location-finder-container p {
            margin: 8px 0;
        }
        #location-finder-container a {
            color: #4da6ff;
            text-decoration: none;
            display: block;
            text-align: center;
            margin-top: 10px;
            background-color: #333;
            padding: 8px 12px;
            border-radius: 5px;
            transition: background-color 0.3s;
        }
        #location-finder-container a:hover {
            background-color: #555;
        }
        #toggle-button {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 10000;
            background-color: #1a1a1a;
            color: white;
            border: 1px solid #444;
            border-radius: 5px;
            padding: 10px 15px;
            cursor: pointer;
            font-family: 'Inter', sans-serif;
        }
    `;

    let infoContainer, toggleButton;

    function createUI() {
        if (document.getElementById('location-finder-container')) return;
        const styleSheet = document.createElement("style");
        styleSheet.innerText = style;
        document.head.appendChild(styleSheet);

        infoContainer = document.createElement('div');
        infoContainer.id = 'location-finder-container';
        infoContainer.innerHTML = '<h3>Location Finder</h3><p>Waiting for a new round...</p>';
        document.body.appendChild(infoContainer);

        toggleButton = document.createElement('button');
        toggleButton.id = 'toggle-button';
        toggleButton.textContent = 'Location Info';
        document.body.appendChild(toggleButton);

        toggleButton.addEventListener('click', toggleInfoBox);
        makeDraggable(infoContainer);
    }

    function updateInfoBox(lat, lng) {
        if (!infoContainer) createUI();

        const mapsLink = `https://maps.google.com/?q=${lat},${lng}`;
        infoContainer.innerHTML = `
            <h3>Location Finder</h3>
            <p><strong>Latitude:</strong> ${lat.toFixed(6)}</p>
            <p><strong>Longitude:</strong> ${lng.toFixed(6)}</p>
            <a href="${mapsLink}" target="_blank">Open in Google Maps</a>
        `;

        if (SHOW_ON_START) {
            infoContainer.style.display = 'block';
        }
    }

    function handleCompetitiveMode() {
        if (!infoContainer) createUI();
        infoContainer.innerHTML = `
            <h3>Location Finder</h3>
            <p style="color: #ff6b6b; font-weight: bold;">Competitive mode detected!</p>
            <p>Script is disabled to prevent cheating. Play fair.</p>
        `;
        infoContainer.style.display = 'block';
    }

    function isCompetitiveMode() {
        const url = window.location.href;
        const competitivePaths = ['/duels', '/battle-royale', '/competitive', '/multiplayer'];
        return competitivePaths.some(path => url.includes(path));
    }

    function toggleInfoBox() {
        if (!infoContainer) return;
        infoContainer.style.display = (infoContainer.style.display === 'none') ? 'block' : 'none';
    }

    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        element.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    function parseGameData(data) {
        if (!data) return null;
        let roundData = null;

        // Classic Game Structure
        if (data.rounds && (data.round || data.roundNumber)) {
            const roundIndex = (data.round || data.roundNumber) - 1;
            roundData = data.rounds[roundIndex];
        // Streak Mode Structure
        } else if (data.player && data.player.currentRound) {
            roundData = data.player.currentRound;
        }

        if (roundData) {
            // Location in round data
            if (roundData.lat && roundData.lng) {
                return { lat: roundData.lat, lng: roundData.lng };
            }
            // if nested fallback
            if (roundData.panorama && roundData.panorama.lat && roundData.panorama.lng) {
                return { lat: roundData.panorama.lat, lng: roundData.panorama.lng };
            }
        }
        return null;
    }

    function interceptFetch() {
        const originalFetch = window.fetch;

        window.fetch = function(input, init) {
            const url = typeof input === 'string' ? input : input.url;

            if (typeof url === 'string' && url.includes('/api/v3/')) {
                return originalFetch.apply(this, arguments).then(response => {
                    const clonedResponse = response.clone();
                    clonedResponse.json().then(data => {
                        if (isCompetitiveMode()) {
                            handleCompetitiveMode();
                            return;
                        }
                        const coords = parseGameData(data);
                        if (coords) {
                            console.log('Location Finder (fetch): Found coordinates', coords);
                            currentCoordinates = coords;
                            updateInfoBox(currentCoordinates.lat, currentCoordinates.lng);
                        }
                    }).catch(err => {
                        if (isCompetitiveMode()) {
                            handleCompetitiveMode();
                        }
                    });
                    // return the original response to the game
                    return response;
                });
            }
            // for non-api calls, return the original fetch
            return originalFetch.apply(this, arguments);
        };
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', createUI);
    } else {
        createUI();
    }

    interceptFetch();
})();
