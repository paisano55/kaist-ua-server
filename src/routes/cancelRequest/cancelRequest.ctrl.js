const models = require('../../database/models');
const Op = require('sequelize').Op;

/**
 * POST /cancelRequest
 * { year, semester }
 */
exports.post = async (ctx) => {
  ctx.assert(ctx.request.user, 401);
  const { id } = ctx.request.user;
  const student = await models.Student.findOne({
    where: { id },
  });
  ctx.assert(student, 401);
  const { year, semester } = ctx.request.body;
  const { studentNumber } = student;
  const res = await models.CancelRequest.findOne({
    where: {
      studentNumber,
      year,
      semester,
    },
  });
  if (res) {
    ctx.status = 200;
    ctx.body = res;
  } else {
    const newRequest = await models.CancelRequest.create({
      studentNumber,
      year,
      semester,
    });
    ctx.assert(newRequest, 400);
    ctx.status = 204;
  }
};

/**
 * GET /cancelRequest/admin
 */
exports.getAll = async (ctx) => {
  ctx.assert(ctx.request.user, 401);
  const { id } = ctx.request.user;
  const admin = await models.Admin.findOne({
    where: { id },
  });
  ctx.assert(admin, 401);
  const res = await models.CancelRequest.findAll({
    order: [['ku_std_no', 'ASC']],
  });
  ctx.assert(res, 404);
  ctx.body = res;
};

/**
 * GET /cancelRequest
 */

exports.getOne = async (ctx) => {
  ctx.assert(ctx.request.user, 401);
  const { id } = ctx.request.user;
  const student = await models.Student.findOne({
    where: { id },
    include: models.CancelRequest,
  });
  ctx.assert(student.CancelRequests, 400);

  ctx.status = 200;
  ctx.body = student.CancelRequests;
};

/**
 * DELETE /cancelRequest
 */

exports.delete = async (ctx) => {
  ctx.assert(ctx.request.user, 401);
  const { id } = ctx.request.user;
  const { year, semester } = ctx.query;
  ctx.assert(year && semester, 400);
  const student = await models.Student.findOne({
    where: { id },
    include: { model: models.CancelRequest, where: { year, semester } },
  });
  if (!student) {
    ctx.status = 204;
    return;
  }
  ctx.body = student.CancelRequests[0].destroy();
};
