#!/bin/sh

electron-packager . enuts --platform=win32 --arch=ia32 --electron-version=1.6.14 --overwrite --icon=img/enuts_icon.ico
cp -r enuts-win32-ia32/ "/Users/kyo5884/VirtualBox VMs/share-folder/enuts-win32-ia32"

electron-packager . enuts --platform=linux --arch=ia32 --electron-version=1.6.14 --overwrite --icon=img/enuts_icon.ico
cp -r enuts-linux-ia32/ "/Users/kyo5884/VirtualBox VMs/share-folder/enuts-linux-ia32"

electron-packager . enuts --platform=linux --arch=x64 --electron-version=1.6.14 --overwrite --icon=img/enuts_icon.ico

electron-packager . enuts --platform=darwin --arch=x64 --electron-version=1.6.14 --overwrite --icon=img/enuts_icon.icns