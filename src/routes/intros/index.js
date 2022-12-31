const Router = require('koa-router');
const intros = new Router();
const introsCtrl = require('./intros.ctrl');

intros.post('/', introsCtrl.write);
intros.get('/', introsCtrl.list);
intros.get('/:id', introsCtrl.read);
intros.patch('/:id', introsCtrl.update);
intros.delete('/:id', introsCtrl.remove);

module.exports = intros;
