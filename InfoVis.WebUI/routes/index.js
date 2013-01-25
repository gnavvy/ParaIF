
/*
 * GET home page.
 */

exports.index = function(req, res) {
	res.render('index', { title: 'ECS272 Information Visualization' })
};

exports.critique = function(req, res) {
	res.render('critique', { title: 'Visualization Critique' })
};

exports.d3js = function(req, res) {
	res.render('d3js', { title: 'd3.js Practice' })
};