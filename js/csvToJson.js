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
/*
Here We have defined all thr required variable which are used to generate JSON files
 */
var isheader = true;
var manupulated = [],
	header = [];
var headerIndex = 0,
	saltIndex = 0,
	sugarIndex = 0,
	proteinIndex = 0,
	carbohydrateIndex = 0,
	fatIndex = 0;
var firstJson = [],
	secondJson = [],
	saltData = [],
	sugarData = [],
	proteinData = [],
	fatData = [],
	carbohydrateData = [],
	counterCountriesSalt = [],
	counterCountriesSugar = [];
var index, protein, fat, carbohydrate;
var countries = ["Netherlands", "Canada", "United Kingdom", "Australia", "France", "Germany", "Spain", "South Africa"];
var northEurope = ["United Kingdom", "Denmark", "Sweden", "Norway"];
var centralEurope = ["France", "Belgium", "Germany", "Switzerland", "Netherlands"];
var southEurope = ["Portugal", "Greece", "Italy", "Spain", "Croatia", "Albania"];
var regions = ["North Europe", "Central Europe", "South Europe"];
var regex = /,(?=(?:[^"]|"[^"]*")*$)/;
var input = fs.createReadStream("./csv/FoodFacts.csv");
var readInterface = rL.createInterface({
	input: input,
	terminal: false
});
/**
 * [for is used to intialise saltData & sugarData]
 * @param  {[Number]} var i [is use to iterate]
 *
 */
for (var i = 0; i < countries.length; i++) {
	saltData[i] = 0;
	sugarData[i] = 0;
	counterCountriesSalt[i] = 0;
	counterCountriesSugar[i] = 0;
}
/**
 * [for is use to initialise ]
 * @param  {[Number]} var i [is use to iterate]
 */
for (var i = 0; i < regions.length; i++) {
	proteinData[i] = 0;
	fatData[i] = 0;
	carbohydrateData[i] = 0;
}
/**
 * [readInterface is a pointer which will read file line by line]
 * @param  {[string]} line) {	if         (isheader [to filter header data]
 */
readInterface.on('line', function(line) {
	if (isheader === true) {
		header = line.split(",");
		// Here we have populated index of required data to be used to fetch from CSV file
		headerIndex = header.indexOf("countries_en");
		saltIndex = header.indexOf("salt_100g");
		sugarIndex = header.indexOf("sugars_100g");
		proteinIndex = header.indexOf("proteins_100g");
		carbohydrateIndex = header.indexOf("carbohydrates_100g");
		fatIndex = header.indexOf("fat_100g");
		isheader = false;
	}
	// data will get populated with a line of a input after every line read and split using a regular experession
	var data = line.split(regex);
	/**
	 * [if is use to check if a readed ]
	 * @param  {Number} countries.indexOf(data[headerIndex]) !             [if in a data at headerIndex value not found in countries array it will return -1]
	 */
	if (countries.indexOf(data[headerIndex]) != -1) {
		index = countries.indexOf(data[headerIndex]);
		var salt = data[saltIndex];
		var sugar = data[sugarIndex];

		if (salt !== "") {
			saltData[index] += parseFloat(salt);
			counterCountriesSalt[index] += 1;
		}

		if (sugar !== "") {
			sugarData[index] += parseFloat(sugar);
			counterCountriesSugar[index] += 1;
		}


	}
	/**
	 * [if description]
	 * @param  {[Number]} (northEurope.indexOf(data[headerIndex]) !         [if in data at header index value not found in north Europe then it will return -1]
	 */
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
		obj.salt = (saltData[i] / counterCountriesSalt[i]);
		obj.sugar = (sugarData[i] / counterCountriesSugar[i]);
		firstJson.push(obj);

	}
	for (var j = 0; j < regions.length; j++) {
		var obj2 = {},obj3={},obj4={},obj5={};
		var objArray;
		obj2.region = regions[j];
		obj3.item = "fat";
		obj3.value=fatData[j];
		obj4.item ="protein";
		obj4.value=proteinData[j];
		obj5.item = "carbohydrate";
		obj5.value = carbohydrateData[j];
		objArray = [obj3,obj4,obj5];
		obj2.consumption = objArray
		secondJson.push(obj2);
	}
	fs.writeFile('./json/countries.json', JSON.stringify(firstJson), 'utf-8');
	fs.writeFile('./json/regions.json', JSON.stringify(secondJson), 'utf-8');
});