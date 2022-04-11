'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
      await queryInterface.removeConstraint('users','username')
      await queryInterface.removeConstraint('users','email')
  },


};
