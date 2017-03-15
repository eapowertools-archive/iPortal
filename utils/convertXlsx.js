var xl = require('xlsx');
var fs = require('fs');
var path = require('path');
var wb = xl.readFile(path.join(__dirname, "../udc/excel/iportal_users.xlsx"));


fs.writeFileSync(path.join(__dirname, "../udc/iportal_users.csv"), xl.utils.sheet_to_csv(wb.Sheets["Users"]));

fs.writeFileSync(path.join(__dirname, "../udc/iportal_attributes.csv"), xl.utils.sheet_to_csv(wb.Sheets["Attributes"]));

console.log("Excel file converted to two csv files");