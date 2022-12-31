const models = require('../../database/models');

exports.add = async (ctx) => {
  const { year, semester, due } = ctx.request.body;
  const res = await models.Deadline.create({ year, semester, due });
  ctx.assert(res, 400);
  ctx.status = 200;
  ctx.body = res;
};

exports.list = async (ctx) => {
  const deadlines = await models.Deadline.findAll();
  ctx.assert(deadlines, 404);
  ctx.body = deadlines;
};

exports.update = async (ctx) => {
  const { id } = ctx.params;
  const { year, semester, due } = ctx.request.body;

  const res = await models.Deadline.update({ year, semester, due }, {
    where: { id: id },
  });
  ctx.assert(res, 404);
  ctx.status = 200;
  ctx.body = res;
};

exports.remove = async (ctx) => {
  const { id } = ctx.params;

  const deadline = await models.Deadline.findOne({
    where: { id: id },
  });
  ctx.assert(deadline, 404);
  deadline.destroy();
  ctx.status = 204;
};