// eventHandlers.js
function setupEventHandlers(scene, selectedColor) {
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
}