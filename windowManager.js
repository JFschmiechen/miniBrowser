const {Tray, Menu, app, BrowserWindow, ipcRenderer, globalShortcut} = require('electron');
const path = require('path');
const url = require('url');
const calenderManager = require('./calenderManager');
const fs = require('fs');
const tools = require('./tools');
const request = require('request');
var Positioner = require('electron-positioner');
var ipc = require('electron').ipcMain;
var pageArray = [];


let win;

function createWindow() {

  win = new BrowserWindow({
    width: 617,
    height: 220,
    show: false,
    frame: false,
    fullScreenable: false,
    maximizable: false,
    center: false,
    alwaysOnTop: true,
    icon: './newImage.png'
  });

  var pos = new Positioner(win); // Positions BrowserWindow to the bottom right;
  pos.move('bottomRight');

  win.loadURL(url.format({
    pathname :path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true

  }));

  win.on('closed', () => {
    win = null;

  });

  win.once('ready-to-show', () => {
    win.show();
    var window = BrowserWindow.getFocusedWindow();
    globalShortcut.register('Alt+c', () => {
      console.log(window.isMinimized())
      if (window.isMinimized()) {
        window.show();
      } else {
        tools.minimizeFunction(window);
      }
    });

    calenderManager.calenderInit(window);
    calenderManager.loadSaveData(window);
  });
}

app.on('ready', createWindow);

ipc.on('closeAction', () => {
  var window = BrowserWindow.getFocusedWindow();
  window.close();

});

ipc.on('minimizeAction', () => {
  var window = BrowserWindow.getFocusedWindow();
  tools.minimizeFunction(window);

});

ipc.on('saveAction', () => {
  var date = new Date();
  var today = date.getDate();
  month = date.getMonth();
  month = month + 1;

  var daysInMonth = tools.getDaysInMonth(month);

  var temp = daysInMonth - today;
  var index = daysInMonth - temp;
  var textAreas = '';
  fs.writeFileSync('./data/data.txt', today + ';');

  var saveCalenderContents = `
  for (var i = 1 ; i <= daysInMonth ; i++) {
    textAreas = document.getElementById('text' + i);
    fs.appendFileSync('./data/data.txt', textAreas.value + ';', function (err) {
      if (err) throw err;

    });
  }
  `
  win.webContents.executeJavaScript(saveCalenderContents);
});
  var count = 0;
ipc.on('clearAction', () => {
  var date = new Date();
  month = date.getMonth();
  month = month + 1;

  var daysInMonth = tools.getDaysInMonth(month);

  var clearCode = `
  var areYouSure = document.getElementById('areYouSure');
  var clearCalenderButton = document.getElementById('clearCalenderButton');
  if (areYouSure.style.display == 'none') {
    for (var i = 1 ; i <= 100 ; i++) {
      setTimeout(function() {
        areYouSure.style.maxWidth = i + '%';
        clearCalenderButton.style.outline = 'none';
      }, 200);
    }
    areYouSure.style.display = 'inline-block';

  } else {
    for (var i = 1 ; i <= daysInMonth ; i++) {
      textAreas = document.getElementById('text' + i);
      textAreas.value = '';
    }

    clearCalenderButton.style.outline = '';
    areYouSure.style.maxWidth = 0;
    areYouSure.style.display = 'none';
  }

  setTimeout(function() {
    clearCalenderButton.style.outline = '';
    areYouSure.style.maxWidth = 0;
    areYouSure.style.display = 'none';
  }, 10000)
  `
  win.webContents.executeJavaScript(clearCode);
})

ipc.on('collapseAction', () => {
  var date = new Date();
  var month = date.getMonth();
  var daysInMonth = tools.getDaysInMonth(month);

  var collapseCode = `
  var textAreas = '';
  var days = '';
  for (var i = 1 ; i <= daysInMonth ; i++) {
    days = document.getElementById('div' + i);
    textAreas = document.getElementById('text' + i);

    if (textAreas.value == '') {
      days.style.display = 'none';
    }
  }
  `
  win.webContents.executeJavaScript(collapseCode);
})

ipc.on('expandAction', () => {
  var date = new Date();
  var month = date.getMonth();
  var daysInMonth = tools.getDaysInMonth(month);

  var expandCode = `
  var textAreas = '';
  var days = '';
  for (var i = 1 ; i <= daysInMonth ; i++) {
    days = document.getElementById('div' + i);
    textAreas = document.getElementById('text' + i);

    if (textAreas.value == '') {
      days.style.display = 'inline-block';
    }
  }
  `
  win.webContents.executeJavaScript(expandCode);
})

ipc.on('lowerCalenderAction', (event, div) => {
  var dimensions = win.getSize();
  var pos = new Positioner(win);

  if (dimensions[1] == 220) {

    win.setSize(800, 700);
    toggleElements();
    pos.move('bottomRight');

  } else {

    win.setSize(617, 220);
    pos.move('bottomRight');
    toggleElements(div);

  }
});

function toggleElements() {
  lowerCode = `
  var wrapper = document.getElementById('calenderWrapper');

  var webView = document.getElementById('internetWindow');
  var searchBar = document.getElementById('searchBar');

  if (webView.style.display == 'none') {

    searchBar.style.display = '';
    webView.style.display = '';
    webView.style.minHeight = '100%';
    wrapper.style.display = 'none';

  } else {

    searchBar.style.display = 'none';
    webView.style.display = 'none';
    webView.style.minHeight = '0';
    wrapper.style.display = '';

  }
  `
  win.webContents.executeJavaScript(lowerCode);
}

ipc.on('searchAction', (event, website) => {
  pageArray.push(website);

  if (pageArray.length == 3) {
    pageArray.shift();
  }

  internetCode = `
  var input = document.getElementById('searchBar').value;
  var internetWindow = document.getElementById('internetWindow');
  if (input.substring(0, 4) == 'file') {
    internetWindow.setAttribute('src', input);
  } else {
    internetWindow.setAttribute('src', 'http://' + input);
  }
  `
  win.webContents.executeJavaScript(internetCode);
})

ipc.on('forwardAction', (event, internetWindow) => {

  internetWindow.src = 'http://' + pageArray[1];

  console.log('forward');
  console.log(pageArray[1])
  console.log(internetWindow);
})

ipc.on('backAction', (event, internetWindow) => {
  //var test = `
  internetWindow.src = 'https://www.' + pageArray[0] + '/';

  //`
  console.log('back');
  console.log(pageArray[0]);
  console.log(internetWindow);
  //win.webContents.executeJavaScript(test);
})
