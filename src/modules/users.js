import axios from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';

/* 액션 타입 (thunk) --------------------------------- */
const GET_USERS_PENDING = 'users/GET_USERS_PENDING';
const GET_USERS_SUCCESS = 'users/GET_USERS_SUCCESS';
const GET_USERS_FAILURE = 'users/GET_USERS_FAILURE';

/* 액션 타입 (saga) --------------------------------- */
const GET_USER = 'users/GET_USER';
const GET_USER_SUCCESS = 'users/GET_USER_SUCCESS';
const GET_USER_FAILURE = 'users/GET_USER_FAILURE';

/* 액션 생성 함수 (thunk) -------------------------------- */
const getUsersPending = () => ({ type: GET_USERS_PENDING });
const getUsersSuccess = payload => ({ type: GET_USERS_SUCCESS, payload });
const getUsersFailure = payload => ({
  type: GET_USERS_FAILURE,
  error: true,
  payload,
});

/* 액션 생성 함수 (saga) -------------------------------- */
export const getUser = id => ({ type: GET_USER, payload: id });
const getUserSuccess = data => ({ type: GET_USER_SUCCESS, payload: data });
const getUserFailure = error => ({
  type: GET_USER_FAILURE,
  payload: error,
  error: true,
});

/* thunk 함수 (thunk) -------------------------------- */
export const getUsers = () => async dispatch => {
  try {
    dispatch(getUsersPending());
    const response = await axios.get(
      'https://jsonplaceholder.typicode.com/users'
    );
    dispatch(getUsersSuccess(response));
  } catch (e) {
    dispatch(getUsersFailure(e));
    throw e;
  }
};

/* saga 함수 (saga) -------------------------------- */
const getUserById = id =>
  axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);

function* getUserSaga(action) {
  try {
    const response = yield call(getUserById, action.payload);
    yield put(getUserSuccess(response.data));
  } catch (e) {
    yield put(getUserFailure(e));
  }
}

export function* usersSaga() {
  yield takeEvery(GET_USER, getUserSaga);
}

/* 초기 상태  ---------------------------------------- */
const initialState = {
  users: null,
  loading: {
    users: false,
    user: false,
  },
  error: {
    users: null,
    user: null,
  },
};

/* 리듀서 (thunk) ---------------------------------- */
// 이 모듈에서 관리하는 API는 한 개 이상이므로 loadingUsers, loadingUser 와 같이 각 값에 하나하나 이름을 지어 주는 대신이 loading이라는 객체에 넣어준 것이다.
function users(state = initialState, action) {
  switch (action.type) {
    /* users 리듀서 (thunk) --------------------------- */
    case GET_USERS_PENDING:
      return {
        ...state,
        loading: { ...state.loading, users: true },
        error: { ...state.error, users: null },
      };
    case GET_USERS_SUCCESS:
      return {
        ...state,
        loading: { ...state.loading, users: false },
        users: action.payload.data,
      };
    case GET_USERS_FAILURE:
      return {
        ...state,
        loading: { ...state.loading, users: false },
        error: { ...state.error, users: action.payload },
      };
    /* user 리듀서 (saga) ----------------------------- */
    case GET_USER:
      return {
        ...state,
        loading: { ...state.loading, user: true },
        error: { ...state.error, user: null },
      };
    case GET_USER_SUCCESS:
      return {
        ...state,
        loading: { ...state.loading, user: false },
        user: action.payload,
      };
    case GET_USER_FAILURE:
      return {
        ...state,
        loading: { ...state.loading, user: false },
        error: { ...state.error, user: action.payload },
      };
    default:
      return state;
  }
}

export default users;
