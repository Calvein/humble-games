Humble Games
============

All the games from http://www.humblebundle.com/

To add games, just edit the [games.js](https://github.com/Calvein/humble-games/blob/gh-pages/scripts/games.js)
based on the example bellow.  
You can generate this automatically over [here](http://calvein.github.io/humble-games/json.html).

    {
        "name": NAME,
        "url": URL,
        "price": PRICE (without currency),
        "description": DESCRIPTION,
        "developer": DEVELOPER,
        "platform": {
            "android": true/false,
            "linux": true/false,
            "windows": true/false,
            "mac": true/false,
            "audio": true/false
        }
        "DRM": {
            "steam": true/false,
            "desura": true/false,
            "GOG": true/false,
            "DRM-Free": true/false
        }
    },


Follow the syntax in the games.js document in case of differences between it and the above code.
