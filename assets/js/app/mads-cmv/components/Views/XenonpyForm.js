/*=================================================================================================
// Project: CADS/MADS - An Integrated Web-based Visual Platform for Materials Informatics
//          Hokkaido University (2018)
//          Last Update: Q3 2023
// ________________________________________________________________________________________________
// Authors: Mikael Nicander Kuwahara (Lead Developer) [2021-]
// ________________________________________________________________________________________________
// Description: This is the Settings Configuration Form for the 'Statistics' View, driven by ReduxForm
// ------------------------------------------------------------------------------------------------
// Notes: 'StatisticsForm' opens a customized form for the 'Statistics' visualization component and allows
//        the user to edit its look, feel and behavior in multiple ways.
// ------------------------------------------------------------------------------------------------
// References: React, ReduxForm and semantic-view-ui libs, Needed FormField components
=================================================================================================*/

//-------------------------------------------------------------------------------------------------
// Load required libraries
//-------------------------------------------------------------------------------------------------
import React, { useState } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Form } from 'semantic-ui-react';
import SemanticDropdown from '../FormFields/Dropdown';
import MultiSelectDropdown from '../FormFields/MultiSelectDropdown';
import Input from '../FormFields/Input';

//-------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------
// The ReduxForm Module for this specific view and Visualisation Component
//-------------------------------------------------------------------------------------------------
const XenonpyForm = (props) => {
  // parameters and such
  const {
    handleSubmit,
    initialValues,
    pristine,
    reset,
    submitting,
    columns,
    targetId,
    colorTags,
  } = props;
  const cTags = colorTags.map((c) => ({
    text: c.color,
    value: c.id,
    props: { style: '' },
  }));

  const [colorDisabled, setColorDisabled] = useState(
    !initialValues.colorAssignmentEnabled
  );

  const getDropdownOptions = (list) =>
    list.map((i) => ({ key: i, text: i, value: i }));

  //=============================
  const errors = {};
  const errorValidate = (value, values, props, fieldName) => {
    let error = undefined;
    return error;
  };

  const methods = ['average', 'weighted average'];

  //input managers
  const [fieldsAreShowing, toggleVisibleFields] = useState(
    !initialValues.method != methods[1]
  );

  const [currentCMVal, setValue] = useState(initialValues.options.colorMap);

  const onCMChange = (event) => {
    setValue(event);
  };

  // The form itself, as being displayed in the DOM
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Field>
        <label> Method: </label>
        <Field
          name="method"
          component={SemanticDropdown}
          placeholder="Method"
          options={getDropdownOptions(methods)}
          onChange={(e, data) => {
            toggleVisibleFields(data != methods[1]);
          }}
        />
      </Form.Field>

      {/* These Form Fields are for the "mean" method */}
      <Form.Field>
        <label>Feature columns</label>
        <Field
          name="featureColumns"
          component={MultiSelectDropdown}
          placeholder="Columns"
          search
          // trigger={<Label color={data.color}/>}
          options={columns}
        />
      </Form.Field>

      <hr />
      <Form.Group widths="equal">
        <label>Extent:</label>

        <Field
          fluid
          name="options.extent.width"
          component={Input}
          placeholder="Width"
          // parse={(value) => Number(value)}
        />
        <Field
          fluid
          name="options.extent.height"
          component={Input}
          placeholder="Height"
          // parse={(value) => Number(value)}
        />
      </Form.Group>
    </Form>
  );
};
//-------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------
// Exporting and sharing this ReduxForm Module
//-------------------------------------------------------------------------------------------------
export default reduxForm({
  form: 'xenonpy',
})(XenonpyForm);
//-------------------------------------------------------------------------------------------------
