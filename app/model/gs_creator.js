/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('gs_creator', {
    creatorId: {
      type: DataTypes.INTEGER(100),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    creatorName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    realName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    sex: {
      type: DataTypes.INTEGER(100),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    introduce: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'gs_creator',
    freezeTableName: true,
    timestamps: false,
    underscored: true
  });

  Model.associate = function() {

  }

  return Model;
};
