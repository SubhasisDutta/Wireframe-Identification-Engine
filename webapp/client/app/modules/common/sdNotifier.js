angular.module('app').value('sdToastr', toastr);

angular.module('app').factory('sdNotifier', function(sdToastr) {
  return {
    notify: function(msg) {
      sdToastr.success(msg);
      //console.log(msg);
    }
  }
})