var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'TDesigner UI' });
});

router.get('/tong', function(req, res, next) {
    res.render('tong', { title: 'TDesigner UI' });
});

module.exports = router;
