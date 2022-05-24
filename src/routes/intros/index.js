const Router = require('koa-router');
const posts = new Router();
const introsCtrl = require('./intros.ctrl');

posts.post('/', introsCtrl.write);
posts.get('/', introsCtrl.list);
posts.get('/:id', introsCtrl.read);
posts.patch('/:id', introsCtrl.update);
posts.delete('/:id', introsCtrl.remove);

module.exports = posts;
