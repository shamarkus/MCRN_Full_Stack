const express = require("express");
const $ = require("cheerio");
const rp = require("request-promise");
const riverWatcherURL = "https://www.riverwatcherdaily.is/Rivers"
const webdriver = require('selenium-webdriver');
 
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

async function runTestWithCaps (capabilities) {
	let driver = new webdriver.Builder()
	  .usingServer('http://markkarlov_ul9Bc4:cTDzs4pUgs8o5zwzYBNq@hub-cloud.browserstack.com/wd/hub')
	  .withCapabilities({
		...capabilities,
		...capabilities['browser'] && { browserName: capabilities['browser']}  // Because NodeJS language binding requires browserName to be defined
	  })
	  .build();
	  try {
	  await driver.get(riverWatcherURL);
	  await driver.wait(webdriver.until.titleMatches(/StackDemo/i), 10000);
	  // waiting until the Cart pane has been displayed on the webpage
	  await driver.findElements(webdriver.By.className("google-visualization-table-tr-even"))[5].click();
	  // locating product in cart and getting name of the product in cart
//	  let productCartText = await driver
//		.findElement(
//		  webdriver.By.xpath(
//			'//*[@id="__next"]/div/div/div[2]/div[2]/div[2]/div/div[3]/p[1]'
//		  )
//		)
//		.getText();
//	  // checking whether product has been added to cart by comparing product name
//	  if(productCartText !== productText) 
//		throw new Error("");
	  await driver.executeScript(
		'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Product has been successfully added to the cart!"}}'
	  );
	} catch (e) {
	  await driver.executeScript(
		'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Some elements failed to load!"}}'
	  );
	}
	await driver.quit();
  }
  const capabilities1 = {
	  'bstack:options' : {
		  "os": "Windows",
		  "osVersion": "11",
		  "buildName" : "browserstack-build-1",
		  "sessionName" : "Parallel test 1",
	  },
	  "browserName": "Chrome",
	  "browserVersion": "103.0",
	  }
// This section will help you get a list of all the records.
recordRoutes.route("/credit").post(function (req, res) {
	let strDate = req.body.day.slice(0,req.body.day.indexOf('T'));
	const [year, month, day] = strDate.split('-');

	runTestWithCaps(capabilities1);
});

recordRoutes.route("/ganaraska").post(function (req, res) {
	let strDate = req.body.day.slice(0,req.body.day.indexOf('T'));
	const [year, month, day] = strDate.split('-');
});

recordRoutes.route("/record").get(function (req, res) {
	let db_connect = dbo.getDb("employees");
	db_connect
		.collection("records")
		.find({})
		.toArray(function (err, result) {
			if (err) throw err;
			res.json(result);
	});
});

// This section will help you get a single record by id
recordRoutes.route("/record/:id").get(function (req, res) {
	let db_connect = dbo.getDb();
	let myquery = { _id: ObjectId(req.params.id) };
	db_connect
		.collection("records")
		.findOne(myquery, function (err, result) {
			if (err) throw err;
			res.json(result);
	});
});

// This section will help you create a new record.
recordRoutes.route("/record/add").post(function (req, response) {
	let db_connect = dbo.getDb();
	let myobj = {
		name: req.body.name,
		position: req.body.position,
		level: req.body.level,
	};
	db_connect.collection("records").insertOne(myobj, function (err, res) {
		if (err) throw err;
		response.json(res);
	});
});

// This section will help you update a record by id.
recordRoutes.route("/update/:id").post(function (req, response) {
	let db_connect = dbo.getDb();
	let myquery = { _id: ObjectId(req.params.id) };
	let newvalues = {
		$set: {
			name: req.body.name,
			position: req.body.position,
			level: req.body.level,
		},
	};
	db_connect
		.collection("records")
		.updateOne(myquery, newvalues, function (err, res) {
			if (err) throw err;
			console.log("1 document updated");
			response.json(res);
	});
});

// This section will help you delete a record
recordRoutes.route("/:id").delete((req, response) => {
	let db_connect = dbo.getDb();
	let myquery = { _id: ObjectId(req.params.id) };
	db_connect.collection("records").deleteOne(myquery, function (err, obj) {
		if (err) throw err;
		console.log("1 document deleted");
		response.json(obj);
	});
});

module.exports = recordRoutes;
