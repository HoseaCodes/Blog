import React, {useState, useEffect} from 'react';
import './Notification.css';

const Notification = (props) => {
  const [exit, setExit] = useState(false);
  const [width, setWidth] = useState(0);
  const [intervalID, setIntervalID] = useState(null);

  const handleStartTimer = () => {

    const id = setInterval(() => {
      setWidth((prevState) => {
        if (prevState < 100) {
          return prevState + 0.5;
        }
        clearInterval(id);
        return prevState;
      });
    }, 10)

    setIntervalID(id);

  };

  const handlePauseTimer = () => {
    clearInterval(intervalID);
  };

  const handleCloseNotification = () => {
    handlePauseTimer();
    setExit(true);
    setTimeout(() => {
      props.dispatch({
        type: "REMOVE_NOTIFICATION",
        id: props.id
      })
    }, 400)
  };

  useEffect(() => {
    if (width === 100) {
      handleCloseNotification();
    }
  }, [width])

  useEffect(() => {
    handleStartTimer();
  }, []);

  return (
    <div onMouseOver={handlePauseTimer} onMouseLeave={handleStartTimer}
    className={`notification-item ${props.type === "SUCCESS" ? "success" : "error"}
    ${exit ? "exit" : ""}`}>
      <p>{props.message}</p>
      <div className={"bar"} style={{width: `${width}%`}}>

      </div>
    </div>
  )
}

export default Notification;
