import React, { useState, useRef } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Button, Confirm, Form, Modal } from 'semantic-ui-react';
import { connect } from 'react-redux';

import MultiSelectDropdown from '../FormFields/MultiSelectDropdown';
import SemanticDropdown from '../FormFields/Dropdown';
import Input from '../FormFields/Input';
import ModelNameForm from './ModelNameForm';
import api from '../../api';

const getDropdownOptions = (list) =>
  list.map((i) => ({ key: i, text: i, value: i }));

let confirmResolve = null;

const RegressionForm = (props) => {
  const {
    handleSubmit,
    initialValues,
    pristine,
    reset,
    submitting,
    invalid,
    columns,
    targetId,
    colorTags,
    isLoggedIn,
  } = props;
  const cTags = colorTags.map((c) => ({
    text: c.color,
    value: c.id,
    props: { style: '' },
  }));

  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  // const [confirmResoluve, setConfirmResolve] = useState(null);

  const formElement = useRef(null);
  const saveForm = useRef(null);

  // const [colorDisabled, setColorDisabled] = useState(!initialValues.colorAssignmentEnabled);
  const methods = ['Linear', 'Lasso', 'SVR', 'RandomForest'];

  const showSaveDialog = () => {
    setSaveDialogOpen(true);
  };

  const closeSaveDialog = () => {
    setSaveDialogOpen(false);
  };

  const onSaveModelClick = (event) => {
    event.preventDefault();
    showSaveDialog();
  };

  const confirm = () => {
    const promise = new Promise((resolve, reject) => {
      setConfirmOpen(true);
      // setConfirmResolve(resolve);
      confirmResolve = resolve;
    });

    return promise;
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    if (confirmResolve) {
      confirmResolve(true);

      // setConfirmResolve(null);
    }
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    if (confirmResolve) {
      confirmResolve(false);
      // setConfirmResolve(null);
    }
  };

  const handleSaveFormSubmit = async (values) => {
    const { onModelSave } = props;

    const res = await api.prediction.fetchOwnedModels();
    const ownedModels = res.data;

    const pre = ownedModels.find((w) => w.name === values.name);
    if (pre) {
      // const response = window.confirm('A workspace with the same name is existing. Do you want to overwrite it?');
      const response = await confirm();
      console.log(response);

      if (response) {
        // overwrite the existing workspace
        if (onModelSave) {
          onModelSave(values.name, true, pre.id);
        }
        return true;
      }

      // do nothing go back to the dialog
      return false;
    }

    // console.log(onModelSave);
    if (onModelSave) {
      onModelSave(values.name, false);
    }
    return true;
  };

  const onSaveClick = async () => {
    const result = await saveForm.current.submit();
    if (result) {
      closeSaveDialog();
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit} ref={formElement}>
        {/* <Form.Field>
          <label>Filter</label>
          <Field
            name="filter"
            component={MultiSelectDropdown}
            placeholder="ColorTags"
            search
            // trigger={<Label color={data.color}/>}
            options={cTags}
          />
        </Form.Field> */}

        <Form.Field>
          <label>Method:</label>
          <Field
            name="method"
            component={SemanticDropdown}
            placeholder="Method"
            search
            options={getDropdownOptions(methods)}
          />
        </Form.Field>

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

        {/* <Form.Field>
          <label>Target columns</label>
          <Field
            name="targetColumns"
            component={MultiSelectDropdown}
            placeholder="Columns"
            search
            // trigger={<Label color={data.color}/>}
            options={columns}
          />
        </Form.Field> */}

        <Form.Field>
          <label>Target column</label>
          <Field
            name="targetColumn"
            component={SemanticDropdown}
            placeholder="Column"
            search
            // trigger={<Label color={data.color}/>}
            options={columns}
          />
        </Form.Field>

        <hr></hr>

        <h3>Cross validation:</h3>
        {/* <Form.Field>
          <label>Cross validation:</label>
          <Field
            name="clossValidationEnabled"
            component={SemCheckbox}
            toggle
            onChange={(e, data) => {
              console.log(data);
              setColorDisabled(!data);
            }}
          />
        </Form.Field> */}

        <Form.Field>
          <label>Number of folds</label>
          <Field
            name="folds"
            component="input"
            type="number"
            placeholder="folds"
            parse={(value) => Number(value)}
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

        <Button
          color="blue"
          disabled={invalid || !isLoggedIn}
          onClick={onSaveModelClick}
        >
          Save model
        </Button>
      </Form>

      <Modal open={saveDialogOpen} onClose={closeSaveDialog}>
        <Modal.Header>Save Model</Modal.Header>
        <Modal.Content>
          <ModelNameForm
            // initialValues={workspaceInfo}
            // enableReinitialize
            ref={saveForm}
            onSubmit={handleSaveFormSubmit}
            // columns={columnOptions}
            // targetId={id}
            // colorTags={colorTags}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={() => closeSaveDialog()}>
            Cancel
          </Button>
          <Button positive content="Save" onClick={onSaveClick} />
        </Modal.Actions>
      </Modal>

      <Confirm
        open={confirmOpen}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        content="A model with the same name is existing. Do you want to overwrite it?"
      />
    </>
  );
};

const validate = (values) => {
  const errors = {};
  if (!values.featureColumns) {
    errors.featureColumns = 'Required';
  }
  if (values.featureColumns && values.featureColumns.length === 0) {
    errors.featureColumns = 'Required';
  }
  if (!values.targetColumn) {
    errors.targetColumn = 'Required';
  }

  return errors;
};

const RegressionFormWrapped = reduxForm({
  form: 'regression',
  validate,
})(RegressionForm);

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

// const RegressionFormWrappedC = connect((state) => {
//   // const firstNameValue = selector(state, 'firstName');
//   // const formState = selector(state, '');
//   // console.warn(state);
//   // console.warn(formState);
//   // return {
//   //   firstNameValue,
//   //   lastNameValue,
//   // }
//   if (state.form.regression) {
//     return {
//       tmpValues: state.form.regression.values,
//     };
//   }

//   return {
//     tmpValues: undefined,
//   };
// }, mapDispatchToProps)(RegressionFormWrapped);

export default RegressionFormWrapped;
// export default RegressionFormWrappedC;
