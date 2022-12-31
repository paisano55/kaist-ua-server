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

    console.log(ctx.request);
    ctx.assert(ctx.request.user, 401);
    const { id } = ctx.request.user;
    const admin = await models.Admin.findOne({
        where: { id },
    });
    ctx.assert(admin, 401);
    const rule = ctx.request.body;
    console.log(rule);
    const res = await models.Rule.create(rule);
    ctx.assert(res, 400);
    ctx.status = 204;

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
    const rules = await models.Rule.findAll();
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
    const { id } = ctx.params;

    await models.Rule.destroy({
        where: { id: id },
    })
        .then((res) => {
            if (!res) {
                ctx.status = 404;
                ctx.body = {
                    message: "회칙 항목이 존재하지 않습니다.",
                };
            } else {
                console.log("회칙 삭제 성공!");
                ctx.status = 204;
            }
        })
        .catch((err) => {
            console.log(err);
        });
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
    console.log(rule);

    await models.Rule.update(rule, {
        where: { id: id },
    })
        .then((res) => {
            ctx.body = rule;
            console.log("회칙 업데이트 성공!");
        })
        .catch((err) => {
            console.log(err);
        });
};
