/**
 * @Author QIANMINGLIANG
 * @Date 2022-11-09 10:21:02
 * @Description 请填写简介
 * @memo
 */
import type { fileType, FileUploadProps } from '@/components/FileUpload';
import FileUpload from '@/components/FileUpload';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { Modal } from 'antd';
import type { RcFile } from 'antd/lib/upload';
import { useEffect, useState } from 'react';

interface IVideoUpload extends Omit<FileUploadProps, 'value' | 'onChange' | 'render' | 'maxCount'> {
  value?: fileType[];
  onChange?: (value?: fileType) => void;
  // maxCount?: number; //最多上传数量 默认为1
}

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const VideoUpload = (props: IVideoUpload) => {
  const { value, onChange, ...rest } = props;
  /**
   * @name Modal
   */
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewVideo, setpreviewVideo] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  //  视频预览触发按钮
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setpreviewVideo(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };
  // function previewFile(file: File | Blob) {
  //   console.log({ file });

  //   return new Promise<string>((resolve) => {
  //     // resolve(file)

  //   });
  // }
  /**
   * @name 添加预览图片
   */
  useEffect(() => {
    const Tag = document.getElementsByClassName('ant-upload-span')?.[0];
    let video = document.createElement('video'); //创建一个a标签

    if (!!value && value?.length >= 1 && !!value[0]?.url) {
      // dom 有可能没创建  暂时定时器
      setTimeout(() => {
        video.id = 'video';
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'fill';
        video.controls = false;
        video.autoplay = true;
        video.muted = false;
        video.src = value[0].url;
        Tag.appendChild(video);
        Tag.removeChild(Tag.firstElementChild!);
      }, 200);
    }
  }, [value]);

  const uploadButton = <PlusOutlined style={{ fontSize: '40px', color: '#ccc' }} />;
  return (
    <>
      <FileUpload
        onChange={onChange}
        value={value}
        listType="picture-card"
        {...rest}
        render={() => ((value ?? []).length >= 1 ? null : uploadButton)}
        // 受控模式下不生效
        // previewFile={previewFile}
        onPreview={handlePreview}
        maxCount={1}
        maxSize={20}
        accept={'video/mp4'}
      />
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <video width="100%" controls={true} autoPlay={true} muted={false} src={previewVideo}>
          您的浏览器不支持播放该视频！
        </video>
      </Modal>
    </>
  );
};

export default VideoUpload;
