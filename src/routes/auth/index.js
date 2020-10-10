const Router = require('koa-router');
const auth = new Router();
const authCtrl = require('./auth.ctrl');

auth.post('/signup', authCtrl.signup);
auth.get('/check', authCtrl.check);
auth.get('/logout', authCtrl.logout);

module.exports = auth;
