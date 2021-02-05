const models = require('../../database/models');
const Op = require('sequelize').Op;

exports.write = async (ctx) => {
  ctx.assert(ctx.request.user, 401);
  const { id } = ctx.request.user;
  const student = await models.Student.findOne({
    where: { id },
  });
  ctx.assert(student, 401);
  const { korTitle, engTitle, korContent, engContent } = ctx.request.body;
  const res = await models.Petition.create({
    korTitle,
    engTitle,
    korContent,
    engContent,
    StudentId: id,
  });
  ctx.assert(res, 400);
  const a = await res.addStudents([student]);
  const newStudent = await models.Student.findOne({
    where: { id },
    include: models.Petition,
  });
  ctx.body = res;
  ctx.status = 200;
};

exports.list = async (ctx) => {
  const { page } = ctx.request.query;
  const PAGE_SIZE = 15;

  ctx.assert(page > 0, 400);

  const offset = PAGE_SIZE * (page - 1);

  const petitions = await models.Petition.findAll({
    order: [['createdAt', 'DESC']],
    offset,
    limit: PAGE_SIZE,
    raw: false,
    include: models.Student,
  });

  const petitionCount = await models.Petition.count();

  const lastPage = Math.ceil(petitionCount / PAGE_SIZE);

  ctx.body = { petitions, lastPage };
  ctx.status = 200;
};

exports.read = async (ctx) => {
  const { id } = ctx.params;

  const petitions = await models.Petition.findOne({
    where: { id },
    raw: false,
    include: models.Student,
  });

  console.log(petitions);

  ctx.body = petitions;
  ctx.status = 200;
};

exports.vote = async (ctx) => {
  ctx.assert(ctx.request.user, 401);
  const StudentId = ctx.request.user.id;
  const student = await models.Student.findOne({
    where: { id: StudentId },
  });
  ctx.assert(student, 401);

  const { id } = ctx.params;

  const petition = await models.Petition.findOne({
    where: { id },
    include: models.Student,
  });
  ctx.assert(petition, 400);

  const exists = petition.Students.some((petitionStudent) => {
    return petitionStudent.id === StudentId;
  });

  if (exists) {
    ctx.status = 204;
    return;
  }

  petition.addStudents([student]);

  ctx.body = petition.id;
  ctx.status = 200;
};

exports.delete = async (ctx) => {
  ctx.assert(ctx.request.user, 401);
  const StudentId = ctx.request.user.id;
  const student = await models.Student.findOne({
    where: { id: StudentId },
  });
  const { PetitionId } = ctx.request.params;
  const petition = await models.Petition.findOne({
    where: { id: PetitionId },
  });
  ctx.assert(petition.StudentId === StudentId, 401);

  await petition.destroy();

  ctx.status = 204;
};
