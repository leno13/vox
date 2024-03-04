# Readme

**GNU gettext look-alike for js.**

This is a translation (T9N) project for js called vox (for lack of a better name) - meaning voice in latin.

Can easily be converted to python or any other languages, by transcripting vox module :)

Why this? 
* Because translations are not accessed by key, and in case of a missing key or empty string you will still have the original text. eg: 

    `_translate(obj.title.info.i2.text)`

    vs

    `_t('You got mail')`

* because this will make code more readable.
* because translations dictionaries are managed through a software ( eg: poedit )


## Requirements
- linux or xgettext ( tested on Ubuntu 22.04.4 LTS )
- python3 ( tested with python 3.10 )
- poedit [here](https://poedit.net/) ( software for editing translations )


## Glosarry

- .po files: portable objects. Is the file that holds the translated texts. The line with # indicated the location from where the text has been retrieved. Has the following format:

        #: translate.js:94
        msgid "JSON files do require an explicit exports statement"
        msgstr "JSON-Dateien erfordern eine explizite Exports-Anweisung"

- .pot files: are .po template files. All the others .po files are generated from this file. Every key in this file is empty.
- xgettext: GNU utility used for retrieving the arguments of the functions.
- poedit: PC program to edit po files.
- po2json.py - utility for converting .po to .json 

## Generate .pot files
This command will search recursivly for all .js files in current dir and will retrieve the arguments of functions: _t , _tc , _t2

    # command (1)
    find ./ -type f -iname "*.js" | xargs xgettext --language=JavaScript --from-code=utf-8 --keyword=_t --keyword=_t2:1,2 --keyword=_tc:1c,2 --sort-output --output=./msg/de.pot

- _t  : is used for text/paragraph translation, no plural.
- _tc : translate with context. It is often used to disambiguate identical or similar strings that may have different translations depending on their context.
    
    eg: file could refer to a computer file, or a paper file.

        _tc('pcfile','file')
        _tc('paper','file')

- _t2 : pluralise translation. Based on the last argument (43) the correct form of pluralisation will be chosen between the first 2 arguments.

        _t2('I have %s apple', 'I have %s apples', 43) // will return: I have 43 apples

## po2json.py
First give execution rights to po2json.py

    chmod +x po2json.py

Convert the .po file to json format. Run the following command, for every .po file that you want to convert to .json.

    # command (2)
    
    # generates de.json in current dir
    ./po2json.py de.po 

    # Specify output directory:
    ./po2json.py de.po ./msg/translate

## New Translation
1) Extract the strings by generating the .pot file with command (1)
2) Open .pot file in poedit.
3) Because it is a new translation, poedit will ask you to generate a .po file. Do it.
4) Translate the texts.
5) Save file ( Ctrl + S )
6) Convert .po to .json with command (2)

## Update existing .po file
1) Regenerate .pot file with command (1)
2) Open .po file with poedit.
3) Go to: Translation -> Update from POT file. The lines with yellow are in a fuzzy state, meaning that source text has been altered. Fuzzy/yellow lines requires your attention.
4) Update translations
5) Save file ( Ctrl + S )
6) Convert .po to .json with command (2)

## API

* `vox.initPluralisation()`

    - set `vox.lang` to detected browser language

    - 1st argument overwrite detection, usecase: node.js. eg: `vox.initPluralisation("jp")`

* `vox.dex`

    - store the translation obj

* `vox.fetchDict(URL)`

    - returns the fetched translation obj, usage:

            vox.dex = await vox.fetchDict(URL)


## Example

1. Let's say you have a React proj.

* move generated file eg: `de.json` to `/public` dir.

* fetch .json dictionaries in index.js, before you mount the root.


        import React from "react"
        import ReactDOM from "react-dom/client"
        import reportWebVitals from "./reportWebVitals"

        import vox from 'util/vox.js'

        async function start() {
            
            vox.initPluralisation()
            let URL = `/${vox.lang}.json`
            vox.dex = await vox.fetchDict(URL)
            
            const root = ReactDOM.createRoot(document.getElementById("root"))
            root.render(
                <React.StrictMode>
                    <App />
                </React.StrictMode>
            )
        }
        start()
        reportWebVitals()


* somewhere in a component called login.js

        import vox from 'util/vox.js

        let _t = vox._t
        
        function Login(){
            return (
                <div>
                    <h3>{_t("Login")}</h3>
                    <input placeholder={_t("Type Email")}>
                    <input placeholder={_t("Type Password")}>
                    <button>{_t("Login")}</button>
                </div>
            )
        }

        export default Login
