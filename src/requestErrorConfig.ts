/**
 * @Author: QIANMINGLIANG
 * @Date: 2022-11-30 16:36:48
 * @Description: 请填写简介
 * @memo:
 */
import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from 'umi';
import { notification } from 'antd';

const codeMessage: Record<number, string> = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，请求数据不符合设置定义。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
// 生产环境服务器地址
export const PRODUCTION_URL = 'http://124.70.149.118:11114/';
/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  baseURL:
    // 生产环境请求地址
    process.env.NODE_ENV === 'development' ? '/' : PRODUCTION_URL,
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res) => {
      // console.log(res);
      const errorText = codeMessage[res.code] || res.message;
      notification.error({
        message: `请求错误`,
        description: errorText,
      });
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      const { response } = error;
      if (response && response.status) {
        const errorText = codeMessage[response.status] || response.statusText;
        const { status, url } = response;
        if (status === 401) {
          //token失效
          // window.location.replace('/user/login');
          // return response;
        }
        if (status === 403) {
          //token失效
          notification.error({
            message: '用户名或者密码错误',
            description: '请检查用户名和密码是否正确',
          });
          return response;
        }

        notification.error({
          message: `请求错误 ${status}: ${url}`,
          description: errorText,
        });
      } else if (!response) {
        notification.error({
          description: '您的网络发生异常，无法连接服务器',
          message: '网络异常',
        });
      }
      return response;
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      // console.log(config);

      // 拦截请求配置，进行个性化处理。
      // const url = config?.url?.concat('?token = 123');
      // return { ...config, url };
      return {
        ...config,
      };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 拦截响应数据，进行个性化处理
      // const { data } = response as unknown as ResponseStructure;

      // if (data?.success === false) {
      //   message.error('请求失败！');
      // }
      return response;
    },
  ],
};
