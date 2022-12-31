const Router = require('koa-router');
const rules = new Router();
const rulesCtrl = require('./rules.ctrl');

rules.post('/', rulesCtrl.write);
rules.get('/', rulesCtrl.list);
rules.get('/:id', rulesCtrl.read);
rules.patch('/:id', rulesCtrl.update);
rules.delete('/:id', rulesCtrl.remove);

module.exports = rules;
