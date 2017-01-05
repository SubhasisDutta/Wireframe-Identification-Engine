/**
 * Created by rithvik on 12/3/16.
 */

'use strict';

module.exports = sdPrototypePreviewData;

function sdPrototypePreviewData() {

    var controlData = {};

    function getControlData() {
        return controlData;
    }

    function setControlData(data) {
        controlData = data;
        console.log("Control data updated")
    }

    var service = {
        getControlData: getControlData,
        setControlData: setControlData
    };

    return service;
}