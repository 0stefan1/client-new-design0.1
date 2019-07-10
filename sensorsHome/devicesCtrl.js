(function(){
    var app = angular.module("sensorApp");
    app.controller('devicesCtrl', function($scope, $sessionStorage, $localStorage, $location, $timeout, $window, gatewayService, autentificationService, SENSOR_TYPE){
        var vm = this;
        vm.titleGrid = SENSOR_TYPE.TITLE;
        $scope.networkName = $sessionStorage.networkName;
        $scope.backButton = true;
        vm.currentPage =1;
        vm.sensPerPage = 50;
        if($localStorage.email && $localStorage.password &&($localStorage.email != 0 && $localStorage.password !=0)){
            var encodeduser = btoa($localStorage.email+ ':'+ $localStorage.password)
        }else{
            var encodeduser = btoa($sessionStorage.email+ ':'+ $sessionStorage.password)
        }
        $scope.back = function(){
            $sessionStorage.buttons = true;
            $sessionStorage.cards = false;
            delete $sessionStorage.netId;
            $location.path('/sensorsHome/networks');
            $timeout(function(){
                $window.location.reload();

            }, 100)
        }
        $scope.expandSelected = function(sensor){
            $scope.devices.forEach(function(val){
                val.expanded=false;
                $scope.editLocation = true;
            })
            sensor.expanded=true;
        };
        $scope.disconnectFromHub = function(){
            hubConnection.disconnectFromHub();

        }
            
        function getDevices(user, networkId, page, pageSize){
            $scope.loading = true;
            $scope.activeCount = 0;
            $scope.inactiveCount = 0;
            autentificationService.getUserSensors(user, networkId, page, pageSize)
                .then(function(response){
                    $scope.sensors = response.data;
                    gatewayService.getGateways(user, networkId, page, pageSize)
                        .then(function(response){
                            var gateways = response.data;
                            $scope.devices= $scope.sensors.concat(gateways);
                            for(var i=0; i<$scope.devices.length; i++){
                                if($scope.devices[i].active == true){
                                    $scope.activeCount ++;
                                } else{
                                    $scope.inactiveCount ++;
                                }
                            }
                            $scope.loading = false;
                            if($scope.devices.length == 0){
                                $scope.noData = true;
                                $scope.devicesData = false;
                            } else{
                                $scope.noData = false;
                                $scope.devicesData = true;
                            }
                        })
                })
        }
        autentificationService.getAllSensors(encodeduser, $sessionStorage.netId)
                .then(function(data){
                    $scope.allSensors = parseInt(data);
                    gatewayService.getAllGateways(encodeduser, $sessionStorage.netId)
                        .then(function(data){
                        $scope.allGateways = parseInt(data);
                        $scope.allDevices = $scope.allSensors + $scope.allGateways;
                    })
                })
        vm.setPage = function(){
            getDevices(encodeduser, $sessionStorage.netId, 1, 50)
            
        }
        $scope.$watch('vm.currentPage', vm.setPage);
        $scope.gridSize ='';
        $scope.setPageSize = function(gridSize){
            if(gridSize){
                vm.sensPerPage = gridSize;
                getDevices(encodeduser, $sessionStorage.netId, 1, vm.sensPerPage);
            }
        }
        $scope.goToSensors = function(){
            $location.path('/sensorsHome/sensors');
        }
        $scope.goToGateways = function(){
            $location.path('/sensorsHome/gateways');
        }
        $scope.noActiveData = false;
        $scope.showActiveSens = function(value)
        {
            if(value == true){
                autentificationService.getUserSensors(encodeduser, $sessionStorage.netId, 1, vm.sensPerPage)
                    .then(function(response){
                        $scope.sensors = response.data;
                        gatewayService.getGateways(encodeduser, $sessionStorage.netId, 1, vm.sensPerPage)
                            .then(function(response){
                                var gateways = response.data;
                                var activeDevices = [];
                                $scope.actDevices= $scope.sensors.concat(gateways);
                                for(var i=0; i<$scope.actDevices.length; i++){
                                    if($scope.actDevices[i].active == true){
                                        activeDevices.push($scope.actDevices[i]);
                                    } 
                                }
                                $scope.loading = false;
                                $scope.devices = activeDevices;
                                if($scope.devices.length == 0){
                                    $scope.noActiveData = true;
                                } else{
                                    $scope.noActiveData = false;
                                }
                            })
                    })
            } else{
                $scope.noActiveData = false;
                getDevices(encodeduser, $sessionStorage.netId, 1, vm.sensPerPage);
            }
        }
    });
}())