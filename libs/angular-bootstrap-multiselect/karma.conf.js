// Karma configuration
// Generated on Wed May 21 2014 09:55:50 GMT+0200 (CEST)

module.exports = function(config) {
	config.set({
		basePath     : "),
		frameworks   : ["ng-scenario"],
		files        : [
			"angular-bootstrap-multiselect.js",
			"app.js",
			"test.js",
			"index.html"
		],
		exclude      : [],
		preprocessors: {},
		reporters    : ["progress"],
		port         : 8001,
		colors       : true,
		logLevel     : config.LOG_INFO,
		autoWatch    : true,
//		browsers     : ["PhantomJS", "Chrome", "Firefox", "Opera"],
		browsers     : ["Chrome"],
		singleRun    : false,
		proxies   : {
<<<<<<< HEAD
			"/": "http://localhost:8000/"
=======
<<<<<<< HEAD
			"/": "http://localhost:8080/"
=======
			"/": "http://localhost:8000/"
>>>>>>> 358204589577050fc244462fbc6203dfe291bff9
>>>>>>> 42ac29156284ed66f13c6c2b5a175244bf396642
		}
	});
};
