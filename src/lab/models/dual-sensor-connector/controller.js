
import ModelController from 'common/controllers/model-controller';
import Model from './modeler';
import ModelContainer from './view';
import ScriptingAPI from './scripting-api';
// Dependencies.

export default function(modelUrl, modelOptions, interactiveController) {
  var controller = new ModelController(modelUrl, modelOptions, interactiveController,
    Model, ModelContainer, ScriptingAPI);

  // Note to self: modelController doesn't emit modelLoaded when the model first loads.
  // This was unexpected...

  function setupModelObservers() {
    var model = controller.model;

    model.addObserver('liveSensorReading', function() {
      controller.updateView();
    });

    model.addObserver('liveSensorReading2', function() {
      controller.updateView();
    });

    model.addObserver('needsReload', function() {
      if (model.properties.needsReload) {
        interactiveController.reloadModel();
      }
    });

    model.addPropertyDescriptionObserver('sensorReading', function() {
      var description = model.getPropertyDescription('sensorReading');
      var view = controller.modelContainer;

      view.updateUnits(description.getUnitAbbreviation());
    });

    model.addPropertyDescriptionObserver('sensorReading2', function() {
      var description = model.getPropertyDescription('sensorReading2');
      var view = controller.modelContainer;

      view.updateUnits2(description.getUnitAbbreviation());
    });
  }

  interactiveController.on('modelLoaded.dual-sensor-connector-model-controller', setupModelObservers);

  interactiveController.on('modelReset.dual-sensor-connector-model-controller', function() {
    controller.model.set('isNewRunInProgress', false);
  });

  interactiveController.on('willResetModel', function() {
    controller.model.set('isNewRunInProgress', true);
    controller.model.willReset();
  });

  return controller;
};
