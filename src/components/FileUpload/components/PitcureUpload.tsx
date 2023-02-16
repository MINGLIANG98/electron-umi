/**
 * @Author QIANMINGLIANG
 * @Date 2022-11-08 16:44:39
 * @Description 请填写简介
 * @memo
 */

import type { fileType, FileUploadProps } from '@/components/FileUpload';
import FileUpload from '@/components/FileUpload';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { Modal } from 'antd';
import type { RcFile } from 'antd/lib/upload';
import React, { useState } from 'react';
import ImgCrop from 'antd-img-crop';
import WImage from '@/components/Image';
import { PRODUCTION_URL } from '@/requestErrorConfig';
const PREDICT = process.env.NODE_ENV === "development" ? "" : PRODUCTION_URL;
interface IPitcureUpload
    extends Omit<FileUploadProps, 'value' | 'onChange' | 'render' | 'maxCount'> {
    value?: fileType[];
    onChange?: (value?: fileType[]) => void;
    maxCount?: number; //最多上传数量 默认为1
    ImgCropProps?: any;
    renderReadonly?: () => React.ReactNode; // value为空自定义展示内容
}

const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const PitcureUpload = (props: IPitcureUpload) => {
    const { value, onChange, maxCount = 1, ImgCropProps, renderReadonly, ...rest } = props;
    /**
     * @name Modal
     */
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };
    const uploadButton = <PlusOutlined style={{ fontSize: '40px', color: '#ccc' }} />;

    const render = () => {
        if (!!renderReadonly) {
            return (value ?? []).length >= 1 ? null : renderReadonly();
        }
        return (value ?? []).length >= maxCount ? null : uploadButton;
    };
    return (
        <>
            <ImgCrop rotate {...ImgCropProps}>
                <FileUpload
                    listType="picture-card"
                    accept={'.png,.jpg'}
                    render={render}
                    {...rest}
                    onChange={onChange}
                    value={value?.map(item=>({
                    ...item,
                    thumbUrl:`${PREDICT}${item.url}`
                    }))}
                    onPreview={handlePreview}
                    maxCount={maxCount}
                />
            </ImgCrop>
            <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={() => setPreviewOpen(false)}
            >
                <WImage alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    );
};

export default PitcureUpload;
