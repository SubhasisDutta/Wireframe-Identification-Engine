/**
 * Created by rithvik on 12/3/16.
 */

'use strict';

module.exports = sdPrototypePreviewCtrl;

function sdPrototypePreviewCtrl($scope, sdPrototypePreviewData) {

    function createPreview() {
        var controlData = sdPrototypePreviewData.getControlData();
        console.log(controlData);
    }
    createPreview();
}
