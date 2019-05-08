/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('gs_lecture_address', {
    lectureAddressId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    cityCode: {
      type: DataTypes.STRING(6),
      allowNull: false
    },
    townCode: {
      type: DataTypes.STRING(6),
      allowNull: false
    },
    detailedAddress: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    schoolName: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'gs_lecture_address',
    freezeTableName: true,
    timestamps: false,
    underscored: true
  });

  Model.associate = function() {

  }

  return Model;
};
