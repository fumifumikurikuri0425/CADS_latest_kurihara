/*=================================================================================================
// Project: CADS/MADS - An Integrated Web-based Visual Platform for Materials Informatics
//          Hokkaido University (2018)
//          Last Update: Q3 2023
// ________________________________________________________________________________________________
// Authors: Mikael Nicander Kuwahara (Lead Developer) [2021-]
//          Jun Fujima (Former Lead Developer) [2018-2021]
// ________________________________________________________________________________________________
// Description: This is a 'Form Field' React Component (used in data editing/displaying forms)
//              of the 'Button' type
// ------------------------------------------------------------------------------------------------
// Notes: 'Form Fields' are component used inside all forms for editing and viewing connected data.
//        'Button' is of classic type, look and feel.
// ------------------------------------------------------------------------------------------------
// References: React, prop-types & semantic-ui-react Libs
=================================================================================================*/

//-------------------------------------------------------------------------------------------------
// Load required libraries
//-------------------------------------------------------------------------------------------------
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'semantic-ui-react';

//-------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------
// The FormField Component
//-------------------------------------------------------------------------------------------------
const ToggleButton = ({
  input,
  type,
  label,
  placeholder,
  state,
  meta: { touched, error, warning },
  ...props
}) => (
  <Form.Field>
    <Button
      toggle
      compact
      {...input}
      {...props}
      onBlur={() => input.onBlur()}
      active={!!input.value}
      onClick={(event) => {
        event.preventDefault();
        input.onChange(!input.value);
        state;
      }}
    >
      {label}
    </Button>
    <Form.Field>
      {touched &&
        ((error && (
          <i style={{ color: '#9f3a38', fontWeight: 'bold' }}>{error}</i>
        )) ||
          (warning && (
            <i style={{ color: '#e07407', fontWeight: 'bold' }}>{warning}</i>
          )))}
    </Form.Field>
  </Form.Field>
);
//-------------------------------------------------------------------------------------------------

export default ToggleButton;
