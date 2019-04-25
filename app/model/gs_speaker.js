/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('gs_speaker', {
    speakerId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    coverImg: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    speakerName: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    speakerIntroduction: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'gs_speaker',
    freezeTableName: true,
    timestamps: false,
    underscored: true
  });

  Model.associate = function() {

  }

  return Model;
};
