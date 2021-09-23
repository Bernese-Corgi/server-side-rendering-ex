import React from 'react';

const User = ({ user }) => {
  const { email, name, username } = user;

  // user 값이 null인지 유효성 검사를 여기서 하지 않는다.
  return (
    <div>
      <h1>
        {username} ({name})
      </h1>
      <p>
        <b>e-mail:</b> {email}
      </p>
    </div>
  );
};

export default User;
