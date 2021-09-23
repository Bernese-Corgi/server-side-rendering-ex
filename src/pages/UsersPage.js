import React from 'react';
import { Route } from 'react-router';
import { UserContainer, UsersContainer } from '../containers';

const UsersPage = () => {
  return (
    <>
      <UsersContainer />
      <Route
        path="/users/:id"
        render={({ match }) => <UserContainer id={match.params.id} />}
      />
    </>
  );
};

export default UsersPage;
