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

    angular
        .module('stock-card')
        .factory('StockCardDataBuilder', StockCardDataBuilder);

    StockCardDataBuilder.$inject = ['StockCard', 'StockCardLineItemDataBuilder'];

    function StockCardDataBuilder(StockCard, StockCardLineItemDataBuilder) {

        StockCardDataBuilder.prototype.buildJson = buildJson;
        StockCardDataBuilder.prototype.build = build;
        StockCardDataBuilder.prototype.withId = withId;
        StockCardDataBuilder.prototype.withLineItems = withLineItems;

        return StockCardDataBuilder;

        function StockCardDataBuilder() {
            StockCardDataBuilder.instanceNumber =
                (StockCardDataBuilder.instanceNumber || 0) + 1;

            var instanceNumber = StockCardDataBuilder.instanceNumber;
            this.id = 'stock-card-id-' + instanceNumber;
            this.lineItems = [
                new StockCardLineItemDataBuilder().buildJson()
            ];
        }

        function build() {
            return new StockCard(this.buildJson());
        }

        function buildJson() {
            return {
                id: this.id,
                lineItems: this.lineItems
            };
        }

        function buildJson2() {
            return {
                id: this.id,
                lineItems: [
                    {
                        id: 'a',
                        stockAdjustments: [
                            {
                                reason: { id: '2' },
                                quantity: 10
                            },
                        ],
                        stockOnHand: 35
                    },
                    {
                        id: 'b',
                        reason: { id: '3' },
                        stockAdjustments: [],
                        quantity: 30,
                        stockOnHand: 10
                    }
                ]
            };
        }

        function withId(id) {
            this.id = id;
            return this;
        }

        function withLineItems(lineItems) {
            this.lineItems = lineItems;
            return this;
        }

    }

})();
