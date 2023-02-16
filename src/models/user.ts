import { fakeAccountLogin } from '@/services/login';
import { queryUsers, queryUser } from '@/services/user'
 
export default {
    namespace: 'user',
  state: {
    currentUser: {},
  },
 
  effects: {
    // @ts-ignore
    *login({ payload }, { call, put }) {
        console.log("---->",payload);
        const res = yield call(fakeAccountLogin, payload);
        console.log(res);

    },
    // @ts-ignore
    *queryUser({ payload }, { call, put }) {
        console.log("---->",payload);
      const { data } = yield call(queryUser, payload);
      yield put({ type: 'queryUserSuccess', payload: data });
    },
  },
 
  reducers: {
    // @ts-ignore
    queryUserSuccess(state, { payload }) {
      return {
        ...state,
        user: payload,
      };
    },
     // @ts-ignore
    saveUser(state, { payload }) {
        return {
          ...state,
          user: payload,
        };
      },
  },
};