const Router = require('koa-router');
const petitions = new Router();
const petitionsCtrl = require('./petitions.ctrl');

petitions.post('/', petitionsCtrl.write);
petitions.get('/', petitionsCtrl.list);
petitions.get('/:id', petitionsCtrl.read);
petitions.post('/vote/:id', petitionsCtrl.vote);

module.exports = petitions;
