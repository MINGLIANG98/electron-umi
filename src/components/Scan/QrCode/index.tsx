import { QRCodeSVG } from 'qrcode.react';
import React from 'react';

export interface IQrCode {
    value: string;
    size?: number;
    level?: string;
    bgColor?: string;
    fgColor?: string;
    style?: React.CSSProperties;
    includeMargin?: boolean;
    ImageSettings?: {
        src: string;
        height: number;
        width: number;
        excavate: boolean;
        x?: number;
        y?: number;
    };
}
const QrCode: React.FC<IQrCode> = ({ value,...rest }) => {
    return (
        <QRCodeSVG
            value={value}
            size={100} // 二维码的大小
            fgColor="#000000" // 二维码的颜色
            style={{ margin: '0 auto', display: 'block' }}
            {...rest}
            // imageSettings={{
            //     // 二维码中间的logo图片
            //     src: 'logoUrl',
            //     height: 100,
            //     width: 100,
            //     excavate: true, // 中间图片所在的位置是否镂空
            // }}
        />
    );
};

export default QrCode;
