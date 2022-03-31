'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('wallets', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement:true,
        type:Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      address: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('wallets');
  }
};
