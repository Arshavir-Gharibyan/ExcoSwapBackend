'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    username: {
      type: DataTypes.STRING,
      unique: true
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    type: DataTypes.STRING, // enum: user, creator
    password: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    emailVerified: {type: DataTypes.BOOLEAN, defaultValue: false},
    phoneVerified: {type: DataTypes.BOOLEAN, defaultValue: false},
    seedPhrase: DataTypes.STRING,    
    website: DataTypes.STRING,
    telegram: DataTypes.STRING,
    facebook: DataTypes.STRING,
    twitter: DataTypes.STRING,
    instagram: DataTypes.STRING,
    linkedin: DataTypes.STRING,
    whitepaper: DataTypes.STRING,
    deactivated: DataTypes.BOOLEAN,
    verified: {type: DataTypes.BOOLEAN, defaultValue: false},
    purchased: {type: DataTypes.BOOLEAN, defaultValue: false},
    purchasedDate: DataTypes.DATE,
    thumbUp: DataTypes.INTEGER,
    thumbDown: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'User',
    underscored: true,
  });
  
  User.profileFields = () => {
    return [
      "id",
      'username',
      "firstName",
      "lastName",
      "email",
      "type",
      "phoneNumber",
      "emailVerified",
      "phoneVerified",
      "website",
      "telegram",
      "facebook",
      "twitter",
      "instagram",
      "linkedin",
      "whitepaper",
      "deactivated",
      "verified",
      "thumbUp",
      "thumbDown"
    ]
  }
  return User;
};
