
/*
 * GET home page.
 */

exports.index = function(req, res) {
	res.render('index', { title: 'ECS272 Information Visualization' })
};

exports.critique = function(req, res) {
	res.render('critique', { title: 'Visualization Critique' })
};

exports.svm = function(req, res) {
	res.render('svm', { title: 'SVM Visualization' })
};

exports.chris = function(req, res) {
	res.render('chris', { title: 'd3.js Practice' })
};