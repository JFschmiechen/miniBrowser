const {Tray, Menu, app, BrowserWindow, ipcRenderer} = require('electron');
const path = require('path');

module.exports = {

// --Define tray behavior here--

  minimizeFunction: function(window) {

      let trayIcon = new Tray('./newImage.png');


       const trayMenuTemplate = [
          {
             label: 'Restore',
             click: function() {
               window.show();
               trayIcon.destroy();
             }
          },

          {
             label: 'Settings',
             click: function () {
                console.log('Clicked on settings')
             }
          },

          {
             label: 'Exit',
             click: function () {
                window.close();
             }
          }
       ]
       let trayMenu = Menu.buildFromTemplate(trayMenuTemplate)
       trayIcon.setContextMenu(trayMenu)
       window.minimize();
       window.hide();

       window.once('show', function() {
         trayIcon.destroy();
       });
  },

  getDaysInMonth: function(month) {

    var daysInMonth = 0;

    switch(month) {
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
      case 12:
        daysInMonth = 31;
        break;
      case 4:
      case 6:
      case 9:
      case 11:
        daysInMonth = 30;
        break;
      case 2:
        if (year % 4 == 0) {
          daysInMonth = 29;
        } else {
          daysInMonth = 28;
        }
        break;
      }

      return daysInMonth;

  }
}
