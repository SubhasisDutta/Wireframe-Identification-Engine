/**
 * Created by rithvik on 12/3/16.
 */

'use strict';

module.exports = sdPrototypePreviewCtrl;

function sdPrototypePreviewCtrl($scope, sdPrototypePreviewData) {

    function getControlType(prediction_label) {
        var label = '';
        prediction_label.forEach(function(prediction) {
            if (prediction.provider === 'ibm_label') {
                label = prediction.result.split(',')[0].split('(')[0];
            }
        });
        console.log('LABEL', label);
        return label;
    }

    function getControlText(prediction_text) {
        var text = '';
        prediction_text.forEach(function(prediction) {
            if (prediction.provider === 'google_text') {
                // text = prediction.result;
                // text = prediction.result.replace(/[^a-zA-Z0-9\s:]*/, '');
                text = prediction.result.replace(/[^a-zA-Z0-9\s:]*/, '').replace(/\r?\n|\r/g, '');
            }
        });
        console.log('TEXT', text);
        return text;
    }

    function normalizeControlDims(wfWidth, wfHeight, width, height, left, top) {
        var canvas = document.getElementById('previewCanvas');
        var normWidth = (canvas.offsetWidth / wfWidth) * width;
        var normHeight = (canvas.offsetHeight / wfHeight) * height;
        var normLeft = (canvas.offsetWidth / wfWidth) * left;
        var normTop = (canvas.offsetHeight / wfHeight) * top;
        // return {
        //     width: normWidth,
        //     height: normHeight,
        //     left: normLeft,
        //     top: normTop
        // }
        return {
            width: width,
            height: height,
            left: left,
            top: top
        }
    }

    function createControlElem(type, text, dimensions) {
        var element;
        switch (type) {
            case 'button':
                element = document.createElement("BUTTON");
                element.innerHTML = text;
                break;
            case 'text':
                element = document.createElement("LABEL");
                element.innerHTML = text;
                break;
            case 'table':
                element = document.createElement('TABLE');
                element.classList.add('table');

                var header = element.createTHead();
                var hRow = header.insertRow(0);
                var textArr = text.split(' ');
                for (var i = 0; i < textArr.length; i++) {
                    var cell = hRow.insertCell(i);
                    cell.innerHTML = textArr[i];
                }

                var footer = element.createTFoot();
                for (i = 0; i < 3; i++) {
                    var fRow = footer.insertRow(i);
                    for (var j = 0; j < textArr.length; j++) {
                        var cell = fRow.insertCell(j);
                        cell.appendChild(document.createElement("P"));
                    }
                }
                break;
            case 'chart':
                element = document.createElement("IMG");
                element.setAttribute('src', '../../../assets/img_LineChart.png');
                break;
            case 'icon':
                element = document.createElement("IMG");
                element.setAttribute('src', '../../../assets/img_icon.png');
                break;
        }

        element.setAttribute('style', 'position: absolute; left: ' + dimensions.left + 'px; top: ' + dimensions.top + 'px; width: ' + dimensions.width + 'px; height: ' + dimensions.height + 'px;');
        return element;
    }

    function createPreview() {
        var controlData = sdPrototypePreviewData.getControlData();
        console.log(controlData);

        var canvas = document.getElementById('previewCanvas');
        var type, text, element, elemDims;
        controlData.controls.forEach(function(control) {
            type = getControlType(control.prediction_label);
            text = getControlText(control.prediction_text);
            elemDims = normalizeControlDims(controlData.wireframe_width, controlData.wireframe_height, control.object_width, control.object_height, control.image_dimention.top_left_x, control.image_dimention.top_left_y);
            element = createControlElem(type, text, elemDims);
            if (element) {
                canvas.appendChild(element);
            }
        });
    }
    createPreview();
}
