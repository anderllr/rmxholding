import React from 'react';

/*
* Form created to make error validation on clientside
*/

const FormErrors = ({ formErrors }) =>
    <div className="text-danger">
        {Object.keys(formErrors).map((fieldName, i) => {
            if (formErrors[fieldName].length > 0) {
                return (
                    <p key={i}>{fieldName} {formErrors[fieldName]}</p>
                )
            } else {
                return '';
            }
        })}
    </div>

export default FormErrors;