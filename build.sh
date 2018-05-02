#!/bin/sh

PKG_VERSION=`node -pe 'require("./package.json").version'`

electron-packager . enuts --platform=win32 --arch=ia32 --electron-version=2.0.0 --overwrite --icon=img/enuts_icon.ico
cp -r enuts-win32-ia32/ "/Users/kyo5884/VirtualBox VMs/share-folder/enuts-win32-ia32"

electron-packager . enuts --platform=linux --arch=ia32 --electron-version=2.0.0 --overwrite --icon=img/enuts_icon.ico
cp -r enuts-linux-ia32/ "/Users/kyo5884/VirtualBox VMs/share-folder/enuts-linux-ia32"

electron-packager . enuts --platform=linux --arch=x64 --electron-version=2.0.0 --overwrite --icon=img/enuts_icon.ico

electron-packager . enuts --platform=darwin --arch=x64 --electron-version=2.0.0 --overwrite --icon=img/enuts_icon.icns

zip -r ~/Desktop/enuts-${PKG_VERSION}-linux.zip enuts-linux-ia32/
zip -r ~/Desktop/enuts-${PKG_VERSION}-linux-x64.zip enuts-linux-x64/
zip -r ~/Desktop/enuts-${PKG_VERSION}-win32.zip enuts-win32-ia32/
zip -r ~/Desktop/enuts-${PKG_VERSION}-darwin-x64.zip enuts-darwin-x64/