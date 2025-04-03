const mongoose = require('mongoose');
const componentSchema = require('./componentSchema');

const modelsCache = {};

function getComponentModel(type) {
  const modelName = `Component_${type}`;

  if (!modelsCache[modelName]) {
    modelsCache[modelName] = mongoose.model(modelName, componentSchema, `components.${type}`);
  }

  return modelsCache[modelName];
}

module.exports = getComponentModel;
