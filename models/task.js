'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Task.belongsTo(models.User); 
    }
  }
  Task.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM('todo', 'in_progress', 'completed'),
      defaultValue: 'todo'
    },
    dueDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Task',
  });
  return Task;
};