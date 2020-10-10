const Router = require('koa-router');
const boards = new Router();
const boardsCtrl = require('./boards.ctrl');

boards.post('/', boardsCtrl.create);
boards.get('/', boardsCtrl.list);
boards.delete('/:id', boardsCtrl.delete);
boards.patch('/:id', boardsCtrl.edit);

module.exports = boards;
