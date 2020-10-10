const models = require('../../database/models');
const Op = require('sequelize').Op;

exports.bulkUpload = async (ctx) => {
  ctx.assert(ctx.request.user, 401);
  const { id } = ctx.request.user;
  const admin = await models.Admin.findOne({
    where: { id },
  });
  ctx.assert(admin, 401);
  const { studentNumberList, year, semester } = ctx.request.body;
  const bulkData = [];
  await Promise.all(
    studentNumberList.map(async (studentNumber) => {
      const payment = {
        studentNumber,
        year,
        semester,
      };
      const student = await models.Student.findOne({
        where: { studentNumber },
      });
      if (student) {
        payment.studentId = student.id;
        console.log(payment);
      }
      bulkData.push(payment);
    }),
  );
  const res = await models.Payment.bulkCreate(bulkData);
  if (res) {
    ctx.response.body = bulkData.length;
  }
};

exports.list = async (ctx) => {
  ctx.assert(ctx.request.user, 401);
  const { id } = ctx.request.user;
  const student = await models.Student.findOne({
    where: { id },
    include: models.Payment,
  });
  ctx.assert(student, 401);
  ctx.body = { payments: student.Payments };
};
