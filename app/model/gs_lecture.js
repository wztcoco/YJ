/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('gs_lecture', {
    lectureId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    participateTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    lectureName: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    introduction: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    posterImg: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    coverImg: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    lectureTypeId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    creatorId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    speakerId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    ticketTypeNum: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    ticketPrice: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'gs_lecture',
    freezeTableName: true,
    timestamps: false,
    underscored: true
  });

  Model.associate = function() {

  }

  return Model;
};
