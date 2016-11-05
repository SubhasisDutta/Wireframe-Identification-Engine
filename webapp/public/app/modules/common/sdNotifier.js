'use strict';

module.exports = sdNotifier;

function sdNotifier(sdToastr) {
    return {
        notify: function(msg) {
            sdToastr.success(msg);
        }
    };
}