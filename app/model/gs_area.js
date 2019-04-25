/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('gs_area', {
    areaCode: {
      type: DataTypes.STRING(6),
      allowNull: false,
      primaryKey: true
    },
    areaName: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    cityCode: {
      type: DataTypes.STRING(6),
      allowNull: false
    }
  }, {
    tableName: 'gs_area',
    freezeTableName: true,
    timestamps: false,
    underscored: true
  });

  Model.associate = function() {

  }

  return Model;
};
