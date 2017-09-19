const fs = require('fs');
const dateFormat = require('dateformat');
const tools = require('./tools');
var dir = './data';
var fileName = 'data.txt';

module.exports = {
  calenderInit: function(window) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }



    var loadCalenderElements = `
    var date = new Date();
    var today = date.getDate();
    var month = date.getMonth()
    month = month + 1;

    var year = date.getFullYear();
    var formatted = dateFormat(date, 'mm/dd/yyyy');
    var calenderFrame = document.getElementById('calenderFrame');
    var calenderArray = [];
    var daysInMonth = tools.getDaysInMonth(month);

    var temp = daysInMonth - today;
    var index = daysInMonth - temp;
    for (var i = 1 ; i <= daysInMonth ; i++) {
        var div = document.createElement('div');
        var textArea = document.createElement('textarea');
        var titleDiv = document.createElement('div');
        calenderFrame.appendChild(div);
        div.appendChild(titleDiv);
        div.appendChild(textArea);
        titleDiv.innerHTML = month + '/' + i + '/' + year ;
        textArea.id = 'text' + i;
        titleDiv.id = 'title' + i;
        div.id = 'div' + i;

        div.style.cssText = 'background-color: white; box-sizing: border-box; white-Space: nowrap; display: inline-block; height: 140px; width: 140px;';
        textArea.style.cssText = 'background-color: white; height: 117px; width: 135px; border: none; resize: none; border-left: 1px solid grey; border-right: 1px solid grey; border-bottom: 1px solid grey; font: arial;';
        if (i == index) {
          textArea.style.backgroundColor = '#EEEDBF';
        }
        titleDiv.style.cssText = 'background-color: #1E8449; width: 138px; height: 20px; padding-left: 2px; color: white;';
    }
    `
    window.webContents.executeJavaScript(loadCalenderElements);
  },

  loadSaveData: function(window) {
    var loadSave = `
    var data = fs.readFileSync('./data/data.txt', 'utf-8');
    console.log(data);
    var dayArray = data.split(';');
    console.log(dayArray);

    var date = new Date();
    var today = date.getDate();
    month = date.getMonth();
    month = month + 1;

    var daysInMonth = tools.getDaysInMonth(month);


    var temp = daysInMonth - today;
    var index = daysInMonth - temp;
    var savedDay = dayArray[0];
    var textAreas = '';
    var n = 1;
    if (savedDay != today) {
      n = (today - savedDay) + 1;
    }
    for (var x = 1, i = index ; x <= daysInMonth ; x++, i++, n++) {
        textAreas = document.getElementById('text' + x);

        if (dayArray[n] == 'undefined') {
          textAreas.value = '';
        } else {
          textAreas.value = dayArray[n];
        }
    }

      `
    window.webContents.executeJavaScript(loadSave);
  }
}
