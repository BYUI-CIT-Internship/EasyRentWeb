import React, { useState, useEffect } from 'react';
import Text from 'react-text';
import Modal from 'react-bootstrap/Modal';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';

const GreenCheckbox = withStyles({
  root: {
    color: '#252222',
    '&$checked': {
      color: '#252222',
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

export default function MyVerticallyCenteredModal(props) {
  const getCheckboxes = (reservationItems) => reservationItems.reduce(
    (checkboxes, { uniqueItemId, returned, recorded }) => {
      // checkboxes[uniqueItemId] = toggle === 'returned' ? returned : recorded;
      checkboxes[uniqueItemId] = returned;
      return checkboxes;
    }, {}
  );

  const { toggle, validReturn } = props;
  const [checkedAll, setCheckedAll] = useState(false);
  const [checkboxState, setCheckboxState] = useState(getCheckboxes(props.reservationItems))

  useEffect(() => {
    const checkboxes = getCheckboxes(props.reservationItems);
    setCheckboxState(checkboxes);
  }, [props]);

  const handleChange = (id, event) => {
    const {checked } = event.target;
    const newState = {
      ...checkboxState,
      [id]: checked
    };
    setCheckboxState(newState);

    const checkedAll = Object.values(newState).every(checked => checked);
    setCheckedAll(checkedAll);
  }

  const onCheckAll = (event) => {
    const update = {}
    const { checked } = event.target;
    props.reservationItems.map(item => {
      update[item.uniqueItemId] = checked;
    })
    /*if (event.target.checked) {
      props.reservationItems.map(item => {
        update[item.uniqueItemId] = true;
      })
    } else {
      props.reservationItems.map(item => {
        update[item.uniqueItemId] = false;
      })
    }*/
    setCheckboxState(update)
    setCheckedAll(checked);
  }
  let allChecked = true;
  props.reservationItems.forEach(item => {
    if (!checkboxState[item.uniqueItemId]) allChecked = false;
  })

  const submitAndClose = () => {
    const reservationItems = JSON.parse(JSON.stringify(props.reservationItems));
    reservationItems.forEach((item, index) => {
      const state = checkboxState[index];
      if (toggle === 'recorded') {
        item.recorded = state;
      }
      item.returned = state;
    });
    props.onHide();
    props.onSubmit(props.reservation, reservationItems);
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {toggle === 'returned' ? 'Rented' : 'Returned'} Items
          </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div >
          <div>
            <FormControlLabel

              control={toggle === 'recorded' ?
                <Checkbox style={{ color: '#dc3545' }}
                  disabled
                  color="secondary"
                  onChange={onCheckAll}
                  checked={checkedAll}
                /> :
                <GreenCheckbox
                  disabled={!validReturn}
                  onChange={onCheckAll}
                  checked={checkedAll}
                />
              }
              label="Check / Uncheck All"
            />
            <Divider />
          </div>
          {
            props.reservationItems.map(item => (
              <div>
                <FormControlLabel
                  control={toggle === 'recorded' ?
                    <Checkbox style={{ color: '#dc3545' }}
                      disabled
                      color="secondary"
                      checked={checkboxState[item.uniqueItemId]}
                      onChange={handleChange.bind(null, item.uniqueItemId)}
                      name={item.uniqueItemId}
                    /> :
                      <GreenCheckbox
                        disabled={!validReturn}
                        checked={checkboxState[item.uniqueItemId]}
                        onChange={handleChange.bind(null, item.uniqueItemId)}
                      /> 
                  }
                  label={<>{item.description} <strong>{item.itemId}</strong></>}
                />
              </div>
            ))
          }
        </div>

      </Modal.Body>
      <Modal.Footer>
        <div>
          <Button className="ReturnButton"
            style={{
              width: '90px',
              backgroundColor: toggle === 'returned' ? "#017bff" : "#E95056",
              color: "white"
            }}
            onClick={submitAndClose}>
            {
              toggle === 'returned'
                ? <Text>Return</Text>
                : <Text>Record</Text>
            }
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}