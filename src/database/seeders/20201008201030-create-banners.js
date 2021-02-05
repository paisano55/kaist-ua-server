"use strict";

const models = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await models.Banner.bulkCreate(
      [
        {
          image:
            "https://kaistua-web.s3.ap-northeast-2.amazonaws.com/Banner_kaiwiki.png",
          link: "https://student.kaist.ac.kr/wiki",
          isActive: 1,
        },
        {
          image:
            "https://kaistua-web.s3.ap-northeast-2.amazonaws.com/Banner2.png",
          link: "https://student.kaist.ac.kr/web/user/studentFee",
          isActive: 1,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Banner", null, {});
  },
};
