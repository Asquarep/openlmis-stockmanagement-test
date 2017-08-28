/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function() {

    'use strict';

    /**
     * @ngdoc directive
     * @restrict E
     * @name stock-reasons.directive:stockReasonsPopover
     *
     * @description
     * Displays a popover with the current set reasons.
     *
     */
    angular
        .module('stock-reasons')
        .directive('stockReasons', stockReasons);

    stockReasons.$inject = ['$compile', '$templateCache'];

    function stockReasons($compile, $templateCache) {
        return {
            restrict: 'E',
            require: [
                'stockReasons',
                'popover'
                ],
            link: link
        };

        function link(scope, element, attrs, ctrls) {
            var stockReasonsCtrl = ctrls[0],
                popoverCtrl = ctrls[1];

            var popoverElement;
            scope.$watch(function() {
                return stockReasonsCtrl.adjustments.length > 0;
            }, function(showAdjustments) {
                // TODO: Set title to {{'stockReasons.adjustments' | message}}

                if(showAdjustments && !popoverElement) {
                    var html = $templateCache.get('stock-reasons/stock-reasons-popover.html');
                    popoverElement = $compile(html)(scope);

                    popoverCtrl.addElement(popoverElement);
                }

                if(!showAdjustments && popoverElement) {
                    popoverCtrl.removeElement(popoverElement);
                    popoverElement = undefined;
                }
            });
        }
    }

})();
