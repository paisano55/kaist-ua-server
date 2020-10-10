const Router = require('koa-router');
const cancelRequest = new Router();
const cancelRequestCtrl = require('./cancelRequest.ctrl');

cancelRequest.post('/', cancelRequestCtrl.post);
cancelRequest.get('/admin', cancelRequestCtrl.getAll);
cancelRequest.get('/', cancelRequestCtrl.getOne);
cancelRequest.delete('/', cancelRequestCtrl.delete);

module.exports = cancelRequest;
