"use strict";

const models = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await models.PostTag.bulkCreate(
      [
        {
          korName: "회장단",
          engName: "Presidency",
          BoardId: 1,
        },
        {
          korName: "협력국",
          engName: "Bureau of Internal Operations and Communications",
          BoardId: 1,
        },
        {
          korName: "복지국",
          engName: "Bureau of Welfare",
          BoardId: 1,
        },
        {
          korName: "정책국",
          engName: "Bureau of Policy",
          BoardId: 1,
        },
        {
          korName: "디자인정보팀",
          engName: "Bureau of Design & Information Technology",
          BoardId: 1,
        },
        {
          korName: "사무국",
          engName: "Bureau of General Affairs",
          BoardId: 1,
        },
        {
          korName: "국제사무국",
          engName: "Bureau of International Affairs",
          BoardId: 1,
        },
        {
          korName: "집행지원실",
          engName: "Executive Secretariat",
          BoardId: 1,
        },
        {
          korName: "문화기획국",
          engName: "Bureau of Cultural Events",
          BoardId: 1,
        },
        {
          korName: "회계팀",
          engName: "Bureau of Finance",
          BoardId: 1,
        },
        {
          korName: "식당",
          engName: "Restaurant",
          BoardId: 2,
        },
        {
          korName: "병원",
          engName: "Health",
          BoardId: 2,
        },
        {
          korName: "기타",
          engName: "Other",
          BoardId: 2,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Banner", null, {});
  },
};
