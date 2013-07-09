Humble Games
============

All the games from http://www.humblebundle.com/

To add games, just edit the [games.js](https://github.com/Calvein/humble-games/blob/gh-pages/games.js)
file and INSERT the following, where the url fragment is http://www.humblebundle.com/store/product/<b>awesomegame</b>:

    {
        "name": "NAME",
        "url": "URL",
        "price": "PRICE (without currency)",
        "description": "DESCRIPTION",
        "developer": "DEVELOPER",
        "platform": {
            "android": true/false,
            "linux": true/false,
            "windows": true/false,
            "mac": true/false,
            "audio": true/false
        },
        "DRM": {
            "steam": true/false,
            "desura": true/false,
            "GOG": true/false,
            "DRM-Free": true/false
        },
        "URL": {
            "review": "Link to a review of the game somewhere.",
            "steam": "Steam URL. Makes the steam icon clickable; if you don't include it, we'll search steam for the title",
            "desura": "Desura URL. Makes the Desura icon clickable in tables.html",
            "developer": "Developer URL. If you don't include this, tables.html does a google search."
        },
        "notes": "some notes? Anything interesting that doesn't fit elsewhere",
        "extras": true/false
    },

You can generate this automatically over [here](http://calvein.github.io/humble-games/json.html).

Follow the syntax in the games.js document in case of differences between it and the above code.
