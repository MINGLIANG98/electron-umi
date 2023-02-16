
import { request } from 'umi'
export type LoginParamsType = {
    name: string;
    passWord: string;
    mobile: string;
    captcha: string;
  };

export async function fakeAccountLogin(params: LoginParamsType) {
    console.log("*********");
    return request('/account/auth/login',  {
      method: 'POST',
      data: params,
    });
  }