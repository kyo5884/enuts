const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;
const Store = require("electron-store");
const store = new Store();
const Menu = electron.Menu;
const Tray = electron.Tray;

var token;
var appIcon;
var force_quit = false;

var configWindow = null;

app.on("ready", function() {

  if (store.get("hideMenubarIcon", false) == false) {
    showAppIcon();
  }

  createMainWindow();
  console.log("enuts version " + app.getVersion());
  console.log("electron-store file path: " + store.path);
});

function showAppIcon() {
  if (process.platform == "win32") {
    appIcon = new Tray(__dirname + "/img/enuts_taskbar.png");
  } else {
    appIcon = new Tray(__dirname + "/img/enuts_menubar.png");
  }
  
  var appIconMenu = Menu.buildFromTemplate([
    {
      label: "Show enuts",
      click: function() { mainWindow.show(); }
    },
    {
      type: "separator"
    },
    {
      label: "Preferences...",
      click: function() { createConfigWindow(); }
    },
    {
      label: "Quit",
      click: function () { app.quit(); }
    }
  ]);
  appIcon.setContextMenu(appIconMenu);
  appIcon.setToolTip("");

  appIcon.on("double-click", function() {
    if (process.platform != "darwin") {
      mainWindow.show();
    }
  });
}

let mainWindow;
function createMainWindow() {

  var transparent_, frame_;
  if (process.platform == "darwin") {
    transparent_ = true;
    frame_ = true;
  } else {
    transparent_ = false;
    frame_ = false;
  }

  var options = {
    width: 300,
    height: 600,
    minWidth: 270,
    minHeight: 200,
    transparent: transparent_,
    frame: frame_,
    vibrancy: "dark",
    titleBarStyle: "hidden-inset",
    fullscreenable: false
  }
  Object.assign(options, store.get("windowBounds"));
  mainWindow = new BrowserWindow(options);

  mainWindow.loadURL("file://" + __dirname + "/index.html");
  mainWindow.webContents.on("did-finish-load", function() {
    token = store.get("token");
    mainWindow.webContents.send("token", token);
  });

  mainWindow.on("close", function(e) {
    store.set({"windowBounds": mainWindow.getBounds()});

    if (process.platform != "darwin") {
      app.quit();
    }

    if(force_quit == false) {
      e.preventDefault();
      mainWindow.hide();
    }
  });

  app.on('before-quit', function (e) {
    // Handle menu-item or keyboard shortcut quit here
    force_quit = true;
  });

  app.on('activate', function(){
    mainWindow.show();
  });

  var template = [
    {
      label: 'Edit',
      submenu: [
        {
          label: 'New Post',
          accelerator: 'CmdOrCtrl+N',
          click: function() {
            mainWindow.webContents.send("menu", "new");
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo'
        },
        {
          label: 'Redo',
          accelerator: 'Shift+CmdOrCtrl+Z',
          role: 'redo'
        },
        {
          type: 'separator'
        },
        {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut'
        },
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy'
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste'
        },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectall'
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: "Your Stream",
          accelerator: "CmdOrCtrl+1",
          click: function() {
            mainWindow.webContents.send("menu", "stream");
          }
        },
        {
          label: "Mentions",
          accelerator: "CmdOrCtrl+2",
          click: function() {
            mainWindow.webContents.send("menu", "mentions");
          }
        },
        {
          label: "Interactions",
          accelerator: "CmdOrCtrl+3",
          click: function() {
            mainWindow.webContents.send("menu", "interactions");
          }
        },
        {
          label: "Global",
          accelerator: "CmdOrCtrl+4",
          click: function() {
            mainWindow.webContents.send("menu", "global");
          }
        },
        {
          label: "Profile",
          accelerator: "CmdOrCtrl+5",
          click: function() {
            mainWindow.webContents.send("menu", "profile");
          }
        },
        {
          label: "Search",
          accelerator: "CmdOrCtrl+6",
          click: function() {
            mainWindow.webContents.send("menu", "search");
          }
        },
        {
          type: "separator"
        },
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: function () {
            mainWindow.webContents.send("reload");
          }
        },


        
        {
          label: 'Reload HTML',
          accelerator: 'CmdOrCtrl+Shift+R',
          click: function (item, focusedWindow) {
            if (focusedWindow) focusedWindow.reload();
          }
        },
        

        
        // {
        //   label: 'Toggle Full Screen',
        //   accelerator: (function () {
        //     if (process.platform === 'darwin') {
        //       return 'Ctrl+Command+F'
        //     } else {
        //       return 'F11'
        //     }
        //   })(),
        //   click: function (item, focusedWindow) {
        //     if (focusedWindow) {
        //       focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
        //     }
        //   }
        // },
        

        
        {
          label: 'Toggle Developer Tools',
          accelerator: (function () {
            if (process.platform === 'darwin') {
              return 'Alt+Command+I'
            } else {
              return 'Ctrl+Shift+I'
            }
          })(),
          click: function (item, focusedWindow) {
            if (focusedWindow) focusedWindow.toggleDevTools()
          }
        }



        
      ]
    },
    {
      label: 'Window',
      role: 'window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize'
        },
        {
          label: 'Close',
          accelerator: 'CmdOrCtrl+W',
          role: 'close'
        }
      ]
    },
    {
      label: 'Help',
      role: 'help',
      submenu: [
        {
          label: 'enuts Website',
          click: function () { electron.shell.openExternal('http://kyo5884.tk/enuts/') }
        }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    template.unshift({
      label: 'app-menu',
      submenu: [
/*
        {
          label: 'About...',
          role: 'about'
        },
        */
        {
          type: 'separator'
        },
        {
          label: "Preferences...",
          accelerator: 'Command+,',
          click: function() { createConfigWindow(); }
        },
        {
          type: 'separator'
        },
        {
          label: 'Services',
          role: 'services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          label: 'Hide',
          accelerator: 'Command+H',
          role: 'hide'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Alt+H',
          role: 'hideothers'
        },
        {
          label: 'Show All',
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: function () { app.quit() }
        }
      ]
    })
    // Window menu.
    template[3].submenu.push(
      {
        type: 'separator'
      },
      {
        label: 'Bring All to Front',
        role: 'front'
      }
    )
  }

  if (process.platform != "darwin") {
    // Edit menu
    template[0].submenu.push(
      {
        type: 'separator'
      },
      {
        label: "Preferences...",
        click: function() { createConfigWindow(); }
      }
    );
  }

  var menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function createConfigWindow() {
  if (configWindow != null) {
    configWindow.show();
  } else {
    configWindow = new BrowserWindow({
      width: 300,
      height: 500,
      resizable: false,
      minimizable: false,
      maximizable: false,
      show: false,
      title: "Preferences"
    });
    configWindow.loadURL("file://" + __dirname + "/config.html");
    configWindow.setMenu(null);
    configWindow.show();
    
    configWindow.on("closed", function() {
      configWindow = null;
    });
    
  }
}

ipcMain.on("winMaximize", () => {
  mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
});
ipcMain.on("winMinimize", () => {
  mainWindow.minimize();
  mainWindow.hide();
});
ipcMain.on("winRestore", () => {
  mainWindow.show();
  mainWindow.restore();
});

ipcMain.on("settingsUpdated", () => {
  mainWindow.webContents.send("settingsUpdated");
});

ipcMain.on("CreateAuthWindow", () => {
  var authWindow = new BrowserWindow({
      width: 800, 
      height: 600,
      show: false, 
      resizable: false,
      minimizable: false,
      maximizable: false,
      alwaysOnTop: true,
      parent: mainWindow,
      modal: true,
      title: "Authorization",
      'node-integration': false
      //'web-security': false
  });
  
  var authUrl = "https://pnut.io/oauth/authenticate?client_id=RGO-QYfHmH_Sk7JxtMa1TS_m8M4tnvBI&redirect_uri=http://kyo5884.tk/enuts/auth_done&scope=basic stream write_post follow update_profile presence files&response_type=token";

  authWindow.loadURL(authUrl);
  authWindow.setMenu(null);
  authWindow.show();
  // 'will-navigate' is an event emitted when the window.location changes
  // newUrl should contain the tokens you need
  authWindow.webContents.on('did-get-redirect-request', (event, newUrl) => {

    if (newUrl.match("http://kyo5884.tk/enuts/auth_done#access_token=")) {
      token = newUrl.match(/#access_token=(.+)/)[1];
      store.set("token", token);
      mainWindow.webContents.send("token", token);
      authWindow.close();
    }
  });

  authWindow.on('closed', function() {
      authWindow = null;
  });
});
