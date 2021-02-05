const models = require('../../database/models');

/** @swagger
 *  /boards:
 *    post:
 *      summary: create board
 *      tags: [Boards]
 *      parameters:
 *        - $ref: "#/parameters/adminAuth@header"
 *        - in: body
 *          name: board
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              description:
 *                type: string
 *          required: true
 *      responses:
 *        200:
 *          description: Success
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: integer
 *              title:
 *                type: string
 *              description:
 *                type: string
 *              updated_at:
 *                type: string
 *                format: date-time
 *              created_at:
 *                type: string
 *                format: date-time
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
exports.create = async (ctx) => {
  const {
    korTitle,
    engTitle,
    korDescription,
    engDescription,
  } = ctx.request.body;
  const board = { korTitle, engTitle, korDescription, engDescription };
  const res = await models.Board.create(board);

  ctx.assert(res, 400);

  ctx.status = 204;
  ctx.body = res;
};

/** @swagger
 *  /boards:
 *    get:
 *      summary: obtain all boards
 *      tags: [Boards]
 *      produces:
 *        - application/json
 *      responses:
 *        200:
 *          description: Success
 *          schema:
 *            type: array
 *            items:
 *              type: object
 *              properties:
 *                id:
 *                  type: integer
 *                title:
 *                  type: string
 *                description:
 *                  type: string
 *                created_at:
 *                  type: string
 *                  format: date-time
 *                updated_at:
 *                  type: string
 *                  format: date-time
 *                deleted_at:
 *                  type: string
 *                  nullable: true
 *                  format: date-time
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
  const res = await models.Board.findAll();
  ctx.assert(res, 404);
  ctx.body = res;
};

/** @swagger
 *  /boards/{id}:
 *    delete:
 *      summary: delete board by ID
 *      tags: [Boards]
 *      parameters:
 *        - $ref: "#/parameters/adminAuth@header"
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
 *          description: Not Found (board doesn't exist)
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *                example: 게시판이 존재하지 않습니다!
 *        500:
 *          description: Internal Server Error
 */
exports.delete = async (ctx) => {
  const { id } = ctx.params;
  ctx.assert(id, 400);
  const res = await models.Board.findOne({
    where: {
      id,
    },
  });
  assert(res, 404);
  res.destroy();
  ctx.status = 204;
};

/** @swagger
 *  /boards/{id}:
 *    patch:
 *      summary: update title or description of board
 *      tags: [Boards]
 *      parameters:
 *        - $ref: "#/parameters/adminAuth@header"
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *        - in: body
 *          name: board
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              description:
 *                type: string
 *          required: true
 *      responses:
 *        200:
 *          description: Success
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              description:
 *                type: string
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
exports.edit = async (ctx) => {
  const { id } = ctx.params;
  const { title, description } = ctx.request.body;
  const board = {
    title: title,
    description: description,
  };

  const res = await models.Board.update(board, {
    where: { id },
  });
  ctx.assert(res, 404);
  ctx.status = 200;
  ctx.body = res;
};
