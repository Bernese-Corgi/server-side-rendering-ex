import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Users } from '../components';
import { getUsers } from '../modules/users';

const UsersContainer = ({ users, getUsers }) => {
  // 컴포넌트가 마운트되고 나서 호출
  useEffect(() => {
    // users가 이미 유효하다면 요청하지 않음
    if (users) return;
    getUsers();
  }, [getUsers, users]);

  return <Users users={users} />;
};

export default connect(
  state => ({
    users: state.users.users,
  }),
  { getUsers }
)(UsersContainer);
