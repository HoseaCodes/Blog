import React from 'react';
import './Toast.css'
const toasts = [
  {
    category: "success",
    message: "Right on! Your account has been updated."
  },
  {
    category: "warning",
    message: "Hmmm. Something doesn't look right."
  },
  {
    category: "error",
    message: "Uh oh! Something went terribly wrong!"
  }
];

function Toast(props) {
  return (
    <div className={`Toast Toast--${props.category}`}>
      <main className="Toast__message">
        <header className="Toast__message-category">{props.category}</header>
        <p className="Toast__message-text">{props.message}</p>
      </main>
      <button className="Toast__button" type="button" onClick={() => props.dismiss(props.id)}>
        Dismiss
      </button>
    </div>
  );
}

// class App extends React.Component {
//   render() {
//     return (
//       <div>
//         {toasts.map((toast, i) => (
//           <Toast category={toast.category} key={i} message={toast.message} />
//         ))}
//       </div>
//     );
//   }
// }

export default Toast;
