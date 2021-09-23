import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User } from '../components';
import { Preloader } from '../lib/PreloadContext';
import { getUser } from '../modules/users';

const UserContainer = ({ id }) => {
  const user = useSelector(state => state.users.user);
  const dispatch = useDispatch();

  useEffect(() => {
    // 중복 요청 방지 : 유저가 존재하고, id가 일치한다면 요청하지 않음
    // parseInt로 변환하여 사용 : URL 파라미터로 받는 id 값은 문자열, user 객체 안에 들어있는 id는 숫자
    if (user && user.id === parseInt(id, 10)) return;

    dispatch(getUser(id));
  }, [dispatch, id, user]); // id가 바뀔 때 새로 요청해야 함

  // 유효성 검사
  // 아직 정보가 없는 경우 user 값이 null을 가리키므로, User 컴포넌트가 렌더링되지 않도록 컨테이너 컴포넌트에서 Preloader 컴포넌트를 반환한다.
  // 서버 사이드 렌더링을 하는 과정에서 데이터가 없을 경우 GET_USER 액션을 발생시킨다.
  if (!user) {
    return <Preloader resolve={() => dispatch(getUser(id))} />;
  }

  return <User user={user} />;
};

export default UserContainer;
