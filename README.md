humble-games
============

All the games from http://www.humblebundle.com/

To add games, just edit the [games.js](https://github.com/Calvein/humble-games/blob/gh-pages/games.js)
file and INSERT the following, where the url fragment is http://www.humblebundle.com/store/product/<b>awesomegame</b>:

    {
        "name": NAME,
        "url": URL,
        "price": PRICE (without currency),
        "description": DESCRIPTION,
        "developer": DEVELOPER,
        "platform": {
            "android": false,
            "linux": false,
            "windows": false,
            "mac": false,
            "audio": false
        },
        "DRM": {
            "steam": false,
            "desura": "",
            "GOG": false,
            "DRMFree": false
        },
        "URL": {
            "review": "",
            "steam": "",
            "desura": "",
            "developer": ""
        },
        "notes": "",
        "extras": false
    },

You can generate this automatically over [here](http://calvein.github.io/humble-games/json.html).

Follow the syntax in the games.js document in case of differences between it and the above code.
