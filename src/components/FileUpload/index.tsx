/*
 * @Description:
 * @Author: ZhangKai
 * @Todo: 后续需要继续完成的内容
 * @Interface:
 * @memo: 注释
 */
import React from 'react';
import type { UploadProps } from 'antd';
import { Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { FILE_UPLOAD_URL } from '@/services/config';
import { downloadFileUseGET } from './util';
import { uploadFile } from '@/common/common_api';
export interface FileUploadProps extends Omit<UploadProps, 'value' | 'onChange' | 'name'> {
  maxSize?: number; //最大上传限制 单位M  默认10M
  name?: string;
  tips?: string;
  value?: fileType[];
  onChange?: (value?: any) => void;
  render?: () => React.ReactNode; //自定义按钮
}
export interface fileType {
  name: string;
  uid: string;
  url: string;
}
const FileUpload: React.FC<FileUploadProps> = (props) => {
  const { name, tips, onChange, value, render, maxSize = 10, ...rest } = props;

  // 历史原因，在 beforeUpload 返回 false 时，会返回 File 对象。
  // 在下个大版本我们会统一返回 { originFileObj: File } 对象。
  // 当前版本已经兼容所有场景下 info.file.originFileObj 获取原 File 写法。你可以提前切换。
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const beforeUpload = (file: any) => {
    // const r = new FileReader();
    // r.readAsDataURL(_file);
    // r.onload = e => {
    //   _file.thumbUrl = e.target!.result;
    //   setFileList((state: any) => ([...state, _file]));
    // };
    if (file.size / 1024 / 1024 > maxSize) {
      message.error(`文件大小超过${maxSize}M，无法上传`);
      return false;
    }
    // 上传完成
    return false;
  };
  const handleFileChange = async (info: any) => {
    let { file, fileList } = info;
    // // 上传中
    // if(file && file.status === 'uploading'){
    // }    
    // // 上传完成
    // if (file && file.status === 'done') {
    // }
    //点击删除按钮，文件状态变为removed
    if (file.status === 'removed') {
      if (fileList.length === 0) {
        onChange?.(undefined);
        return;
      }
    }
    // 受控组件需感知所有状态的upload数组 故放在最下面
    // https://github.com/ant-design/ant-design/issues/2423#issuecomment-233523579
    onChange?.(
      fileList.map((record: any) => ({
        url: record.url,
        name: record.name,
        uid: record.uid,
      })),
    );
  };
  const renderAction = () => {
    if (render) {
      return render?.();
    }
    return <Button icon={<UploadOutlined />}>{name ?? '上传文件'}</Button>;
  };
  // 链接：https://juejin.cn/post/6958308203763662856
  const handleUpload = async (option: any) => {
    const file = option.file as any;
    uploadFile(
      FILE_UPLOAD_URL,
      file.name,
      file,
      (result) => {
        file.url = result;
        file.thumbUrl = result;
        // onSuccess的回调参数可以在 UploadFile.response 中获取
        option.onSuccess(result);
      },
      (err) => {
        message.error('上传失败' + err);
        option.onError(err);
      },
    );
  };
  return (
    <>
      <Upload
        customRequest={handleUpload}
        // beforeUpload={(file) => beforeUpload(file)}
        onChange={handleFileChange}
        fileList={value}
        // 预览文件下载
        onPreview={(e) => downloadFileUseGET(e as any)}
        {...rest}
      >
        {renderAction()}
      </Upload>
      <div style={{ color: 'red' }}>{tips}</div>
    </>
  );
};
export default FileUpload;
