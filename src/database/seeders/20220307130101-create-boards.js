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
          redirection: null,
          viewHome: true
        },
        {
          id: 2,
          korTitle: '학생 복지 - 총학 제휴',
          engTitle: 'Student Welfare - UA Partnerships',
          korDescription: '학우들을 위한 제휴 및 기타 복지사업',
          engDescription: 'Partnerships and discounts for students',
          redirection: '/web/welfare',
          viewHome: true
        },
        {
          id: 3,
          korTitle: '학생 복지 - 학교 제휴',
          engTitle: 'Student Welfare - College Partnerships',
          korDescription: '학우들을 위한 제휴 및 기타 복지사업',
          engDescription: 'Partnerships and discounts for students',
          redirection: '/web/welfare',
          viewHome: false
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Board', null, {});
  },
};
