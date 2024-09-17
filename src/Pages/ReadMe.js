import React from 'react';
import { useLocation, Link } from 'react-router-dom';

function ReadMe() {
  const location = useLocation();
  const { uniqueCode, eventName } = location.state || {};

  return (
    <div>
      <h1>Read Me</h1>
      <p>Thank you for your payment for event: {eventName}</p>
      <p>Your unique edit code is: {uniqueCode}</p>
      <p>Please keep this code safe as you'll need it to make any changes to your event.</p>


      <Link to="/">
      Home
      </Link>
    </div>
  );
}

export default ReadMe;