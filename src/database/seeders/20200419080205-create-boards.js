'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Board',
      [
        {
          id: 1,
          korTitle: '공지사항',
          engTitle: 'Announcements',
          korDescription: '',
          engDescription: '',
        },
        {
          id: 2,
          korTitle: '학생 복지',
          engTitle: 'Student Welfare',
          korDescription: '학우들을 위한 제휴 및 기타 복지사업',
          engDescription: 'Partnerships and discounts for students',
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Board', null, {});
  },
};
