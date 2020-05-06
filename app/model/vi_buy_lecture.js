/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('vi_buy_lecture', {
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    lectureId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    lectureName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    buyTimes: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 'vi_buy_lecture',
    freezeTableName: true,
    timestamps: false,
    underscored: true
  });

  Model.associate = function() {

  }

  return Model;
};
