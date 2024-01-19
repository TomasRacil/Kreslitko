function colorMeridians(targetMeshName, material) {
    var re = new RegExp("^\\d{2}-"+targetMeshName.split('-')[1]+"$");
    currentModels.forEach(mesh => {
        // Check if the mesh name indicates a meridian
        if (re.test(mesh.name)) {
            mesh.material = material;
        }
    });
}

function colorParallels(targetMeshName, material) {
    var re = new RegExp("^"+targetMeshName.split('-')[0]+"-\\d{1,2}$");
    currentModels.forEach(mesh => {
        // Check if the mesh name indicates a parallel
        if (re.test(mesh.name)) {
            mesh.material = material;
        }
    });
}

function changeMeshColor(mesh) {
    var material = new BABYLON.StandardMaterial("material", scene);
    material.diffuseColor = selectedColor;
    material.backFaceCulling = false;
    switch(currentColoringMode) {
        case 'all':
            currentModels.forEach(mesh => {
                    mesh.material = material;
            });
            break;
        case 'meridians':
            // Color the meridian
            colorMeridians(mesh.name, material);
            break;
        case 'parallels':
            // Color the parallel
            colorParallels(mesh.name, material)
            break;
        case 'cells':
            // Color the individual cell
            mesh.material = material;
            break;
    } 
    
}

var loadModel = function (modelName, modelScaling) {

    // Create a standard material
    var material = new BABYLON.StandardMaterial("modelMaterial", scene);
    material.diffuseColor = selectedColor 
    material.specularColor = new BABYLON.Color3(1, 1, 1); // Specular color
    material.backFaceCulling = false;

    // Clear existing models
    if (currentModels.length !== 0){
        currentModels.forEach(model => {
            model.dispose();
        });
        currentModels = [];
    }

    

    // Add a mesh task to load the OBJ file
    var meshTask = assetsManager.addMeshTask("obj_task", "", modelsPath, modelName);
    meshTask.onSuccess = function (task) {
        task.loadedMeshes.forEach(function (mesh) {
            // Scale down the model
            mesh.scaling = new BABYLON.Vector3(modelScaling, modelScaling, modelScaling); // Scale down by 1/1000
            mesh.material = material;
            mesh.actionManager = new BABYLON.ActionManager(scene);
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function () {
                changeMeshColor(mesh); // Changes color to the selected color
            }));
            currentModels.push(mesh);
        });
    };

    // Handle errors
    meshTask.onError = function (task, message, exception) {
        console.log("Error loading OBJ file:", message, exception);
    };

    // Start the asset manager's loading process
    assetsManager.load();
};