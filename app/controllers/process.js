var express = require('express'),
		router = express.Router();

var path = require('path'),
    rootPath = path.normalize(__dirname + '/..');
    var hbs;

module.exports = function(app) {
	app.use(router);
	hbs = app.get('hbs');
}

router.post('/process', function(req, res) {
	req.package = req.body.package;
	collectPackagePages(req.package, res);
});

var packagePages = {
	// 有順序
	lite: ['agreement', 'experience', 'skills', 'finish'],
	combo: ['agreement', 'experience', 'skills', 'education', 'language', 'finish'],
	custom: ['agreement', 'skills']
}

function collectPackagePages(packageName, res) {
	var package = packagePages[packageName];
	// if (collectPackagePages[packageName]) return collectPackagePages[package];
	var pages = collectPackagePages[packageName] =  {};

	// 創造新的closure儲存對page的參考
	for (var page in package) (function(index) {
			hbs.render(rootPath + '/views/components/' + package[index] + '.handlebars', {greetings: '使用者協議'}).then(function(contentStr) {

				pages[index] = contentStr;
				console.log(index + contentStr);
				if (index == (package.length - 1)) res.send(pages);
			});
		})(page)
}

