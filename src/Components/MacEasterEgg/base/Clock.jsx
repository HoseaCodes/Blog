import React, { Component } from 'react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default class Clock extends Component {
  constructor() {
    super();
    this.state = { now: new Date() };
  }
  componentDidMount() {
    this.interval = setInterval(() => this.setState({ now: new Date() }), 30 * 1000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render() {
    const d = this.state.now;
    const day = DAYS[d.getDay()];
    const month = MONTHS[d.getMonth()];
    const date = d.getDate();
    let hour = d.getHours();
    let minute = d.getMinutes();
    const ampm = hour < 12 ? 'AM' : 'PM';
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;
    if (minute < 10) minute = '0' + minute;
    return <span>{`${day} ${month} ${date}  ${hour}:${minute} ${ampm}`}</span>;
  }
}
