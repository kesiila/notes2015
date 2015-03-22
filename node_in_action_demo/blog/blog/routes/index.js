var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '主页' });
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
/* 注册 */
router.get('/reg', function(req, res, next) {
  res.render('index', { title: '注册' });
});
/* api-注册 */
router.post('/reg', function(req, res, next) {
});
/* 登录*/
router.get('/login', function(req, res) {
    res.render('login',{title: '登录'});
}

module.exports = router;
