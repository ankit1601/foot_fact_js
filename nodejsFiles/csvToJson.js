/**
 * [fs is the file system library of Node js to do operations on file]
 * @type {'name of the file module which is fs'}
 */
var fs = require('fs');
/**
 * [rL is the readLine library of node js to read file line by line]
 * @type {[type]}
 */
var rL = require('readline');
var isheader = true;
var manupulated = [],
	header = [];
var countries = ["Netherlands", "Canada", "United Kingdom", "Australia", "France", "Germany", "Spain", "South Africa"];
var northEurope = ["United Kingdom", "Denmark", "Sweden", "Norway"];
var centralEurope = ["France", "Belgium", "Germany", "Switzerland", "Netherlands"];
var southEurope = ["Portugal", "Greece", "Italy", "Spain", "Croatia", "Albania"];
var regions = ["North Europe", "Central Europe", "South Europe"];
var regex = /,(?=(?:[^"]|"[^"]*")*$)/;
var input = fs.createReadStream("./FoodFacts.csv");
var headerIndex = 0;
var saltIndex = 0;
var sugarIndex = 0;
var proteinIndex = 0;
var carbohydrateIndex = 0;
var fatIndex = 0;
var firstJson = [],
	secondJson = [];
var saltData = [],
	sugarData = [],
	proteinData = [],
	fatData = [],
	carbohydrateData = [];
var index,protein,fat,carbohydrate;
var readInterface = rL.createInterface({
	input: input,
	terminal: false
});
for (var i = 0; i < countries.length; i++) {
	saltData[i] = 0;
	sugarData[i] = 0;
}
for (var i = 0; i < regions.length; i++) {
	proteinData[i] = 0;
	fatData[i] = 0;
	carbohydrateData[i] = 0;
}
readInterface.on('line', function(line) {
	if (isheader === true) {
		header = line.split(",");
		headerIndex = header.indexOf("countries_en");
		saltIndex = header.indexOf("salt_100g");
		sugarIndex = header.indexOf("sugars_100g");
		proteinIndex = header.indexOf("proteins_100g");
		carbohydrateIndex = header.indexOf("fat_100g");
		fatIndex = header.indexOf("carbohydrates_100g");
		isheader = false;
	}
	var data = line.split(regex);
	if (countries.indexOf(data[headerIndex]) != -1) {
		index = countries.indexOf(data[headerIndex]);
		console.log(data[headerIndex]);
		var salt = data[saltIndex];
		var sugar = data[sugarIndex];

		if (salt === ""){
			salt = 0;
		}
		saltData[index] += parseFloat(salt);
		if (sugar === ""){
			sugar = 0;
		}
		sugarData[index] += parseFloat(sugar);
		console.log(saltData[index]);
		console.log(sugarData[index]);
	}
	if ((northEurope.indexOf(data[headerIndex]) != -1)) {
		index = regions.indexOf("North Europe");
		protein = data[proteinIndex];
		carbohydrate = data[carbohydrateIndex];
		fat = data[fatIndex];
		if (fat !== "") {
			fatData[index] += parseFloat(fat);
		}
		if (protein !== "") {
			proteinData[index] += parseFloat(protein);
		}
		if (carbohydrate !== "") {
			carbohydrateData[index] += parseFloat(carbohydrate);
		}
	}
	if ((centralEurope.indexOf(data[headerIndex]) != -1)) {
		index = regions.indexOf("Central Europe");
		protein = data[proteinIndex];
		carbohydrate = data[carbohydrateIndex];
		fat = data[fatIndex];
		if (fat !== "") {
			fatData[index] += parseFloat(fat);
		}
		if (protein !== "") {
			proteinData[index] += parseFloat(protein);
		}
		if (carbohydrate !== "") {
			carbohydrateData[index] += parseFloat(carbohydrate);
		}
	}
	if ((southEurope.indexOf(data[headerIndex]) != -1)) {
		index = regions.indexOf("South Europe");
		protein = data[proteinIndex];
		carbohydrate = data[carbohydrateIndex];
		fat = data[fatIndex];
		if (fat !== "") {
			fatData[index] += parseFloat(fat);
		}
		if (protein !== "") {
			proteinData[index] += parseFloat(protein);
		}
		if (carbohydrate !== "") {
			carbohydrateData[index] += parseFloat(carbohydrate);
		}
	}
});
readInterface.on('close', function() {
	for (var i = 0; i < countries.length; i++) {
		var obj = {};
		obj.country = countries[i];
		obj.salt = saltData[i];
		obj.sugar = sugarData[i];
		firstJson.push(obj);

	}
	for (var j = 0; j < regions.length; j++) {
		var obj2 = {};
		obj2.region = regions[j];
		obj2.fat = fatData[j];
		obj2.protein = proteinData[j];
		obj2.carbohydrate = carbohydrateData[j];
		secondJson.push(obj2);
	}
	fs.writeFile('first.json', JSON.stringify(firstJson), 'utf-8');
	fs.writeFile('second.json', JSON.stringify(secondJson), 'utf-8');
});