/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('gs_trade', {
    tradeId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    lectureId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    tradeNum: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    payAmount: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'gs_trade',
    freezeTableName: true,
    timestamps: false,
    underscored: true
  });

  Model.associate = function() {

  }

  return Model;
};
