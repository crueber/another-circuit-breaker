
var commander = require("commander");
var express = require("express");
var request = require("request");


/**
* Handle a request that comes in.
*
* @param {object} req Our request object
* @param {object} res Our response object
* @param {string} url The URL of the bad web service
*/
function handleRequest(req, res, url) {

	//
	// This is something an overly clever node.js programmer might do.
	// Make the request respond after 500ms through use of setTimeout()
	// and some clever booleans.
	//

	var beenhere = false;

	var done = function(response) {


		if (beenhere) {
			//
			// Too little, too late.
			//
			return(null);
		}

		if (!response) {
			process.stdout.write("T");
		}

		process.stdout.write("R");
		res.send("Hello", 200);
		beenhere = true;

	}

	setTimeout(done, 500);

	request(url, function(error, result, body) {

		if (error) {
			//
			// Connection refused or similar sort of error. 
			// We don't expect these during our demo.
			//
			process.stdout.write("X");
			res.send("Error " + JSON.stringify(error), 200);

		} else {

			if (result.statusCode != 200) {
				process.stdout.write("E");

			} else {
				process.stdout.write("D");

			}

		}

		done(true);

	});
		
} // End of handleRequest()


/**
* Start up our webserver.
*/
function startServer(port, url) {

	var app = express();

	console.log("URL of bad web service is:", url);

	app.get("/", function(req, res) {
		handleRequest(req, res, url);
		});

	var server = app.listen(port, function() {
		console.log("Listening on port " + port);
		console.log();
		console.log("Key:");
		console.log("D = Data Received from bad web service");
		console.log("X = Connection error received from bad web service");
		console.log("R = Response sent to client");
		console.log("T = Timeout from bad web service");
		console.log("E = HTTP Error received from the bad web service");
		console.log();
	});

} // End of startServer()


/**
* Our main entry opint.
*/
function main() {

	commander
		.option("--url <url>", "Url of the bad web service")
		.parse(process.argv)
		;
	var url = commander.url || "http://localhost:3001/";

	var port = 3000;
	startServer(port, url);

} // End of main()


main();

