var canvas = document.getElementById("renderCanvas");

var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); };
var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // Create a basic cube for the skybox
    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 10000.0 }, scene);

    // Create a standard material for the skybox
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);

    var selectedColor = new BABYLON.Color3(1, 0, 0); // Default color, e.g., red

    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.disableLighting = true;

    skybox.infiniteDistance = true;

    // Disable reflection on the skybox material
    // https://opengameart.org/content/sky-box-sunny-day
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene, ["_px.png", "_nx.png", "_py.png", "_ny.png", "_pz.png", "_nz.png"]);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

    // Disable lighting on the skybox to ensure it's not affected by scene lighting
    skyboxMaterial.disableLighting = true;

    // Apply the material to the skybox
    skybox.material = skyboxMaterial;

    // Optionally, to prevent the skybox from rendering for hit tests
    skybox.infiniteDistance = true;

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 50, new BABYLON.Vector3(0, 0, 5), scene);
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 25;
    camera.upperRadiusLimit = 100;

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;


    // Assuming the OBJ file is located in a 'models' directory
    var modelsPath = "models/";
    var modelName = "obal_1ku1.obj"

    document.querySelectorAll('.colorChoice').forEach(function (elem) {
        elem.addEventListener("click", function () {
            var colorData = this.getAttribute('data-color').split(',');
            selectedColor = new BABYLON.Color3(parseFloat(colorData[0]), parseFloat(colorData[1]), parseFloat(colorData[2]));
        });
    });

    document.getElementById("togglePanel").addEventListener("click", function () {
        var panel = document.getElementById("colorPanel");
        if (panel.style.display === "none") {
            panel.style.display = "block";
        } else {
            panel.style.display = "none";
        }
    });

    // Load the model
    BABYLON.SceneLoader.ImportMesh("", modelsPath, modelName, scene, function (meshes) {

        function changeMeshColor(mesh) {
            var material = new BABYLON.StandardMaterial("material", scene);
            material.diffuseColor = selectedColor;
            mesh.material = material;
        }

        // var combinedBoundingBox = BABYLON.Mesh.MergeMeshes(meshes, true, false, undefined, false, true);

        // // Calculate the center of the bounding box
        // var center = combinedBoundingBox.center;

        // Create a standard material
        var material = new BABYLON.StandardMaterial("modelMaterial", scene);
        material.diffuseColor = new BABYLON.Color3(1, 0.5, 0.5); // Example: soft red
        material.specularColor = new BABYLON.Color3(1, 1, 1); // Specular color
        material.backFaceCulling = false;
        // material.wireframe = true;
        // Assign the material to the model

        meshes.forEach(mesh => {
            // Translate each mesh to center the model in the scene
            //mesh.position = mesh.position.subtract(center);
            mesh.material = material;
            mesh.scaling = new BABYLON.Vector3(0.001, 0.001, 0.001);
            mesh.actionManager = new BABYLON.ActionManager(scene);
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function () {
                changeMeshColor(mesh); // Changes color to the selected color
            }));
        });
    });



    return scene;
};
window.initFunction = async function () {


    var asyncEngineCreation = async function () {
        try {
            return createDefaultEngine();
        } catch (e) {
            console.log("the available createEngine function failed. Creating the default engine instead");
            return createDefaultEngine();
        }
    }

    window.engine = await asyncEngineCreation();
    if (!engine) throw 'engine should not be null.';
    startRenderLoop(engine, canvas);
    window.scene = createScene();
};
initFunction().then(() => {
    sceneToRender = scene
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});



// // Create the balloon
// var balloon = BABYLON.MeshBuilder.CreateSphere("balloon", {diameter: 10}, scene);

// // Create a standard material for the balloon
// var balloonMaterial = new BABYLON.StandardMaterial("balloonMaterial", scene);
// balloon.material = balloonMaterial;

// // Initial Color (e.g., Red)
// var color1 = new BABYLON.Color3(1, 0, 0);
// // Second Color (e.g., Blue)
// var color2 = new BABYLON.Color3(0, 0, 1);

// // Set initial color
// balloon.material.diffuseColor = color1;


// // Assign an action manager to the balloon
// balloon.actionManager = new BABYLON.ActionManager(scene);

// var selectedColor = new BABYLON.Color3(1, 0, 0); // Default color

