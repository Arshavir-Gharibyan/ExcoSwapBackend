'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * removeColumn "userid" from table "ratings"
 * addColumn "tokenid" to table "ratings"
 *
 **/

var info = {
    "revision": 6,
    "name": "update-rating",
    "created": "2021-07-23T13:15:43.231Z",
    "comment": ""
};

var migrationCommands = function(transaction) {
    return [{
            fn: "removeColumn",
            params: [
                "ratings",
                "userid",
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "addColumn",
            params: [
                "ratings",
                "tokenid",
                {
                    "type": Sequelize.STRING,
                    "field": "tokenid"
                },
                {
                    transaction: transaction
                }
            ]
        }
    ];
};
var rollbackCommands = function(transaction) {
    return [{
            fn: "removeColumn",
            params: [
                "ratings",
                "tokenid",
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "addColumn",
            params: [
                "ratings",
                "userid",
                {
                    "type": Sequelize.STRING,
                    "field": "userid"
                },
                {
                    transaction: transaction
                }
            ]
        }
    ];
};

module.exports = {
    pos: 0,
    useTransaction: true,
    execute: function(queryInterface, Sequelize, _commands)
    {
        var index = this.pos;
        function run(transaction) {
            const commands = _commands(transaction);
            return new Promise(function(resolve, reject) {
                function next() {
                    if (index < commands.length)
                    {
                        let command = commands[index];
                        console.log("[#"+index+"] execute: " + command.fn);
                        index++;
                        queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                    }
                    else
                        resolve();
                }
                next();
            });
        }
        if (this.useTransaction) {
            return queryInterface.sequelize.transaction(run);
        } else {
            return run(null);
        }
    },
    up: function(queryInterface, Sequelize)
    {
        return this.execute(queryInterface, Sequelize, migrationCommands);
    },
    down: function(queryInterface, Sequelize)
    {
        return this.execute(queryInterface, Sequelize, rollbackCommands);
    },
    info: info
};
