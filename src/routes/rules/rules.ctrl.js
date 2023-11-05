const models = require("../../database/models");
const Op = require("sequelize").Op;

/** @swagger
 *  /rules:
 *    rule:
 *      summary: upload rules
 *      tags: [Rule]
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: body
 *          name: rule
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
 *          required: true
 *        - in: query
 *          name: parents
 *          schema:
 *              parentId:
 *                type: integer
 *              childId:
 *                type: integer
 *      responses:
 *        200:
 *          description: Success
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: string
 *                format: uuid
 *              views:
 *                type: integer
 *              title:
 *                type: string
 *              author:
 *                type: string
 *              content:
 *                type: string
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
exports.write = async (ctx) => {

    ctx.assert(ctx.request.user, 401);
    const { id } = ctx.request.user;
    const admin = await models.Admin.findOne({
        where: { id },
    });
    ctx.assert(admin, 401);

    const rule = ctx.request.body;

    const transaction = await models.sequelize.transaction();
    try {
        // If prevId is null, then it is the first rule
        if (!rule.prevId) {
            const originFirst = await models.Rule.findOne({
                where: {
                    parentId: !rule.parentId ? null : rule.parentId,
                    prevId: null,
                }
            });

            // Create new first rule
            const res = await models.Rule.create(rule, { transaction: transaction });

            // Update prevId of origin first rule to new first rule's id
            if (originFirst) {
                await models.Rule.update({ prevId: res.id }, {
                    where: {
                        id: originFirst.id,
                    },
                }, { transaction: transaction });
            }
        } else {
            // If prevId is not null, then it is not the first rule
            const originNext = await models.Rule.findOne({
                where: {
                    parentId: !rule.parentId ? null : rule.parentId,
                    prevId: rule.prevId,
                }
            });

            const res = await models.Rule.create(rule, { transaction: transaction });

            if (!!originNext) {
                await models.Rule.update({ prevId: res.id }, {
                    where: {
                        parentId: !rule.parentId ? null : rule.parentId,
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
 *  /rules:
 *    get:
 *      summary: obtain all rule headers
 *      description: gets title, etc
 *      tags: [Rule]
 *      produces:
 *        - application/json
 *      parameters:
 *      responses:
 *        200:
 *          description: Success
 *          schema:
 *            type: object
 *            properties:
 *              rules:
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

    const rulesRaw = await models.Rule.findAll({
        raw: true,
    });

    if (rulesRaw.length === 0) {
        ctx.status = 204;
        return;
    }

    const nonSubRules = rulesRaw.filter((rule) => {
        return rule.parentId === null;
    });

    const subIntros = rulesRaw.filter((rule) => {
        return rule.parentId !== null;
    });

    const head = nonSubRules.find((rule) => {
        // Filter out all sub-rules and return only the top-level rules
        return rule.prevId === null;
    });

    let rules = [];
    head.subIntros = [];
    rules.push(head);

    let currentId = head.id;
    while (true) {
        let next = nonSubRules.find((rule) => {
            return rule.prevId === currentId;
        });
        if (next) {
            next.subIntros = [];
            rules.push(next);
            currentId = next.id;
        } else {
            break;
        }
    }

    rules.forEach((rule) => {
        const sub = subIntros.filter((subRule) => {
            return subRule.parentId === rule.id;
        });

        if (sub.length === 0) return;

        rule.subIntros.push(sub.find((subRule) => subRule.prevId === null));

        let currentId = rule.subIntros[0].id;
        while (true) {
            let next = sub.find((subRule) => {
                return subRule.prevId === currentId;
            });
            if (next) {
                rule.subIntros.push(next);
                currentId = next.id;
            } else {
                break;
            }
        }
    });

    ctx.body = rules;
};

/** @swagger
 *  /rules/{id}:
 *    get:
 *      summary: obtain rule by ID
 *      tags: [rules]
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

    await models.Rule.findOne({
        where: { id },
        raw: false,
    })
        .then((res) => {
            ctx.body = res;
            console.log(res);
        })
        .catch((err) => {
            console.log(err);
        });
};

/** @swagger
 *  /rules/{id}:
 *    delete:
 *      summary: delete rule by ID
 *      tags: [rules]
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
 *          description: Not Found (rule doesn't exist)
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
        const res = await models.Rule.findOne({
            where: { id: id },
        })

        console.log(res);
        await models.Rule.update({ prevId: res.prevId }, {
            where: {
                prevId: id,
            },
        }, { transaction: transaction }); // Update prevId of next rule

        await models.Rule.destroy({
            where: {
                // Delete all rules with id or parentId of id (same as foreigen key cascading)
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
 *  /rules/{id}:
 *    patch:
 *      summary: update title or content of rule
 *      tags: [rules]
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
    const rule = ctx.request.body;
    await models.Rule.update({
        // Change subId or prevId is not allowed
        korTitle: rule.korTitle,
        engTitle: rule.engTitle,
        korContent: rule.korContent,
        engContent: rule.engContent
    }, {
        where: { id: id },
    })
        .then((res) => {
            ctx.body = rule;
            console.log("소개글 업데이트 성공!");
        })
        .catch((err) => {
            console.error(err);
        });
};
