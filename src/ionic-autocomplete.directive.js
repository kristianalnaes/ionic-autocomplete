//By Ajay Parsana - ajay.parsana@gmail.com
//https://github.com/ajayparsana

(function () {
    'use strict';

    angular.module('ionic-autocomplete')
        .directive('ionicAutocomplete', IonicAutoComplete);

    IonicAutoComplete.$inject = ['IonicAutoCompleteService', '$ionicPopover'];

    function IonicAutoComplete(IonicAutoCompleteService, $ionicPopover) {
        return {
            restrict: 'AE',

            scope: {
                autocompleteInput: "=autocompleteInput"
            },
            template: '<label class="item item-input" ng-class="autocompleteInput.labelContainerClass" style="margin-bottom: 1px;"><input id="searchAJ" type="text" ng-change="search($event)" ng-model="searchData.search" ng-class="autocompleteInput.textBoxClass"><ion-spinner ng-show="loading"></ion-spinner></label>',
            transclude: true,
            link: function (scope, element, attrs) {
                //this will make placeholder dynamic
                var el = angular.element("#searchAJ");
                el.attr("placeholder", (scope.autocompleteInput.placeholder ? scope.autocompleteInput.placeholder : 'Enter search text'));
                scope.searchData = {};

                scope.prop = scope.autocompleteInput.propNameToDisplay ? scope.autocompleteInput.propNameToDisplay : 'name';
                scope.isAsync = scope.autocompleteInput.isAsyncSearch ? true : false;
                scope.list = scope.autocompleteInput.searchlist ? scope.autocompleteInput.searchlist : null;
                scope.loading = false;

                //This will search using value in text box
                var searchFoo = function () {
                        IonicAutoCompleteService.searchString(scope.searchData.search, scope.list).then(
                            function (matches) {
                                scope.searchData.items = matches;
                                if (scope.searchData.items.length > 0) {


                                    var template = '<ion-popover-view style="margin-left:0px;top:' + (el.offset().top + el.height()) + 'px;left:' + el.offset().left + 'px;"><ion-content id="autocomplete"><li class="item" ng-class= "autocompleteInput.listClass" ng-repeat="item in searchData.items" ng-click="searchData.search = item[prop];itemSelected(item);" style="padding:5px">{{item[prop]}}</li></ion-content></ion-popover-view>';
                                    removePopup();
                                    scope.popover = $ionicPopover.fromTemplate(template, {
                                        scope: scope
                                    });

                                    scope.popover.show();
                                } else {
                                    removePopup();
                                }
                            });
                    },
                    removePopup = function () {
                        if (scope.popover) {
                            scope.popover.remove();
                        }
                    };
                scope.search = function () {

                    if (!scope.isAsync) {
                        searchFoo();
                    } else {
                        if (scope.autocompleteInput.asyncHttpCall) {
                            scope.loading = true;
                        }
                        scope.autocompleteInput.asyncHttpCall(scope.searchData.search);
                    }

                };


                scope.itemSelected = function (item) {
                    scope.closePopover();
                    if (scope.autocompleteInput.itemSelectCallback) {
                        scope.autocompleteInput.itemSelectCallback(item);
                    }
                };
                scope.openPopover = function ($event) {
                    scope.popover.show($event);
                };
                scope.closePopover = function () {
                    scope.popover.hide();
                };
                //Cleanup the popover when we're done with it!
                scope.$on('$destroy', function () {
                    scope.popover.remove();
                });
                //  // Execute action on hide popover
                // scope.$on('popover.hidden', function() {
                //    // Execute action
                //  });
                //  // Execute action on remove popover
                // scope.$on('popover.removed', function() {
                //    // Execute action
                //  });
                //Called when the user clicks on the button to invoke the 'ionic-autocomplete'

                scope.$root.$on('SearchListUpdated', function () {
                    scope.list = scope.autocompleteInput.searchlist;
                    if (scope.isAsync) {
                        scope.loading = false;
                        searchFoo();

                    }
                });
                //                element.focus(function () {
                //                    debugger;
                //                    //This code is added to set passed date from autocompleteObject
                //                    scope.list = scope.autocompleteInput.searchlist;
                //                });
            }
        };
    }

})();