import React from "react";
import moment from "moment";
import "../calendar_orig.css";

export default class Calendar extends React.Component {
  weekdayshort = moment.weekdaysShort();
  weekdayshortname = this.weekdayshort.map(day => {
    return (
      <th key={day} className="week-day">
        {day}
      </th>
    );
  });

  state = {
    showCalendarTable: true,
    showMonthTable: false,
    showYearTable: false,
    dateObject: moment(),
    allmonth: moment.months()
  };
  /* Getter functions */
  firstDayOfMonth = () => {
    let dateObject = this.state.dateObject;
    let firstDay = moment(dateObject)
      .startOf("month")
      .format("d");
    return firstDay;
  };

  daysInMonth = () => {
    let dateObject = this.state.dateObject;
    let days = moment(dateObject).daysInMonth();
    return days;
  };

  currentDay = () => {
    return this.state.dateObject.format("D");
  };

  month = () => {
    return this.state.dateObject.format("MMMM");
  };

  year = () => {
    return this.state.dateObject.format("Y");
  };

  MonthList = props => {
    let months = [];
    props.data.map(data => {
      months.push(
        <td
          key={data}
          className="calendar-month"
          onClick={e => {
            this.setMonth(data);
          }}
        >
          <span>{data}</span>
        </td>
      );
    });

    let rows = [];
    let cells = [];
    months.forEach((row, i) => {
      if (i % 3 !== 0 || i == 0) {
        cells.push(row);
      } else {
        rows.push(cells);
        cells = [];
        cells.push(row);
      }
    });
    rows.push(cells);
    let monthlist = rows.map((d, i) => {
      return <tr>{d}</tr>;
    });
    return (
      <table className="calendar-month">
        <thead>
          <tr>
            <th colSpan="4">Select a Month</th>
          </tr>
        </thead>
        <tbody>{monthlist}</tbody>
      </table>
    );
  };
  // update month name when clicked
  setMonth = month => {
    let monthNo = this.state.allmonth.indexOf(month);
    let dateObject = Object.assign({}, this.state.dateObject);
    dateObject = moment(dateObject).set("month", monthNo); // change value
    this.setState({
      dateObject: dateObject,
      showMonthTable: !this.state.showMonthTable, // hide month table after click
      showCalendarTable: !this.state.showCalendarTable
    });
  };
  // hide calendar & show month
  showMonth = (e, month) => {
    this.setState({
      showMonthTable: !this.state.showMonthTable,
      showCalendarTable: !this.state.showCalendarTable
    });
  };

  YearTable = props => {
    let months = [];
    let nextten = moment()
      .set("year", props)
      .add("year", 12)
      .format("Y");

    let twelveyears = this.getDates(props, nextten);
    twelveyears.map(data => {
      months.push(
        <td
          key={data}
          className="calendar-month"
          onClick={e => {
            this.setYear(data);
          }}
        >
          <span>{data}</span>
        </td>
      );
    });
    let rows = [];
    let cells = [];

    months.forEach((row, i) => {
      if (i % 3 !== 0 || i == 0) {
        cells.push(row);
      } else {
        rows.push(cells);
        cells = [];
        cells.push(row);
      }
    });
    rows.push(cells);
    let yearlist = rows.map((d, i) => {
      return <tr>{d}</tr>;
    });

    return (
      <table className="calendar-month">
        <thead>
          <tr>
            <th colSpan="4">Select a Year</th>
          </tr>
        </thead>
        <tbody>{yearlist}</tbody>
      </table>
    );
  };

  setYear = year => {
    let dateObject = Object.assign({}, this.state.dateObject);
    dateObject = moment(dateObject).set("year", year);
    this.setState({
      dateObject: dateObject,
      showYearTable: !this.state.showYearTable
    });
  };

  showYearTable = e => {
    this.setState({
      showYearTable: !this.state.showYearTable,
      showDateTable: !this.state.showDateTable
    });
  };

  onDayClick = (e, d) => {
	  this.setState({
		  selectedDay: d
	  },
	  () => {
		  e.target.closest('td').className += 'selected';
		  console.log("Selected Day: ", this.state.selectedDay);
	  });
  };

  getDates(startDate, stopDate) {
    var dateArray = [];
    var currentDate = moment(startDate);
    var stopDate = moment(stopDate);
    while (currentDate <= stopDate) {
      dateArray.push(moment(currentDate).format("YYYY"));
      currentDate = moment(currentDate).add("year", 1);
    }
    return dateArray;
  }

  render() {
    let blanks = [];
    for (let i = 0; i < this.firstDayOfMonth(); i++) {
      blanks.push(<td className="calendar-day empty">{""}</td>);
    }
    // td of date in the month
    let daysInMonth = [];
    for (let d = 1; d <= this.daysInMonth(); d++) {
      // highlight current day
      daysInMonth.push(
        <td key={d} className={`calendar-day`}>
		<span onClick = { e => {
			this.onDayClick(e, d);
		}} >
		{d}
		</span>
        </td>
      );
    }
    // convert days of month to rows and cells
    var totalSlots = [...blanks, ...daysInMonth];
    let rows = [];
    let cells = [];

    totalSlots.forEach((row, i) => {
      if (i % 7 !== 0) {
        cells.push(row); // if index not equal 7 that means not go to next week
      } else {
        rows.push(cells); // when reach next week we contain all td in last week to rows
        cells = []; // empty container
        cells.push(row); // in current loop we still push current row to new container
      }
      if (i === totalSlots.length - 1) {
        // when end loop we add remain date
        rows.push(cells);
      }
    });

    let daysinmonth = rows.map((d, i) => {
      return <tr>{d}</tr>;
    });

    return (
    <div className="wrapper">
      <div className="tail-datetime-calendar">
        <div
          className="calendar-navi"
          onClick={e => {
            this.showMonth();
          }}
        >
          <span data-tail-navi="switch" class="calendar-label">
            {this.month()}
          </span>
          <span className="calendar-label" onClick={e => this.showYearTable()}>
            {this.year()}
          </span>
        </div>
        <div className="calendar-date">
          {this.state.showYearTable && (
	  	<this.YearTable props={this.year()} />
	  )}
          {this.state.showMonthTable && (
            <this.MonthList data={moment.months()} />
          )}
        </div>
        {this.state.showCalendarTable && (
          <div className="calendar-date">
            <table className="calendar-day">
              <thead>
                <tr>{this.weekdayshortname}</tr>
              </thead>
              <tbody>{daysinmonth}</tbody>
            </table>
          </div>
        )}
      </div>
      <h1>Date Selection</h1>
    </div>
    );
  }
}
