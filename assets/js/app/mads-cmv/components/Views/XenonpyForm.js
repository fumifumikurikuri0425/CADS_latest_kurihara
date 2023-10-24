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
import { Form, Grid, Popup } from 'semantic-ui-react';
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

  const [currentMethodVal, setValue] = useState(initialValues.method);

  const onMethodChange = (event) => {
    setValue(event);
  };

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

  const metals = [
    'None',
    'H',
    'He',
    'Li',
    'Be',
    'B',
    'C',
    'N',
    'O',
    'F',
    'Ne',
    'Na',
    'Mg',
    'Al',
    'Si',
    'P',
    'S',
    'Cl',
    'Ar',
    'K',
    'Ca',
    'Sc',
    'Ti',
    'V',
    'Cr',
    'Mn',
    'Fe',
    'Co',
    'Ni',
    'Cu',
    'Zn',
    'Ga',
    'Ge',
    'As',
    'Se',
    'Br',
    'Kr',
    'Rb',
    'Sr',
    'Y',
    'Zr',
    'Nb',
    'Mo',
    'Tc',
    'Ru',
    'Rh',
    'Pd',
    'Ag',
    'Cd',
    'In',
    'Sn',
    'Sb',
    'Te',
    'I',
    'Xe',
    'Cs',
    'Ba',
    'La',
    'Ce',
    'Pr',
    'Nd',
    'Pm',
    'Sm',
    'Eu',
    'Gd',
    'Tb',
    'Dy',
    'Ho',
    'Er',
    'Tm',
    'Yb',
    'Lu',
    'Hf',
    'Ta',
    'W',
    'Re',
    'Os',
    'Ir',
    'Pt',
    'Au',
    'Hg',
    'Tl',
    'Pb',
    'Bi',
    'Po',
    'At',
    'Rn',
    'Fr',
    'Ra',
    'Ac',
    'Th',
    'Pa',
    'U',
    'Np',
    'Pu',
  ];
  if (!initialValues.metal1) {
    initialValues.metal1 = 'None';
  }
  if (!initialValues.metal2) {
    initialValues.metal2 = 'None';
  }
  if (!initialValues.metal3) {
    initialValues.metal3 = 'None';
  }
  if (!initialValues.metal4) {
    initialValues.metal4 = 'None';
  }
  if (!initialValues.metal5) {
    initialValues.metal5 = 'None';
  }

  // The form itself, as being displayed in the DOM
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Field>
        <label>Method</label>
        <Popup
          trigger={
            <span style={{ fontSize: '20px', color: 'blue' }}>
              <a
                className="infohelp"
                href="https://xenonpy.readthedocs.io/en/latest/index.html"
                target="_blank"
              >
                🛈
              </a>
            </span>
          }
          size="small"
          wide="very"
        >
          <h4>Xenonpy Info</h4>
          <p>
            XenonPy is a Python library that implements a comprehensive set of
            machine learning tools for materials informatics. This tool can
            calculate 290 compositional features for a given chemical
            composition.
            <br />
          </p>
          {/* <img
            src="https://xenonpy.readthedocs.io/en/latest/_static/logo_readthedocs.png"
            alt="Xenonpy Logo"
            style={{ width: '220px' }}
          /> */}
        </Popup>
        <Field
          name="method"
          component={SemanticDropdown}
          placeholder="Method"
          options={getDropdownOptions(methods)}
          onChange={onMethodChange}
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
      {currentMethodVal == 'weighted average' && (
        <div>
          <Grid columns="equal">
            <Grid.Row>
              <Grid.Column>
                <Form.Field>
                  <label>
                    Coefficient[1]
                    <Popup
                      trigger={
                        <span style={{ fontSize: '20px', color: 'blue' }}>
                          🛈
                        </span>
                      }
                      content="Coefficient[1] is linked to the first Feature Column selected."
                      size="small"
                    />
                  </label>
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
                  <label>
                    Coefficient[2]
                    <Popup
                      trigger={
                        <span style={{ fontSize: '20px', color: 'blue' }}>
                          🛈
                        </span>
                      }
                      content="Coefficient[2] is linked to the second Feature Column selected."
                      size="small"
                    />
                  </label>
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
                  <label>
                    Coefficient[3]
                    <Popup
                      trigger={
                        <span style={{ fontSize: '20px', color: 'blue' }}>
                          🛈
                        </span>
                      }
                      content="Coefficient[3] is linked to the third Feature Column selected."
                      size="small"
                    />
                  </label>
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
                  <label>
                    Coefficient[4]
                    <Popup
                      trigger={
                        <span style={{ fontSize: '20px', color: 'blue' }}>
                          🛈
                        </span>
                      }
                      content="Coefficient[4] is linked to the fourth Feature Column selected."
                      size="small"
                    />
                  </label>
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
                  <label>
                    Coefficient[5]
                    <Popup
                      trigger={
                        <span style={{ fontSize: '20px', color: 'blue' }}>
                          🛈
                        </span>
                      }
                      content="Coefficient[5] is linked to the fifth Feature Column selected."
                      size="small"
                    />
                  </label>
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
      {currentMethodVal == 'weighted from column' && (
        <div>
          <Grid columns="equal">
            <Grid.Row>
              <Grid.Column>
                <Form.Field>
                  <label>
                    Metal[1]
                    <Popup
                      trigger={
                        <span style={{ fontSize: '20px', color: 'blue' }}>
                          🛈
                        </span>
                      }
                      content="Metal[1] is calculated with reference to the first selected column."
                      size="small"
                    />
                  </label>
                  <Field
                    name="metal1"
                    component={SemanticDropdown}
                    placeholder="metal"
                    options={getDropdownOptions(metals)}
                  />
                </Form.Field>
              </Grid.Column>

              <Grid.Column>
                <Form.Field>
                  <label>
                    Metal[2]
                    <Popup
                      trigger={
                        <span style={{ fontSize: '20px', color: 'blue' }}>
                          🛈
                        </span>
                      }
                      content="Metal[2] is calculated with reference to the second selected column."
                      size="small"
                    />
                  </label>
                  <Field
                    name="metal2"
                    component={SemanticDropdown}
                    placeholder="metal"
                    options={getDropdownOptions(metals)}
                  />
                </Form.Field>
              </Grid.Column>

              <Grid.Column>
                <Form.Field>
                  <label>
                    Metal[3]
                    <Popup
                      trigger={
                        <span style={{ fontSize: '20px', color: 'blue' }}>
                          🛈
                        </span>
                      }
                      content="Metal[3] is calculated with reference to the third selected column."
                      size="small"
                    />
                  </label>
                  <Field
                    name="metal3"
                    component={SemanticDropdown}
                    placeholder="metal"
                    options={getDropdownOptions(metals)}
                  />
                </Form.Field>
              </Grid.Column>

              <Grid.Column>
                <Form.Field>
                  <label>
                    Metal[4]
                    <Popup
                      trigger={
                        <span style={{ fontSize: '20px', color: 'blue' }}>
                          🛈
                        </span>
                      }
                      content="Metal[4] is calculated with reference to the fourth selected column."
                      size="small"
                    />
                  </label>
                  <Field
                    name="metal4"
                    component={SemanticDropdown}
                    placeholder="metal"
                    options={getDropdownOptions(metals)}
                  />
                </Form.Field>
              </Grid.Column>

              <Grid.Column>
                <Form.Field>
                  <label>
                    Metal[5]
                    <Popup
                      trigger={
                        <span style={{ fontSize: '20px', color: 'blue' }}>
                          🛈
                        </span>
                      }
                      content="Metal[5] is calculated with reference to the fifth selected column."
                      size="small"
                    />
                  </label>
                  <Field
                    name="metal5"
                    component={SemanticDropdown}
                    placeholder="metal"
                    options={getDropdownOptions(metals)}
                  />
                </Form.Field>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      )}

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
