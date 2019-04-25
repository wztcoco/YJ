/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('gs_lecture_type', {
    lectureTypeId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    lectureTypeName: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'gs_lecture_type',
    freezeTableName: true,
    timestamps: false,
    underscored: true
  });

  Model.associate = function() {

  }

  return Model;
};
