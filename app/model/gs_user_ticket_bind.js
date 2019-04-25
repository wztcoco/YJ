/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('gs_user_ticket_bind', {
    ticketId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    ticketType: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    checkTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    tradeId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    lectureId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    ticketCode: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'gs_user_ticket_bind',
    freezeTableName: true,
    timestamps: false,
    underscored: true
  });

  Model.associate = function() {

  }

  return Model;
};
