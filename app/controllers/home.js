var express = require('express'),
  router = express.Router(),
  Article = require('../models/article');

  var path = require('path'),
    rootPath = path.normalize(__dirname + '/..');
    var hbs;


module.exports = function (app) {
	hbs = app.get('hbs');
  hbs.render(rootPath + '/views/index.handlebars', {title: '編譯過的'}).then(function(p) {
  	// console.log(p);
  });

	hbs.getTemplate(rootPath + '/views/index.handlebars').then(function (pages) {
	    // console.log('hi' + pages());
	});

		app.use('/', router);
 
};



router.get('/', function (req, res, next) {
  // var articles = [new Article(), new Article()];
  
   //  hbs.render(rootPath + '/views/index.handlebars', {title: 'NBA'}).then(function(p) {
   //  	res.content = p;
  	// 	next();
  	// });

    res.render('index', {
      title: 'Compiled template'
    });
});

