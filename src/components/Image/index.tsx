/**
 * @Author QIANMINGLIANG
 * @Date 2022-12-02 11:09:58
 * @Description 请填写简介
 * @memo
 */
import { PRODUCTION_URL } from '@/requestErrorConfig';
import { Image, ImageProps } from 'antd';
import { ImgHTMLAttributes } from 'react';

interface IImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  type?: 'components';
}
interface INormalImgProps extends Omit<ImgHTMLAttributes<any>, 'src'> {
  src: string;
  type?: 'origin';
}
// 兼容生产环境 图片无法访问
const PREDICT = process.env.NODE_ENV === 'development' ? '' : PRODUCTION_URL;
const WImage = (props: IImageProps | INormalImgProps) => {
  const { src, type = 'origin', ...rest } = props;

  if (type === 'origin') {
    return <img src={`${PREDICT}${src}`} {...(rest as Omit<ImgHTMLAttributes<any>, 'src'>)} />;
  }
  return <Image src={`${PREDICT}${src}`} {...rest} />;
};
export default WImage;
