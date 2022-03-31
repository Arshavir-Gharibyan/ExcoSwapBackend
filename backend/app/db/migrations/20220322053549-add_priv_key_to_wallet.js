'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn('wallets', 'private_key', {
      type: Sequelize.STRING,
      after: "type"
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn('wallets', 'private_key');
  }
};
