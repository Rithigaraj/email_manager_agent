import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

// MailPilot only supports Google OAuth (see spec section 4) -- there is no
// separate email/password signup. Google's consent screen handles both
// "sign up" and "sign in" for first-time and returning users alike, so this
// route simply sends people to the single Google login screen.
const Signup = () => {
  useEffect(() => {
    document.title = 'MailPilot';
  }, []);

  return <Navigate to="/login" replace />;
};

export default Signup;
