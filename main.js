'use strict';
const { app, BrowserWindow} = require('electron');
let win;

function createWindow () {
  win = new BrowserWindow({
    backgroundColor:"#ffffff",
    show: false,
    title: "Biblioteca",
    width: 800,
    minWidth: 400,
    height: 600,
    minHeight: 540,
    webPreferences: {
      nodeIntegration: true,
      devTools: false
    },
    frame: false,
    icon: __dirname + "./client/src/icon.ico"
  });
  win.loadFile("./client/index.html");
  win.once("ready-to-show",()=> win.show());
  win.on("closed", () => {
    win = null;
  });
}

app.on("ready", createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});