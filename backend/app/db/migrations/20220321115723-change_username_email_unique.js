'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.changeColumn(
                    'users',
                    'username',
                    {
                        type: Sequelize.STRING,
                        allowNull: false,
                        unique: true
                    })
        await queryInterface.changeColumn(
            'users',
            'email',
            {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            })
          },


};
