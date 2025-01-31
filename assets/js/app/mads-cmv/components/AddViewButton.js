/*=================================================================================================
// Project: CADS/MADS - An Integrated Web-based Visual Platform for Materials Informatics
//          Hokkaido University (2018)
//          Last Update: Q3 2023
// ________________________________________________________________________________________________
// Authors: Mikael Nicander Kuwahara (Lead Developer) [2021-]
//          Jun Fujima (Former Lead Developer) [2018-2021]
// ________________________________________________________________________________________________
// Description: This is a 'Form Field' React Component (used in data editing/displaying forms)
//              of the Custom 'Add View Button' type
// ------------------------------------------------------------------------------------------------
// Notes: 'Form Fields' are component used inside all forms for editing and viewing connected data.
//        'AddViewButton' is a button that allows us to open a small form that let us create a new
//        visualization component and load it into the current workspace.
// ------------------------------------------------------------------------------------------------
// References: React, prop-types & semantic-ui-react Libs, Views Factory and Catalog
=================================================================================================*/

//-------------------------------------------------------------------------------------------------
// Load required libraries
//-------------------------------------------------------------------------------------------------
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown, Header, Modal, Icon } from 'semantic-ui-react';

import config from './Views/ViewCatalog';
import createView from './Views/factory';
import { createNewId } from './compUtils';

//-------------------------------------------------------------------------------------------------


//-------------------------------------------------------------------------------------------------
// Component properties and Initiation
//-------------------------------------------------------------------------------------------------
const uniqueCategories = [...new Set( config.map(v => v.category)) ];
const allAvaialableViews = Array(uniqueCategories.length);
for(var i = 0; i < allAvaialableViews.length; i++){
  allAvaialableViews[i] = config.filter((v) => v.category === uniqueCategories[i]);
}

const startId = 1;
const catStr = "Category: ";
const catColors = ["MediumBlue", "OrangeRed", "HotPink", "DarkGreen", "DarkMagenta", "DarkRed", "GoldenRod", "Black", "Olive", "Sienna"];

let key = 0;
const options = [];
for(let i = 0; i < uniqueCategories.length; i++){
  if (allAvaialableViews[i].length > 0) {
    key += 1;
    options.push({ children: <i>{catStr + uniqueCategories[i]}</i>, disabled: true, key, style: {backgroundColor: catColors[i], color: "White", fontWeight: "bold", textDecoration: "underline", fontSize: "18px"} });
    const list = allAvaialableViews[i].map((v) => ({
      text: v.name + ((v.devStage != undefined && v.devStage != "" && v.devStage != "Stable Release") ? " (** " + v.devStage + " **)" : "") + ((v.version != undefined && v.version != 1) ? " [v." + v.version + "]" : ""),
      value: v.type,
      key: v.type,
      style: {color: catColors[i]},
    }));
    Array.prototype.push.apply(options, list);
  }
}
//-------------------------------------------------------------------------------------------------


//-------------------------------------------------------------------------------------------------
// The Component Class
//-------------------------------------------------------------------------------------------------
class AddViewButton extends React.Component {
  state = { open: false, selected: null };

  constructor(props) {
    super(props);
    this.open = () => this.setState({ open: true });
    this.close = () => this.setState({ open: false });

    this.onOk = this.onOk.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  onOk() {
    this.close();

    const { selected } = this.state;
    const { actions, views } = this.props;

    this.setState({ selected: null });

    // create new id
    const id = createNewId(views, startId);
    const view = createView(selected, id);
    actions.addView(view);
  }

  handleChange(e, data) {
    this.setState({ selected: data.value });
  }

  render() {
    const { open, close } = this.state;

    return (
      <Modal
        trigger={
          <Button onClick={this.open} style={{marginTop: "5px"}}>
            <Icon name="add" />
            Add View
          </Button>
        }
        open={open}
        onClose={close}
      >
        <Header content="Select View" />
        <Modal.Content>
          <Dropdown
            onKeyDown={(e) => {if(e.keyCode==13 && this.state.selected != null){this.onOk();}}}
            fluid
            selection
            search
            placeholder="Select view..."
            options={options}
            onChange={this.handleChange}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.close} negative>
            Cancel
          </Button>
          <Button color="green" onClick={this.onOk}>
            Ok
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}
//-------------------------------------------------------------------------------------------------


//-------------------------------------------------------------------------------------------------
// The Component propTypes
//-------------------------------------------------------------------------------------------------
AddViewButton.propTypes = {
  actions: PropTypes.shape({
    addView: PropTypes.func.isRequired,
  }).isRequired,
};
//-------------------------------------------------------------------------------------------------

export default AddViewButton;
