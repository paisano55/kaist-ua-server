const models = require('../../database/models');

/** @swagger
 *  /banners:
 *    post:
 *      summary: upload url to banner image and hyperlink
 *      tags: [Banners]
 *      parameters:
 *        - $ref: "#/parameters/adminAuth@header"
 *        - in: body
 *          name: banner
 *          schema:
 *            type: object
 *            properties:
 *              url:
 *                type: string
 *              link:
 *                type: string
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
 *              url:
 *                type: string
 *              link:
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
exports.upload = async (ctx) => {
  const { image, link, isActive } = ctx.request.body;
  const res = await models.Banner.create({ image, link, isActive });
  ctx.assert(res, 400);
  ctx.status = 200;
  ctx.body = res;
};

/** @swagger
 *  /banners:
 *    get:
 *      summary: obtain all banners
 *      tags: [Banners]
 *      responses:
 *        200:
 *          description: Success
 *          schema:
 *            type: array
 *            items:
 *              type: object
 *              properties:
 *                id:
 *                  type: string
 *                  format: uuid
 *                url:
 *                  type: string
 *                link:
 *                  type: string
 *                updated_at:
 *                  type: string
 *                  format: date-time
 *                created_at:
 *                  type: string
 *                  format: date-time
 *                deleted_at:
 *                  type: string
 *                  format: date-time
 *                  nullable: true
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
  const banners = await models.Banner.findAll({ where: { isActive: true } });
  ctx.assert(banners, 404);
  ctx.body = banners;
};

/** @swagger
 *  /banners/{id}:
 *    delete:
 *      summary: delete banner by ID
 *      tags: [Banners]
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
 *          description: Not Found (failed to remove)
 *          schema:
 *            type: object
 *            properties:
 *              message:
 *                type: string
 *                example: 배너가 존재하지 않습니다.
 *        500:
 *          description: Internal Server Error
 */
exports.remove = async (ctx) => {
  const { id } = ctx.params;

  const banner = await models.Banner.findOne({
    where: { id: id },
  });
  ctx.assert(banner, 404);
  banner.destroy();
  ctx.status = 204;
};
