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
import { Form, Grid } from 'semantic-ui-react';
import SemanticDropdown from '../FormFields/Dropdown';
import inputTrad from '../FormFields/inputTraditional';
import MultiSelectDropdown from '../FormFields/MultiSelectDropdown';
import Input from '../FormFields/Input';

//-------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------
// Form Support Methods that manages various individual form fields that requires some form of
// attention to its content
//-------------------------------------------------------------------------------------------------

//=======================
const setSubmitButtonDisable = (disableState) => {
  if (disableState) {
    $('.ui.positive.button').prop('disabled', true);
  } else {
    $('.ui.positive.button').prop('disabled', false);
  }
};
//=======================

//=======================
const validate = (values, props) => {
  const errors = {};
  if (values.featureColumns) {
    console.log(values.featureColumns);
  }

  if (!values.featureColumns) {
    errors.featureColumns = 'Required';
  }

  setSubmitButtonDisable(errors.featureColumns);

  return errors;
};
//=======================

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
  } = props;

  const getDropdownOptions = (list) =>
    list.map((i) => ({ key: i, text: i, value: i }));

  //=============================
  const methods = ['average', 'weighted average', 'weighted from column'];

  //input managers
  const [fieldsAreShowing, toggleVisibleFields] = useState(
    !(initialValues.method == methods[1])
  );
  // const [currentMethodVal, toggleVisibleFields] = useState(
  //   initialValues.methods
  // );

  if (!initialValues.coefficient1) {
    initialValues.coefficient1 = 0;
  }
  if (!initialValues.coefficient2) {
    initialValues.coefficient2 = 0;
  }
  if (!initialValues.coefficient3) {
    initialValues.coefficient3 = 0;
  }
  if (!initialValues.coefficient4) {
    initialValues.coefficient4 = 0;
  }
  if (!initialValues.coefficient5) {
    initialValues.coefficient5 = 0;
  }

  const onCMChange = (event) => {
    setValue(event);
  };

  // The form itself, as being displayed in the DOM
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Field>
        <label>Method</label>
        <Field
          name="method"
          component={SemanticDropdown}
          placeholder="Method"
          options={getDropdownOptions(methods)}
          onChange={(e, data) => {
            toggleVisibleFields(data != methods[1] && data != methods[2]);
          }}
        />
      </Form.Field>

      <Form.Field>
        <label>Feature columns</label>
        <Field
          name="featureColumns"
          component={MultiSelectDropdown}
          placeholder="Columns"
          search
          options={columns}
        />
      </Form.Field>

      {/* These Form Fields are for the "weighted average" method */}
      {!fieldsAreShowing && (
        <div>
          <Grid columns="equal">
            <Grid.Row>
              <Grid.Column>
                <Form.Field>
                  <label>Coefficient[1]</label>
                  <Field
                    name="coefficient1"
                    component={inputTrad}
                    placeholder="coefficient"
                    type="number"
                    min={0}
                  />
                </Form.Field>
              </Grid.Column>

              <Grid.Column>
                <Form.Field>
                  <label>Coefficient[2]</label>
                  <Field
                    name="coefficient2"
                    component={inputTrad}
                    placeholder="coefficient"
                    type="number"
                    min={0}
                  />
                </Form.Field>
              </Grid.Column>

              <Grid.Column>
                <Form.Field>
                  <label>Coefficient[3]</label>
                  <Field
                    name="coefficient3"
                    component={inputTrad}
                    placeholder="coefficient"
                    type="number"
                    min={0}
                  />
                </Form.Field>
              </Grid.Column>

              <Grid.Column>
                <Form.Field>
                  <label>Coefficient[4]</label>
                  <Field
                    name="coefficient4"
                    component={inputTrad}
                    placeholder="coefficient"
                    type="number"
                    min={0}
                  />
                </Form.Field>
              </Grid.Column>

              <Grid.Column>
                <Form.Field>
                  <label>Coefficient[5]</label>
                  <Field
                    name="coefficient5"
                    component={inputTrad}
                    placeholder="coefficient"
                    type="number"
                    min={0}
                  />
                </Form.Field>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      )}

      {/* These Form Fields are for the "weighted from colummn" method */}
      {/* {currentMethodVal == 'weighted from column' && (
        <div>
          <Grid columns="equal">
            <Grid.Row>
              <Grid.Column>
                <Form.Field>
                  <label>Metal1</label>
                  <Field
                    name="coefficient1"
                    component={inputTrad}
                    placeholder="coefficient"
                    type="number"
                    min={0}
                  />
                </Form.Field>
              </Grid.Column>

              <Grid.Column>
                <Form.Field>
                  <label>Metal2</label>
                  <Field
                    name="coefficient2"
                    component={inputTrad}
                    placeholder="coefficient"
                    type="number"
                    min={0}
                  />
                </Form.Field>
              </Grid.Column>

              <Grid.Column>
                <Form.Field>
                  <label>Metal3</label>
                  <Field
                    name="coefficient3"
                    component={inputTrad}
                    placeholder="coefficient"
                    type="number"
                    min={0}
                  />
                </Form.Field>
              </Grid.Column>

              <Grid.Column>
                <Form.Field>
                  <label>Metal4</label>
                  <Field
                    name="coefficient4"
                    component={inputTrad}
                    placeholder="coefficient"
                    type="number"
                    min={0}
                  />
                </Form.Field>
              </Grid.Column>
            </Grid.Row>
          </Grid> */}
      {/* </div> */}
      {/* )} */}

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
  validate,
})(XenonpyForm);
//-------------------------------------------------------------------------------------------------
