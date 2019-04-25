/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('gs_seat', {
    seatId: {
      type: DataTypes.INTEGER(100),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    seatDescribtion: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER(100),
      allowNull: false
    },
    lectureId: {
      type: DataTypes.INTEGER(100),
      allowNull: false
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    isDelete: {
      type: DataTypes.INTEGER(100),
      allowNull: false
    }
  }, {
    tableName: 'gs_seat',
    freezeTableName: true,
    timestamps: false,
    underscored: true
  });

  Model.associate = function() {

  }

  return Model;
};
