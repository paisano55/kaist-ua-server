const models = require("../../database/models");
const Op = require("sequelize").Op;

/** @swagger
 *  /intros:
 *    intro:
 *      summary: upload introductions
 *      tags: [Introuctions]
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: body
 *          name: intro
 *          schema:
 *            type: object
 *            properties:
 *              korTitle:
 *                type: string
 *              engTitle:
 *                type: string
 *              korContent:
 *                type: string
 *              engContent:
 *                type: string
 *              parentId:
 *                type: integer
 *              prevId:
 *                type: integer
 *      responses:
 *        200:
 *          description: Success
 *        204:
 *          description: No Content
 *        400:
 *          description: Bad Request
 *        401:
 *          description: Unauthorized
 *        404:
 *          description: Not Found
 *        500:
 *          description: Internal Server Error
 */
exports.write = async (ctx) => {

    ctx.assert(ctx.request.user, 401);
    const { id } = ctx.request.user;
    const admin = await models.Admin.findOne({
        where: { id },
    });
    ctx.assert(admin, 401);

    const intro = ctx.request.body;
    console.log(intro);

    const transaction = await models.sequelize.transaction();
    try {
        // If prevId is null, then it is the first intro
        if (!intro.prevId) {
            const originFirst = await models.Intro.findOne({
                where: {
                    parentId: !intro.parentId ? null : intro.parentId,
                    prevId: null,
                }
            });

            // Create new first intro
            const res = await models.Intro.create(intro, { transaction: transaction });

            // Update prevId of origin first intro to new first intro's id
            if (originFirst) {
                await models.Intro.update({ prevId: res.id }, {
                    where: {
                        id: originFirst.id,
                    },
                }, { transaction: transaction });
            }
        } else {
            // If prevId is not null, then it is not the first intro
            const originNext = await models.Intro.findOne({
                where: {
                    parentId: !intro.parentId ? null : intro.parentId,
                    prevId: intro.prevId,
                }
            });

            const res = await models.Intro.create(intro, { transaction: transaction });

            if (!!originNext) {
                await models.Intro.update({ prevId: res.id }, {
                    where: {
                        parentId: !intro.parentId ? null : intro.parentId,
                        id: originNext.id,
                    },
                }, { transaction: transaction });
            }
        }

        await transaction.commit();
        ctx.status = 200;
    } catch (err) {
        await transaction.rollback();
        ctx.status = 500;
        console.log(err);
    }
};

/** @swagger
 *  /intros:
 *    get:
 *      summary: obtain all intorduction headers
 *      description: gets title, etc
 *      tags: [Introuctions]
 *      produces:
 *        - application/json
 *      parameters:
 *      responses:
 *        200:
 *          description: Success
 *          schema:
 *            type: object
 *            properties:
 *              intros:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: string
 *                      format: uuid
 *                    title:
 *                      type: string
 *        204:
 *          description: No Content
 *        400:
 *          description: Bad Request
 *        401:
 *          description: Unauthorized
 *        404:
 *          description: Not Found
 *        500:
 *          description: Internal Server Error
 */
exports.list = async (ctx) => {

    const introsRaw = await models.Intro.findAll({
        raw: true,
    });

    if (introsRaw.length === 0) {
        ctx.status = 204;
        return;
    }

    const nonSubIntros = introsRaw.filter((intro) => {
        return intro.parentId === null;
    });

    const subIntros = introsRaw.filter((intro) => {
        return intro.parentId !== null;
    });

    const head = nonSubIntros.find((intro) => {
        // Filter out all sub-intros and return only the top-level intros
        return intro.prevId === null;
    });

    let intros = [];
    head.subIntros = [];
    intros.push(head);

    let currentId = head.id;
    while (true) {
        let next = nonSubIntros.find((intro) => {
            return intro.prevId === currentId;
        });
        if (next) {
            next.subIntros = [];
            intros.push(next);
            currentId = next.id;
        } else {
            break;
        }
    }

    intros.forEach((intro) => {
        const sub = subIntros.filter((subIntro) => {
            return subIntro.parentId === intro.id;
        });

        if (sub.length === 0) return;

        intro.subIntros.push(sub.find((subIntro) => subIntro.prevId === null));

        console.log(sub, intro.subIntros);
        let currentId = intro.subIntros[0].id;
        while (true) {
            let next = sub.find((subIntro) => {
                return subIntro.prevId === currentId;
            });
            if (next) {
                intro.subIntros.push(next);
                currentId = next.id;
            } else {
                break;
            }
        }
    });

    ctx.body = intros;
};

