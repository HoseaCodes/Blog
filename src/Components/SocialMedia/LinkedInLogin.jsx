import React from "react";
import { Button } from "../Button/Button";

const LinkedInLogin = () => {

  const getLinkedInUrl = () => {
    const clientId = process.env.REACT_APP_LINKEDIN_CLIENT_ID;
    const redirectUri = "http://localhost:3000/admin/blog/new";
    const scope = "w_member_social";
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=123456`;
    window.location.href = authUrl;
  };

  return (
    <div>
      <Button
        onClick={() => getLinkedInUrl()}
        primary
        label="Login with LinkedIn"
        type="submit"
      />
    </div>
  );
};

export default LinkedInLogin;