const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('breed', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },  
    name: { 
      type: DataTypes.STRING,
      allowNull: false,
    },
    height: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    weight: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    life_span: {
        type: DataTypes.INTEGER,
    },
    image: {
      type: DataTypes.STRING,
    }  
  });
};