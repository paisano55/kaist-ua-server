require('dotenv').config();
const Koa = require('koa');
const bodyParser = require('koa-body');
const cors = require('@koa/cors');
const logger = require('koa-logger');
const router = require('./src/routes');
const models = require('./src/database/models/index.js');
const helmet = require('koa-helmet');
const swagger = require('koa2-swagger-ui');
const swaggerDoc = require('./src/utils/swaggerDef.js');
const { jwtMiddleware } = require('./src/utils');

const run = async () => {
  const app = new Koa();

  models.sequelize
    .sync()
    .then(() => {
      console.log(' DB 연결 성공');
    })
    .catch((err) => {
      console.log('연결 실패');
      console.log(err);
    });

  app.use(cors({ credentials: true, origin: process.env.ORIGIN }));
  app.use(helmet());
  app.use(logger());
  app.use(bodyParser());
  app.use(jwtMiddleware);
  app.use(router.routes()).use(router.allowedMethods());
  app.use(
    swagger({
      routePrefix: '/swagger',
      swaggerOptions: {
        url: '/swagger.json',
      },
    }),
  );
  app.use(swaggerDoc.routes());

  const PORT = 8080;

  app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
  });
};

run();
