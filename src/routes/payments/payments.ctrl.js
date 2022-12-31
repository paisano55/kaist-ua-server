const models = require('../../database/models');
const Op = require('sequelize').Op;

exports.bulkUpload = async (ctx) => {
  ctx.assert(ctx.request.user, 401);
  const { id } = ctx.request.user;
  const admin = await models.Admin.findOne({
    where: { id },
  });
  ctx.assert(admin, 401);
  const { studentDataCollection } = ctx.request.body;
  const bulkData = [];
  const semesters = ['spring', 'fall'];
  await Promise.all(
    studentDataCollection.map(async (studentData) => {
      const studentNumber = studentData.shift();
      const student = await models.Student.findOne({
        where: { studentNumber },
      });
      let StudentId;
      if (student) {
        StudentId = student.id;
      }
      for (var i = 0; i < studentData.length; i++) {
        if (studentData[i] === '1') {
          const payment = {
            studentNumber,
            year: `${parseInt(i / 2) + 2016}`,
            semester: semesters[i % 2],
            StudentId,
          };
          bulkData.push(payment);
        }
      }
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

/**
 * POST /getAll
 * { year, semester }
 * or none for **EVERYTHING**
 */
exports.getAll = async (ctx) => {
  const fs = require('fs');
  if (!fs.existsSync('./payment-log')) {
    fs.mkdirSync('./payment-log');
  }
  utc = new Date();
  console.log(`TRY TO ACCESS payment list from IP : ${ctx.request.ip} at ${utc}`)
  fs.writeFile(`./payment-log/payment-access-try-${utc}.txt`,
    `TRY TO ACCESS payment list from IP : ${ctx.request.ip} at ${utc}
    Request Body : ${JSON.stringify(ctx.request.body)}
    This log file is created before authentication.`,
    (err) => {
      if (err) console.log('Error during create log: ', err);
      else console.log('Log created');
    });
  ctx.assert(ctx.request.user, 401);
  const { id } = ctx.request.user;
  const admin = await models.Admin.findOne({
    where: { id },
  });
  ctx.assert(admin, 401);
  const getEverything = ctx.request.body.length > 5 ? false : true;

  if (getEverything === false) {
    const { year, semester } = ctx.request.body;
    const res = await models.Payment.findAll({
      where: {
        year,
        semester,
      },
      order: [['ku_std_no', 'ASC']],
    });
  } else {
    const res = await models.Payment.findAll({
      order: [['ku_std_no', 'ASC']],
    });
  }
  console.log(`ID : ${id}, SUCCESSLY ACCESSED payment list ${getEverything ? "OF ALL TIME" : null} from IP : ${ctx.request.ip}. Detail Content is in log file.`);
  fs.writeFile(`./payment-log/payment-access-success-${utc}.txt`,
    `ID : ${id}, ACCESSED payment list ${getEverything ? "OF ALL TIME" : null} from IP : ${ctx.request.ip} at ${utc} 
    Request Body : ${JSON.stringify(ctx.request.body)}
    Response Body : ${JSON.stringify(res)}
    This log file is created after authentication and successful response.`,
    (err) => {
      if (err) console.log('Error during create log: ', err);
      else console.log('Log created');
    });
  ctx.assert(res, 404);
  ctx.body = res;
};

