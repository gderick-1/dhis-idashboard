'use strict';

/* Directives */

var idashboardDirectives = angular.module('idashboardDirectives', []);
idashboardDirectives.directive('targetSelect', function() {
    var controller = ['$scope',function ($scope) {
        function init() {
            $scope.items = angular.copy($scope.datasource);
        }

        init();
        $scope.onTargetSelect = function($item){
            $scope.ngTargetModel = $item.id;
        }
        $scope.data = {
            selected:[],
            multiSelectEvents: {
                "onItemSelect":$scope.onTargetSelect
            }
        };
        if($scope.ngTargetModel != ""){
            $scope.data.selected = {"id":$scope.ngTargetModel};
        }
    }];


    return {
        scope: {
            ngTargetModel: '=',
            options: '='
        },
        controller: controller,
        templateUrl: 'views/partials/target-select.html'

    };
});
idashboardDirectives.directive('targetTable',function(){
   return {
       restrict:"EA",
       templateUrl:"views/partials/dashboardTable.html",
       replace:true,
       transclude:true
   }
});
idashboardDirectives.directive('targetDetails',function(){
    return {
        restrict:"EA",
        templateUrl:"views/partials/dashboardDetails.html",
        replace:true,
        transclude:true
    }
});
idashboardDirectives.directive('listingItem', function () {
    return {
        restrict: 'EA', //E = element, A = attribute, C = class, M = comment
        scope: {
            //@ reads the attribute value, = provides two-way binding, & works with functions
            dashboardItem:'=',
            loading:'=',
            errorMessage:'='
        },
        replace: true,
        //transclude:true,
        templateUrl: 'views/partials/listingItem.html',
        controller: function($scope,$http,$q,$sce) {
            $scope.loading=true;
            var deferred = $q.defer();
            var ajaxCalls = [];
            $scope.dashboardItemMediaUrl = $sce.trustAsResourceUrl('../../../api/apps/social-media-video/index.html?dashboardItemId='+$scope.dashboardItem.id);
            //Force normal size of card
            $scope.dashboardItem.shape= "NORMAL";

            //Load messages
            if($scope.dashboardItem.type=='MESSAGES') {
                ajaxCalls.push($http.get('../../../api/messageConversations.json?fields=:identifiable,messageCount,userSurname,userFirstname,lastMessage&pageSize=10')
                    .success(function(data){
                        $scope.dashboardItem.messageConversations=data.messageConversations;
                        $scope.loading=false;
                    }).error(function(error){
                        $scope.errorMessage = true;
                    }));
            }else {
                ajaxCalls.push($http.get('../../../api/dashboardItems/'+$scope.dashboardItem.id+'.json?fields=:all,users[:identifiable],resources[:identifiable],reports[:identifiable]')
                    .success(function(data){
                        $scope.dashboardItem=data;
                    }).error(function(error){
                        $scope.loading=false;
                        $scope.errorMessage = true;
                    }));
            }

            $q.all(ajaxCalls).then( function(results) {
                $scope.loading=false;
                deferred.resolve();
            },function(errors) {
                deferred.reject(errors);
            });


        } //Embed a custom controller in the directive
        //link: function ($scope, element, attrs) { } //DOM manipulation
    }
});
idashboardDirectives.directive("btstAccordion", function() {
    return {
        restrict: "E",
        transclude: true,
        replace: true,
        scope: {},
        template: "<div class='panel-group accordion' ng-transclude></div>",
        link: function(scope, element, attrs) {

            // give this element a unique id
            var id = element.attr("id");
            if (!id) {
                id = "btst-acc" + scope.$id;
                element.attr("id", id);
            }

            // set data-parent on accordion-toggle elements
            var arr = element.find(".accordion-toggle");
            for (var i = 0; i < arr.length; i++) {
                $(arr[i]).attr("data-parent", "#" + id);
                $(arr[i]).attr("href", "#" + id + "collapse" + i);
            }
            arr = element.find(".accordion-body");
            $(arr[0]).addClass("in"); // expand first pane
            for (var i = 0; i < arr.length; i++) {
                $(arr[i]).attr("id", id + "collapse" + i);
            }
        },
        controller: function() {}
    };
}).
    directive('btstPane', function() {
        return {
            require: "^btstAccordion",
            restrict: "E",
            transclude: true,
            replace: true,
            scope: {
                title: "@",
                category: "=",
                order: "="
            },
            template: "<div class='panel panel-default' >" +
            "  <div class='panel-heading'>" +
            "    <a class='accordion-toggle' data-toggle='collapse'> {{category.name}} - </a>" +

            "  </div>" +
            "<div class='panel-collapse collapse'>" +
            "  <div class='accordion-inner' ng-transclude></div>" +
            "  </div>" +
            "</div>",
            link: function(scope, element, attrs) {
                scope.$watch("title", function() {
                    // NOTE: this requires jQuery (jQLite won't do html)
                    var hdr = element.find(".accordion-toggle");
                    hdr.html(scope.title);
                });
            }
        };
    })