/** @swagger
 *  /intros/{id}:
 *    get:
 *      summary: obtain intro by ID
 *      tags: [intros]
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *      responses:
 *        200:
 *          description: Success
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: string
 *                format: uuid
 *              title:
 *                type: string
 *              author:
 *                type: string
 *              content:
 *                type: string
 *              views:
 *                type: integer
 *              bulletin_id:
 *                type: integer
 *        204:
 *          description: No Content
 *        400:
 *          description: Bad Request
 *        401:
 *          description: Unauthorized
 *        404:
 *          description: Not Found
 *        500:
 *          description: Internal Server Error
 */
exports.read = async (ctx) => {
    const { id } = ctx.params;

    await models.Intro.findOne({
        where: { id },
        raw: false,
    })
        .then((res) => {
            ctx.body = res;
            console.log(res);
        })
        .catch((err) => {
            console.error(err);
        });
};

/** @swagger
 *  /intros/{id}:
 *    delete:
 *      summary: delete intro by ID
 *      tags: [intros]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *      responses:
 *        200:
 *          description: Success
 *        204:
 *          description: No Content (successfully removed)
 *        400:
 *          description: Bad Request
 *        401:
 *          description: Unauthorized
 *        404:
 *          description: Not Found (intro doesn't exist)
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *                example: 포스트가 존재하지 않습니다.
 *        500:
 *          description: Internal Server Error
 */
exports.remove = async (ctx) => {
    ctx.assert(ctx.request.user, 401);
    const adminId = ctx.request.user.id;
    const admin = await models.Admin.findOne({
        where: { id: adminId },
    });
    ctx.assert(admin, 401);

    const id = ctx.params.id;
    // Delete and update should be done in a transaction (Because of prevId)
    const transaction = await models.sequelize.transaction();
    try {
        console.log(id);
        const res = await models.Intro.findOne({
            where: { id: id },
        })

        console.log(res);
        await models.Intro.update({ prevId: res.prevId }, {
            where: {
                prevId: id,
            },
        }, { transaction: transaction }); // Update prevId of next intro

        await models.Intro.destroy({
            where: {
                // Delete all intros with id or parentId of id (same as foreigen key cascading)
                [Op.or]: {
                    id: id,
                    parentId: id,
                }
            },
        }, { transaction: transaction })
            .then((res) => {
                if (!res) {
                    ctx.status = 404;
                    ctx.body = {
                        message: "소개글이 존재하지 않습니다.",
                    };
                } else {
                    ctx.status = 204;
                }
            });

        await transaction.commit();
    } catch (err) {
        await transaction.rollback();
        ctx.status = 500;
        console.error(err);
    }
};

/** @swagger
 *  /intros/{id}:
 *    patch:
 *      summary: update title or content of intro
 *      tags: [intros]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *        - in: body
 *          name: bulletin
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              author:
 *                type: string
 *              content:
 *                type: string
 *              views:
 *                type: integer
 *          required: true
 *      responses:
 *        200:
 *          description: Success
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              author:
 *                type: string
 *              content:
 *                type: string
 *              views:
 *                type: integer
 *        204:
 *          description: No Content
 *        400:
 *          description: Bad Request
 *        401:
 *          description: Unauthorized
 *        404:
 *          description: Not Found
 *        500:
 *          description: Internal Server Error
 */
exports.update = async (ctx) => {
    ctx.assert(ctx.request.user, 401);
    const adminId = ctx.request.user.id;
    const admin = await models.Admin.findOne({
        where: { id: adminId },
    });
    ctx.assert(admin, 401);


    const { id } = ctx.params;
    const intro = ctx.request.body;
    await models.Intro.update({
        // Change subId or prevId is not allowed
        korTitle: intro.korTitle,
        engTitle: intro.engTitle,
        korContent: intro.korContent,
        engContent: intro.engContent
    }, {
        where: { id: id },
    })
        .then((res) => {
            ctx.body = intro;
            console.log("소개글 업데이트 성공!");
        })
        .catch((err) => {
            console.error(err);
        });
};
