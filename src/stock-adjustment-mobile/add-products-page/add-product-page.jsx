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

import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import createDecorator from 'final-form-calculate';

import InputField from '../../react-components/form-fields/input-field';
import SelectField from '../../react-components/form-fields/select-field';
import ReadOnlyField from '../../react-components/form-fields/read-only-field';
import { formatLot, formatDate, formatDateISO } from '../format-utils';
import AddButton from '../../react-components/buttons/add-button';
import { appendToAdjustment } from '../reducers/adjustment';


const AddProductsPage = ({ adjustmentType, offlineService }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    
    const userHomeFacility = useSelector(state => state.facilities.userHomeFacility);
    const productOptions = useSelector(state => state.productOptions.productOptions);
    const reasons = useSelector(state => state.reasons.reasons);
    const adjustment = useSelector(state => state.adjustment.adjustment);
    const program = useSelector(state => state.program.program);

    const decorator = useMemo(() => createDecorator(
    {
        field: /product/,
        updates: {
            stockOnHand: (productVal, itemsVal) => {
                const orderable = itemsVal.items[0].hasOwnProperty('product') ? itemsVal.items[0].product : []; 
                if(itemsVal.items[0].hasOwnProperty('lot')) {
                    delete itemsVal.items[0].lot;
                } 
                const lotCode = null; 
                const stockOnHand = getStockOnHand(orderable, lotCode);
                return stockOnHand;
            }
        }
    },
    {
        field: /lot/,
        updates: {
            stockOnHand: (productVal, itemsVal) => {
                const orderable = itemsVal.items[0].hasOwnProperty('product') ? itemsVal.items[0].product : []; 
                const lotCode = itemsVal.items[0].hasOwnProperty('lot') ? itemsVal.items[0].lot.lotCode : null; 
                const stockOnHand = getStockOnHand(orderable, lotCode);
                return stockOnHand;
            }
        }
    }
    ), []);

    const isQuantityNotFilled = (quantity) => {
        return _.isUndefined(quantity) || _.isNull(quantity) || _.isNaN(quantity) || quantity === "";
    }

    const validate = values => {
        const errors = {};

        errors.items = [];

        _.forEach(values.items, (item, key) => {
            if (!item.product) {
                errors.items[key] = { product: 'Required' };
            }

            if (isQuantityNotFilled(item.quantity)) {
                errors.items[key] = { quantity: 'Required' };
            }

            if (!item.reason) {
                errors.items[key] = { reason: 'Required' };
            }
        });

        return errors;
    };

    const getStockOnHand = (orderable, lotCode) => {
        var returnedStock = null;
        orderable.forEach(product => {
            const productLot = !product.lot ? null : product.lot.lotCode;
            if (lotCode === productLot) {
                returnedStock = product.stockOnHand;
            }
        });
        return returnedStock;
    };

    const cancel = () => {
        if(adjustment.length === 0) { 
            history.goBack();
        }
        else {
            history.push("/makeAdjustmentAddProducts/submitAdjustment");
        }
    };

    const updateAdjustmentList = (values) => {
        values.reasonFreeText = null;
        values.occurredDate = formatDateISO(new Date());
        dispatch(appendToAdjustment(values));
    }

    const onSubmit = (values) => {
        updateAdjustmentList(values);
        history.push("/makeAdjustmentAddProducts/submitAdjustment");
    };

    const onSubmitAddProduct = (values) => {
        updateAdjustmentList(values);
        history.push("/makeAdjustmentAddProducts");
    };

    const getLotsOptions = (orderableGroup) => {
        const lots = _.chain(orderableGroup).pluck('lot')
            .compact()
            .map(lot => ({ ...lot, expirationDate: new Date(lot.expirationDate) }))
            .value();

        return _.map(lots, lot => ({ name: formatLot(lot), value: lot }));
    };

    const renderLotSelect = (fieldName, product, v) => {
        const options = getLotsOptions(product);
        const noOptions = !options || options.length === 0;
        return (
            <SelectField
                name={`${fieldName}.lot`}
                label="Lot Code"
                options={options}
                objectKey="id"
                defaultOption={noOptions ? 'Product has no lots' : 'No lot defined'}
                disabled={noOptions}
                containerClass='field-full-width'
            />
        );
    };

    return (
        <div style={{marginBottom: "40px"}}>
            <Form
                initialValues={{ items: [{}] }}
                onSubmit={onSubmit}
                validate={validate}
                mutators={{ ...arrayMutators }}
                decorators={[decorator]}
                render={({ handleSubmit, values, invalid }) => (
                    <form className="form-container" onSubmit={handleSubmit}>
                        <FieldArray name="items">
                            {({ fields }) => (                       
                                <div className="form-container">
                                    <div className="page-header-responsive">
                                        <div id="header-wrap" style={{marginBottom: "24px"}}>
                                            <h2 id="product-add-header">{userHomeFacility.code} - {userHomeFacility.name} - {program.programName}</h2>
                                            <div className="button-inline-container">
                                            <AddButton
                                                className="primary"
                                                disabled={invalid}
                                                onClick={() => onSubmitAddProduct(values)}
                                            >Add Product</AddButton>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-body">
                                        {fields.map((name, index) => (
                                            <div key={name}>
                                                <SelectField
                                                    required
                                                    name={`${name}.product`}
                                                    label="Product"
                                                    options={productOptions}
                                                    objectKey={[0, 'orderable', 'id']}
                                                    containerClass='field-full-width'
                                                />
                                                {renderLotSelect(name, values.items[index].product, values.items[index])}
                                                <ReadOnlyField
                                                    name="expiryDate"
                                                    label="Expiry Date"
                                                    containerClass='form-field-full-width'
                                                    formatValue={formatDate}
                                                />
                                                <ReadOnlyField
                                                    numeric
                                                    name="stockOnHand"
                                                    label="Stock on Hand"
                                                    containerClass='field-full-width'
                                                />
                                                <SelectField
                                                    required
                                                    name={`${name}.reason`}
                                                    label="Reason"
                                                    options={reasons}
                                                    objectKey="id"
                                                />
                                                <InputField
                                                    required
                                                    numeric
                                                    name={`${name}.quantity`}
                                                    label="Quantity"
                                                    containerClass='field-full-width'
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="navbar">
                                        <div id='navbar-wrap'>
                                            <button type="button" onClick={() => cancel()} style={{marginLeft: "5%"}}>
                                                <span>Cancel</span>
                                            </button>
                                            <AddButton
                                                type="submit"
                                                className="primary"
                                                disabled={invalid}
                                                alwaysShowText
                                                style={{marginRight: "5%"}}
                                            >Add</AddButton>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </FieldArray>
                    </form>
                )}
            />
        </div>
    );
};

export default AddProductsPage;
