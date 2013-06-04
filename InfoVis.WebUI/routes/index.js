
/*
 * GET home page.
 */

exports.index = function(req, res) {
	res.render('index', { title: 'ECS272 Information Visualization' })
};