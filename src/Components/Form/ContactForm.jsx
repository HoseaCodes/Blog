import React, {useRef} from 'react'
import { StyledFormSubmit } from '../../Layout/Form/styledInput';
import {useNotification} from "../../GlobalState";
import './Contact.css'

const ContactForm = () => {
  const dispatch = useNotification();
  const form = useRef();

  const handleConfirm = () => {
    form.current.submit();
  };

  const formNotification = () => {
    dispatch({
      type: "SUCCESS",
      message: "Processing Your Request...Please Wait",
      title: "Successful Request"
    })
  }

  const handleNotification = async () => {
    await formNotification();
    await handleConfirm();
  }

  return (<>
        <div className='contact-container'>
            <p>Have a question? I am available for hire and open to any ideas of cooperation.</p>
            <form ref={form} onSubmit={handleNotification} action="https://getform.io/f/7efda21f-ca67-48f6-8a1e-723776d4ae3b" method='POST'>
                <input className='contact-input' type="text" name="name" placeholder="Name" />
                <input className='contact-input' type="email" name="email" placeholder="Enter Email" />
                <textarea className='area' name="message" placeholder='Your Message' />
                <StyledFormSubmit  onClick={handleNotification} type="submit" value="Submit"/>
            </form>
        </div>
    </>
  )
}

export default ContactForm;
