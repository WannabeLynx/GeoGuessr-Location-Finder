GeoGuessr Location Finder
This is a user script for Tampermonkey that displays the exact geographic coordinates (latitude and longitude) for the current round in GeoGuessr. It works by intercepting and reading the game's network requests.

Note: This script is intended for educational purposes only, such as understanding how a web application like GeoGuessr fetches its data.

A Note on Fair Play
The integrity of any competitive game relies on the honesty of its players. Using this script during any competitive or ranked gameplay, such as Duels, Battle Royale, or Team Duels, is cheating.

Cheating undermines the spirit of the game. The challenge and enjoyment of GeoGuessr come from testing and improving your own deductive skills, not from exploiting the game's data. Using a tool like this in a competitive setting removes that challenge, devalues the effort of other players, and ultimately spoils the fun for the entire community.

This script includes a feature that automatically disables it when a competitive game mode is detected. This is a "good faith" measure to prevent accidental cheating. Please respect the game and its players by not attempting to circumvent this feature.

Play fair. The satisfaction of a well-earned victory is far greater than that of a hollow one.

How It Works
The script intercepts fetch requests made by the GeoGuessr website. When it detects a request to the game's API that contains round data, it reads the JSON response, extracts the latitude and longitude, and displays them in a small, movable box on the screen.

Installation
Install a user script manager: You need a browser extension to run this script. The most common one is Tampermonkey. Install it for your preferred browser (Chrome, Firefox, Edge, etc.).

Install the script:

Go to the script's page on Greasy Fork or GitHub.

Click the "Install this script" button.

Tampermonkey will open a new tab showing you the script's source code and ask for confirmation. Click "Install".

Play GeoGuessr: The script will now run automatically whenever you are on the GeoGuessr website.

Disclaimer
This script is provided as-is. The user assumes all responsibility for its use. The author is not responsible for any consequences that may arise from using this script, including any actions taken against your GeoGuessr account.
