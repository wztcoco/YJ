/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('gs_city', {
    areaCode: {
      type: DataTypes.STRING(6),
      allowNull: false,
      primaryKey: true
    },
    cityName: {
      type: DataTypes.STRING(30),
      allowNull: false
    }
  }, {
    tableName: 'gs_city',
    freezeTableName: true,
    timestamps: false,
    underscored: true
  });

  Model.associate = function() {

  }

  return Model;
};
