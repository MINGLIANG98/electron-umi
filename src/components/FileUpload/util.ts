/**
 * @Author: QIANMINGLIANG
 * @Date: 2022-10-08 15:08:12
 * @Description: 请填写简介
 * @memo:
 */
// import request from '@/common/request/request';
import { request } from 'umi';

/**
 * @name get请求下载文件
 * @description  规避a标签无法下载txt jpg(浏览器支持直接预览的文件不会默认下载)类型文件问题
 * @link https://blog.csdn.net/weixin_44050812/article/details/113248345
 * @param {object} params
 */
export const downloadFileUseGET = (params: { name: string; url: string }) => {
  const { name, url } = params;
  request(url, {
    method: 'GET',
    responseType: 'blob',
    param: {},
  }).then((content) => {
    try {
      let a = document.createElement('a'); // 生成一个a元素
      let event = new MouseEvent('click'); // 创建一个单击事件
      a.download = name; // 设置图片名称
      const data = new Blob([content]);
      a.href = URL.createObjectURL(data); // 将生成的URL设置为a.href属性
      a.dispatchEvent(event); // 触发a的单击事件
      URL.revokeObjectURL(a.href);
    } catch (e) {
      console.error(e);
    }
  });
};

/** 
 * @name get请求文件
 */
export const requestFileUseGET = (url: string,param: any) => {
  const msg = request(url, {
    method: 'GET',
    responseType: 'blob',
    param: param,
  }).then(() => {});
  return Promise.resolve(msg);
};
