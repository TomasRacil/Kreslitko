// sceneSetup.js
var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // Create a basic cube for the skybox
    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 10000.0 }, scene);

    // Create a standard material for the skybox
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);



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

    return scene;
};