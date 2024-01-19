// eventHandlers.js
function setupEventHandlers() {    
    var colorModeButtons = document.querySelectorAll('.colorModeButton');
    colorModeButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            colorModeButtons.forEach(btn => btn.classList.remove('active')); // Remove 'active' from all buttons
            button.classList.add('active'); // Add 'active' to clicked button
            currentColoringMode = button.getAttribute('data-mode');
        });
    });
    document.getElementById('modelPicker').addEventListener('change', function (event) {
        var selectedIndex = event.target.selectedIndex;
        var selectedModel = models[selectedIndex].filename;
        var selectedModelScaling = models[selectedIndex].scaling;
        loadModel(selectedModel, selectedModelScaling);
    });
}

function setupColorPicker(scene) {
    var colorPicker = document.getElementById('colorPicker');

    colorPicker.addEventListener('input', function () {
        var colorVal = colorPicker.value;
        // Convert hex color to Babylon Color3
        var color3 = hexToColor3(colorVal);
        selectedColor = color3;
    });
}

function hexToColor3(hex) {
    var r = parseInt(hex.substr(1, 2), 16) / 255;
    var g = parseInt(hex.substr(3, 2), 16) / 255;
    var b = parseInt(hex.substr(5, 2), 16) / 255;
    return new BABYLON.Color3(r, g, b);
}