const Router = require('koa-router');

const posts = require('./posts');
const banners = require('./banners');
const boards = require('./boards');
const petitions = require('./petitions');
const admins = require('./admins');
const auth = require('./auth');
const payments = require('./payments');
const cancelRequest = require('./cancelRequest');
const intros = require('./intros');

const router = new Router();

router.get('/hello', (ctx) => {
  ctx.body = 'hello';
});

router.use('/auth', auth.routes());
router.use('/posts', posts.routes());
router.use('/admins', admins.routes());
router.use('/banners', banners.routes());
router.use('/boards', boards.routes());
router.use('/petitions', petitions.routes());
router.use('/payments', payments.routes());
router.use('/cancelRequest', cancelRequest.routes());
router.use('/intros', intros.routes());

module.exports = router;
