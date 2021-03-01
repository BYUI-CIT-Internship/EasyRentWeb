import './App.css';
import BarNav from './BarNav.js';
import React, { useState, TouchableOpacity, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-dropdown/style.css';
import ReservationList from './ReservationList';
import DropdownButton from 'react-bootstrap/DropdownButton';
import DropdownItem from 'react-bootstrap/DropdownItem';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from './Footer';


const EasyRentURL = "https://easyrent-api-dev.cit362.com/reservations";

const today = new Date();
today.setHours(0,0,0,0);

const pastDue = new Date(today);
const future = new Date(today);

pastDue.setDate(today.getDate() - 1);
future.setDate(today.getDate() + 1);

function App() {

  const [startDate, setStartDate] = useState(new Date());
  const [dropdownSelected, setDropDownSelected] = useState('Today');
  const [daySelected, setDaySelected] = useState(today);
  const [DropdownButtonDate, setDropdownButtonDate] = useState({});
  const [show, setShow] = useState('today');

  function handleChange(e) {
    console.log("The title is =====", e)
    setDropDownSelected(e);
    switch (e) {
      case "Today":
        setDaySelected(today);
        console.log("The title Today =====", today)
        setShow('today')
        break;
      case "Past Due":
        setDaySelected(pastDue);
        console.log("The title PastDue =====", pastDue)
        setShow('past')
        break;
      case "Future":
        setDaySelected(future);
        console.log("The title Future =====", future)
        setShow('future')
        break;
    }
  };

  return (
    <div className="App">
      <BarNav />
      <h1 className="TitleReservations" variant="h1" Wrap>
        Due Date Returns
        </h1>

      <div className="Dropdown">
        <DropdownButton title={dropdownSelected} onSelect={handleChange}>
          <DropdownItem eventKey="Past Due">Past Due</DropdownItem>
          <DropdownItem eventKey="Today">Today</DropdownItem>
          <DropdownItem eventKey="Future">Future</DropdownItem>
        </DropdownButton>
      </div>

      <div className="DPk">
        <DatePicker className="datePicker"
          selected={daySelected.valueOf() !== today.valueOf()
            ? daySelected
            : daySelected
          }
          onChange={date => setDaySelected(date)}

          popperPlacement="bottom"
          dateFormat="MMMM d, yyyy"
        />
      </div>

      <div >
        <ReservationList show={show} daySelected={daySelected} />
      </div>
     
      <Footer />
    </div>
  )
}


export default App;
