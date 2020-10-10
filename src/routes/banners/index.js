const Router = require('koa-router');
const banners = new Router();
const bannersCtrl = require('./banners.ctrl');

banners.get('/', bannersCtrl.list);
banners.post('/', bannersCtrl.upload);
banners.delete('/:id', bannersCtrl.remove);

module.exports = banners;
