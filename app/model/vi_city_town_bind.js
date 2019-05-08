/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('vi_city_town_bind', {
    cityName: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    areaCode: {
      type: DataTypes.STRING(6),
      allowNull: false
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
    tableName: 'vi_city_town_bind',
    freezeTableName: true,
    timestamps: false,
    underscored: true
  });

  Model.associate = function() {

  }

  return Model;
};
