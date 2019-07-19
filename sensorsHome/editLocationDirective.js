(function(){
    'use strict';
    var app = angular.module('sensorApp');
    app.directive('editLoc', function(){
        return{
            restrict: 'E',
            templateUrl :'sensorsHome/editLocationView.html',
            controller: function($scope, $sessionStorage, $localStorage, $window, $timeout, sensorModelService, gatewayService, d3){
                $scope.detailsDisplay = true;
                $scope.editLocationDisplay = false;
                if ($localStorage.email && $localStorage.password){
                    var encodedData = btoa($localStorage.email +':'+ $localStorage.password)
                }else{
                    var encodedData = btoa($sessionStorage.email +':'+ $sessionStorage.password)
                }
                $scope.startEditLoc = function(){
                    $scope.detailsDisplay = false;
                    $scope.editLocationDisplay = true;
                    $sessionStorage.editLoc = true;
                    $scope.showGateways = false;
                    $scope.deleteDisplay = false;
                    $scope.measurementsDisplay = false;
                    $scope.chartDisplay = false;
                    $scope.editDisplay = false;
                    document.getElementById('chartButton').style.backgroundColor = '#4DA8F2';
                    document.getElementById('deleteButton').style.backgroundColor = '#E88282';
                    document.getElementById('editButton').style.backgroundColor = '#3CDB41';
                    document.getElementById('gridButton').style.backgroundColor = '#4DA8F2';
                    document.getElementById('mapButton').style.backgroundColor = '#168040';
                    document.getElementById('details').style.backgroundColor = '#3CDB41';
                    document.getElementById('gatewaysButton').style.backgroundColor = '#4DA8F2';
                    document.getElementById('hideDetailsButton').style.backgroundColor = '#4DA8F2';
                    var map = new google.maps.Map(d3.selectAll('#editLocMap').node(), {
                        zoom: 4,
                        center: new google.maps.LatLng(51.508742, -0.120850),
                        mapTypeControl: false,
                        streetViewControl: false
                    });
                    $timeout(function(){
                        var marker;
                        marker= new google.maps.Marker({
                            position: $sessionStorage.location,
                            map:map
                        })
                        map.setCenter($sessionStorage.location)
                    
                        google.maps.event.addListener(map, "click", function(event){
                            placeMarker(map, event.latLng)

                        })
                        function placeMarker(map, location){
                            marker.setPosition(location);
                            delete $sessionStorage.lat;
                            delete $sessionStorage.lng;
                            $scope.latitude = marker.getPosition().lat();
                            $scope.longitude = marker.getPosition().lng();

                        }
                    }, 600)
                    var overlay = new google.maps.OverlayView;
                    overlay.onAdd = function() {
                        overlay.draw = function(){
                            var projection = this.getProjection(),
                            padding = 10;
                            function transform(d){
                                d = new google.maps.LatLng(d.value[1], d.value[0]);
                                d = projection.fromLatLngToDivPixel(d);
                                return d3.select(this)
                                    .style("left", (d.x - padding) + "px")
                                    .style("top", (d.y - padding) +"px");
                            }
                        }
                        
                    }
                    overlay.setMap(map);
                }
                $scope.editLocation = function(){
                    if($sessionStorage.sens == true){
                        var name = $sessionStorage.name;
                        var uploadInterval = $sessionStorage.uplInt;
                        var latitude = $scope.latitude;
                        var longitude = $scope.longitude;
                        $scope.editLoc = {name, uploadInterval, latitude, longitude}
                        sensorModelService.updateSensors( encodedData,$sessionStorage.netId, $sessionStorage.sensorId ,$scope.editLoc)
                            .then(function(){
                                $sessionStorage.lng = $scope.editLoc.longitude;
                                $sessionStorage.lat = $scope.editLoc.latitude;
                                $scope.showMessage = true;
                                $timeout(function(){
                                    $scope.editButton = true;
                                    $scope.detailsDisplay = true;
                                    $scope.editLocationDisplay = false;
                                    $scope.deleteButton = true;
                                    $scope.measurementsButton = true;
                                    $scope.chartButton = true;
                                    $scope.showMessage = false;
                                    $scope.sensorEditError = false;
                                    $scope.sensorEditSuccess = false;
                                    $scope.cards = false;
                                    $scope.grid = true;
                                    $scope.backButton = true;
                                    document.getElementById('hideDetailsButton').style.backgroundColor = '#4DA8F2';
                                    document.getElementById('details').style.backgroundColor = '#168040';
                                    document.getElementById('gatewaysButton').style.backgroundColor = '#4DA8F2';
                                    document.getElementById('chartButton').style.backgroundColor = '#4DA8F2';
                                    document.getElementById('editButton').style.backgroundColor = '#3CDB41';
                                    document.getElementById('mapButton').style.backgroundColor = '#3CDB41';
                                    document.getElementById('deleteButton').style.backgroundColor = '#E88282';
                                    document.getElementById('gridButton').style.backgroundColor = '#4DA8F2';
                                }, 1000)
            
                            })
                            .catch(function(){
                                $scope.errorMessage = true;
                                $scope.message = 'Choose a location!';
                                $scope.sensorEditError = true;
                                $scope.sensorEditSuccess = false;
                            });
                    }
                    if($sessionStorage.gateWay == true){
                        var gatewayName = $sessionStorage.gatewayName;
                        var lat = $scope.latitude;
                        var long =  $scope.longitude;
                        var editGatewayLoc = {"name":gatewayName, "latitude": lat, "longitude": long};
                        var networkId = $sessionStorage.netId;
                        var gatewayId = $sessionStorage.gatewayEditId;
                        gatewayService.updateGateway(encodedData, networkId, gatewayId, editGatewayLoc)
                            .then(function(){
                                $sessionStorage.lng = editGatewayLoc.long;
                                $sessionStorage.lat = editGatewayLoc.lat;
                                $scope.showMessage = true;
                                $timeout(function(){
                                    $window.history.back();
                                    $sessionStorage.home = true;
                                    $sessionStorage.editLoc = false;
                                    $timeout(function(){
                                        $window.location.reload();
                                    }, 100);
                                }, 1000)
                            })
                    }
                
                }
                $scope.cancelEditLocation = function(){
                    $scope.detailsDisplay = true;
                    $scope.editLocationDisplay = false;
                } 
            }
        }
    })
}());