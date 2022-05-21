# ImageShrink

### Installation
_____________________________________________
To install the app, clone the repository to a local folder, then in a text editor of your choice
on the command line, run the script that matches your OS

```
"package-mac": "electron-packager . --overwrite --platform=darwin --arch=x64 --icon=assets/icons/mac/icon.icns --prune=true --out=release-builds",
"package-win": "electron-packager .  --overwrite --platform=win32 --arch=ia32 --icon=assets/icons/win/icon.ico --prune=false --out=release-builds --version-string.CompanyName=CE --version-string.FileDescription=CE --version-string.ProductName=\"ImageShrink app\"",
"package-linux": "electron-packager .  --overwrite --platform=linux --arch=x64 --icon=assets/icons/png/1024x1024.png --prune=false --out=release-builds"
```
i.e., if your on a Windows machine use `npm run package-win`

This will create the build folder, `release-builds`

from here inside the `release-builds` folder, locate the executable for the app, right-click
create a desktop shortcut app, or click on the app executable from the folder to run the program

### Liscence
__________
Electron is an open source language, therefor the entirety of the code and its application is fully available,
and able to be modified from your machine, `ImageShrink` is Available As-Is modification to the underlying code-base
can be done at your own risk.
