const models = require("../../database/models");
const Op = require("sequelize").Op;

/** @swagger
 *  /posts:
 *    post:
 *      summary: upload post
 *      tags: [Posts]
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: body
 *          name: post
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              author:
 *                type: string
 *              content:
 *                type: string
 *              bulletinId:
 *                type: integer
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
exports.write = async (ctx) => {
  console.log(ctx.request);
  ctx.assert(ctx.request.user, 401);
  const { id } = ctx.request.user;
  const admin = await models.Admin.findOne({
    where: { id },
  });
  ctx.assert(admin, 401);
  const post = ctx.request.body;
  post.BoardId = parseInt(post.boardId);
  console.log(post);
  const res = await models.Post.create(post);
  ctx.assert(res, 400);
  ctx.status = 204;
};

/** @swagger
 *  /posts:
 *    get:
 *      summary: obtain posts by page and bulletinId
 *      description: title and author are for searching specific posts (optional)
 *      tags: [Posts]
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: query
 *          name: page
 *          schema:
 *            type: string
 *          required: true
 *        - in: query
 *          name: title
 *          schema:
 *            type: string
 *        - in: query
 *          name: author
 *          schema:
 *            type: string
 *        - in: query
 *          name: bulletinId
 *          schema:
 *            type: string
 *          required: true
 *      responses:
 *        200:
 *          description: Success
 *          schema:
 *            type: object
 *            properties:
 *              posts:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: string
 *                      format: uuid
 *                    title:
 *                      type: string
 *                    author:
 *                      type: string
 *                    content:
 *                      type: string
 *                    views:
 *                      type: integer
 *                    bulletin_id:
 *                      type: integer
 *                    created_at:
 *                      type: string
 *                      format: date-time
 *                    updated_at:
 *                      type: string
 *                      format: date-time
 *                    deleted_at:
 *                      type: string
 *                      nullable: true
 *                      format: date-time
 *              lastPage:
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
exports.list = async (ctx) => {
  const { page, boardId } = ctx.request.query;
  const POST_NUM_PER_PAGE = 15;

  ctx.assert(page > 0, 400);

  const offset = POST_NUM_PER_PAGE * (page - 1);

  var where = { BoardId: parseInt(boardId) };

  const posts = await models.Post.findAll({
    order: [["createdAt", "DESC"]],
    offset: offset,
    limit: POST_NUM_PER_PAGE,
    where: where,
    raw: false,
  });

  const postCount = await models.Post.count({
    where: where,
  });

  const lastPage = Math.ceil(postCount / POST_NUM_PER_PAGE);

  ctx.body = { posts, lastPage };
};

/** @swagger
 *  /posts/{id}:
 *    get:
 *      summary: obtain post by ID
 *      tags: [Posts]
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
 *              created_at:
 *                type: string
 *                format: date-time
 *              updated_at:
 *                type: string
 *                format: date-time
 *              deleted_at:
 *                type: string
 *                nullable: true
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
exports.read = async (ctx) => {
  const { id } = ctx.params;

  await models.Post.findOne({
    where: { id },
    raw: false,
    include: models.Board,
  })
    .then((res) => {
      ctx.body = res;
      console.log(res);

      models.Post.update({ views: res.views + 1 }, { where: { id } });
    })
    .catch((err) => {
      console.log(err);
    });
};

/** @swagger
 *  /posts/{id}:
 *    delete:
 *      summary: delete post by ID
 *      tags: [Posts]
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
 *          description: Not Found (post doesn't exist)
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

  await models.Post.destroy({
    where: { id: id },
  })
    .then((res) => {
      if (!res) {
        ctx.status = 404;
        ctx.body = {
          message: "포스트가 존재하지 않습니다.",
        };
      } else {
        console.log("포스트 삭제 성공!");
        ctx.status = 204;
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

/** @swagger
 *  /posts/{id}:
 *    patch:
 *      summary: update title or content of post
 *      tags: [Posts]
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
  const { title, author, content, views } = ctx.request.body;
  const post = {
    title: title,
    author: author,
    content: content,
    views: views,
  };

  await models.Post.update(post, {
    where: { id: id },
  })
    .then((res) => {
      ctx.body = post;
      console.log("포스트 업데이트 성공!");
    })
    .catch((err) => {
      console.log(err);
    });
};
