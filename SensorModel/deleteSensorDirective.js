(function(){
var app = angular.module("sensorApp");
app.directive('deleteSensor', function(){
    return {
        restrict: 'E',
        templateUrl: 'SensorModel/deleteSensorDirectiveView.html',
        controller: function($scope, sensorModelService, $window, $timeout, $localStorage, $sessionStorage){
            $scope.deleteDisplay = false;
            $scope.startDelete = function(sensor){
                document.getElementById('deleteButton').style.backgroundColor = '#240B73';
                document.getElementById('chartButton').style.backgroundColor = '#4DA8F2';
                document.getElementById('editButton').style.backgroundColor = '#4DA8F2';
                document.getElementById('gridButton').style.backgroundColor = '#4DA8F2';
                document.getElementById('gatewaysButton').style.backgroundColor = '#4DA8F2';
                $scope.sensors.forEach(function(val){
                    val.deleteDisplay = false;
                });
                $scope.editDisplay = false;
                $scope.showGateways = false;
                $scope.chartDisplay = false;
                $scope.measurementsDisplay = false; 
                sensor.deleteDisplay = true;
                $scope.gatewayButton = false;
                $scope.deleteDisplay = true;
                $scope.detailsDisplay = false;
            }
            if($localStorage.email && $localStorage.password){
                $scope.encodedData = btoa($localStorage.email +':'+ $localStorage.password)
            }else{
                $scope.encodedData = btoa($sessionStorage.email +':'+ $sessionStorage.password)
            }
            if($sessionStorage.cards == true){
                $scope.id = $sessionStorage.sensorId;

                
            }
            var timer;
            $scope.deleteSensor = function(id){
                sensorModelService.deleteSensors($scope.encodedData, $sessionStorage.netId, id);
                timer = $timeout(function(){
                    $window.location.reload();
                },300);
            };
            $timeout.cancel(timer);
            $scope.cancelDeleteSensor = function(){
                document.getElementById('deleteButton').style.backgroundColor = '#4DA8F2'

                $scope.deleteDisplay = false;
                $scope.detailsDisplay = true;
                $scope.editLocation = true;
                if($sessionStorage.cards == true){
                    $scope.cards = true;
                    $scope.grid = false;
                    
                } else{
                    $scope.cards = false;
                    $scope.grid = true;
                }
            };
        }
    }
});
}());
