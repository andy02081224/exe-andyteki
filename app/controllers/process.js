var express = require('express'),
 		path = require('path'),
		router = express.Router(),
    rootPath = path.normalize(__dirname + '/..'),
		hbs;

var packages = {
	// pages in each package
	lite: ['agreement', 'experience', 'skills-1', 'skills-2', 'finish', 'lite'],
	combo: ['agreement', 'experience', 'skills-1', 'skills-2', 'education', 'language', 'finish', 'combo']
}

module.exports = function(app) {
	// Get handlebar instance which is set when running start script from app settings table
	hbs = app.get('hbs');
	app.use(router);
}

router.post('/process', function(req, res) {
	collectPackagePages(req.body.package, res);
});

function collectPackagePages(packageName, res) {
	var package = packages[packageName];

	// First check if the package already exists
	// If not, create a new object for the package
	// If yes, send the package directly and end the function
	if (!collectPackagePages[packageName]) {
		var pages = collectPackagePages[packageName] =  {};
	}
	else {
		res.send(collectPackagePages[packageName]);
		return; 
	}

	// Render and collect page data based on its name
	for (var page in package) (function(index) {
			hbs.render(rootPath + '/views/components/' + package[index] + '.handlebars').then(function(contentStr) {
				pages[index] = contentStr;
				// After collect all the data, send it to client
				if (index == (package.length - 1)) res.send(pages);
			});
		})(page)
}

