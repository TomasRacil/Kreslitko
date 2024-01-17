var loadModel = function (assetsManager, modelPath, modelName) {
    // Create a standard material
    var material = new BABYLON.StandardMaterial("modelMaterial", scene);
    material.diffuseColor = new BABYLON.Color3(1, 0.5, 0.5); // Example: soft red
    material.specularColor = new BABYLON.Color3(1, 1, 1); // Specular color
    material.backFaceCulling = false;

    function changeMeshColor(mesh) {
        var material = new BABYLON.StandardMaterial("material", scene);
        material.diffuseColor = selectedColor;
        material.backFaceCulling = false;
        mesh.material = material;
    }

    // Create an asset manager
    //var assetsManager = new BABYLON.AssetsManager(scene);

    // Add a mesh task to load the OBJ file
    var meshTask = assetsManager.addMeshTask("obj_task", "", modelPath, modelName);

    meshTask.onSuccess = function (task) {
        task.loadedMeshes.forEach(function (mesh) {
            // Scale down the model
            mesh.scaling = new BABYLON.Vector3(0.001, 0.001, 0.001); // Scale down by 1/1000
            mesh.material = material;
            mesh.actionManager = new BABYLON.ActionManager(scene);
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function () {
                changeMeshColor(mesh); // Changes color to the selected color
            }));
        });
    };

    // Handle errors
    meshTask.onError = function (task, message, exception) {
        console.log("Error loading OBJ file:", message, exception);
    };

    // Start the asset manager's loading process
    assetsManager.load();
};