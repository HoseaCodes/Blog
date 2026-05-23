import React, { Component } from 'react';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default class Clock extends Component {
  constructor() {
    super();
    this.state = { current_time: new Date() };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState({ current_time: new Date() });
    }, 10 * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { current_time } = this.state;
    const day = DAYS[current_time.getDay()];
    let hour = current_time.getHours();
    let minute = current_time.getMinutes();
    const month = MONTHS[current_time.getMonth()];
    const date = current_time.getDate().toLocaleString();
    const meridiem = hour < 12 ? 'AM' : 'PM';
    if (minute.toString().length === 1) minute = '0' + minute;
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;
    return <span>{`${day} ${month} ${date} ${hour}:${minute} ${meridiem}`}</span>;
  }
}