// document.querySelectorAll('.colorChoice').forEach(function(elem) {
//     elem.addEventListener("click", function() {
//         var colorData = this.getAttribute('data-color').split(',');
//         selectedColor = new BABYLON.Color3(parseFloat(colorData[0]), parseFloat(colorData[1]), parseFloat(colorData[2]));
//     });
// });

// scene.onPointerDown = function (evt, pickResult) {
//     // Check if the click intersects the balloon
//     if (pickResult.hit && pickResult.pickedMesh === balloon) {
//         var pickedPoint = pickResult.pickedPoint;
//         console.log('Clicked coordinates:', pickedPoint.x, pickedPoint.y, pickedPoint.z);

//         // You can also determine the hemisphere based on the Y-coordinate
//         if (pickedPoint.y >= 0) {
//             console.log('Clicked on upper hemisphere');
//         } else {
//             console.log('Clicked on lower hemisphere');
//         }
//     }
// };

// balloon.actionManager.registerAction(
//     new BABYLON.ExecuteCodeAction(
//         BABYLON.ActionManager.OnPickTrigger,
//         function () {
//             balloon.material.diffuseColor = selectedColor;
//         }
//     )
// );

// document.getElementById("togglePanel").addEventListener("click", function() {
//     var panel = document.getElementById("colorPanel");
//     if (panel.style.display === "none") {
//         panel.style.display = "block";
//     } else {
//         panel.style.display = "none";
//     }
// });

// // Define the action for a click event
// balloon.actionManager.registerAction(
//     new BABYLON.ExecuteCodeAction(
//         BABYLON.ActionManager.OnPickTrigger,
//         function () {
//             balloon.material.diffuseColor = selectedColor;
//         }
//     )
// );

// // Move the sphere upward 1/2 its height
// balloon.position.y = 1;

// Our built-in 'ground' shape.
//var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);// // Create the balloon
// var balloon = BABYLON.MeshBuilder.CreateSphere("balloon", {diameter: 10}, scene);

// // Create a standard material for the balloon
// var balloonMaterial = new BABYLON.StandardMaterial("balloonMaterial", scene);
// balloon.material = balloonMaterial;

// // Initial Color (e.g., Red)
// var color1 = new BABYLON.Color3(1, 0, 0);
// // Second Color (e.g., Blue)
// var color2 = new BABYLON.Color3(0, 0, 1);

// // Set initial color
// balloon.material.diffuseColor = color1;


// // Assign an action manager to the balloon
// balloon.actionManager = new BABYLON.ActionManager(scene);

// var selectedColor = new BABYLON.Color3(1, 0, 0); // Default color

// document.querySelectorAll('.colorChoice').forEach(function(elem) {
//     elem.addEventListener("click", function() {
//         var colorData = this.getAttribute('data-color').split(',');
//         selectedColor = new BABYLON.Color3(parseFloat(colorData[0]), parseFloat(colorData[1]), parseFloat(colorData[2]));
//     });
// });

// scene.onPointerDown = function (evt, pickResult) {
//     // Check if the click intersects the balloon
//     if (pickResult.hit && pickResult.pickedMesh === balloon) {
//         var pickedPoint = pickResult.pickedPoint;
//         console.log('Clicked coordinates:', pickedPoint.x, pickedPoint.y, pickedPoint.z);

//         // You can also determine the hemisphere based on the Y-coordinate
//         if (pickedPoint.y >= 0) {
//             console.log('Clicked on upper hemisphere');
//         } else {
//             console.log('Clicked on lower hemisphere');
//         }
//     }
// };

// balloon.actionManager.registerAction(
//     new BABYLON.ExecuteCodeAction(
//         BABYLON.ActionManager.OnPickTrigger,
//         function () {
//             balloon.material.diffuseColor = selectedColor;
//         }
//     )
// );

// document.getElementById("togglePanel").addEventListener("click", function() {
//     var panel = document.getElementById("colorPanel");
//     if (panel.style.display === "none") {
//         panel.style.display = "block";
//     } else {
//         panel.style.display = "none";
//     }
// });

// // Define the action for a click event
// balloon.actionManager.registerAction(
//     new BABYLON.ExecuteCodeAction(
//         BABYLON.ActionManager.OnPickTrigger,
//         function () {
//             balloon.material.diffuseColor = selectedColor;
//         }
//     )
// );

// // Move the sphere upward 1/2 its height
// balloon.position.y = 1;

// Our built-in 'ground' shape.
//var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);