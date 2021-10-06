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

import React from 'react';
import Button from "./stock-add-products-mobile/button";
import confirmAlertCustom from "./confirm";
import ProgressBar from "./progress-bar";
import { useHistory } from 'react-router-dom';

const WizardStep = ({ children, currentStep, stepsCount, previous, next, onSubmit, physicalInventoryId, physicalInventoryService }) => {
    const history = useHistory();

    return (
        <div className="mobile-footer-container">
            <div className="mobile-footer-header">
                <ProgressBar value={currentStep} max={stepsCount}/>
                <Button
                    className="bin-button danger custom-one"
                    onClick={() => confirmAlertCustom({
                        title: 'Do you want to delete this draft?',
                        confirmLabel: 'Delete',
                        confirmButtonClass: 'danger',
                        onConfirm: () => physicalInventoryService.deleteDraft(physicalInventoryId)
                            .then(() => history.replace('/'))
                    })}
                />
            </div>
            <div className="mobile-footer-body">{children}</div>
            <div className="mobile-footer">
                <button type="button" disabled={!currentStep || currentStep <= 1} onClick={() => previous()}>
                    <span><i className="fa fa-chevron-left pr-2" style={{marginRight: '0.5em'}}/>Previous</span>
                </button>
                {currentStep === stepsCount ?
                    <button type="button" className="primary" onClick={() => onSubmit()}>Submit</button>
                    :
                    <button type="button" className="primary" onClick={() => next()}>
                        <span>Next<i className="fa fa-chevron-right pl-2" style={{marginLeft: '0.5em'}}/></span>
                    </button>
                }
            </div>
        </div>
    )
};

export default WizardStep;
