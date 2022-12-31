const Router = require('koa-router');
const deadlines = new Router();
const deadlinesCtrl = require('./deadlines.ctrl');

deadlines.get('/', deadlinesCtrl.list);
deadlines.post('/', deadlinesCtrl.add);
deadlines.patch('/:id', deadlinesCtrl.update);
deadlines.delete('/:id', deadlinesCtrl.remove);

module.exports = deadlines;
