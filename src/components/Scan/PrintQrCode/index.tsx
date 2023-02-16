/**
 * @Author QIANMINGLIANG
 * @Date 2022-11-24 16:37:11
 * @Description 请填写简介
 * @memo
 */
import { searchQuery } from '@/components/Tools';
import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import type { IQrCode } from '../QrCode';
import QrCode from '../QrCode';
import styles from './index.less';
//  作者：showmaker
//  链接：https://juejin.cn/post/7133523775844253733
interface PrintCode {
    qrcodeList: string[]; //批量打印的二维码或图片数据
    qrcodeProps?: Omit<IQrCode, 'value'>;
    onAfterPrint?: () => void;
    onBeforePrint?: () => void;
    title?: string;
    name?: string;
}
export type ScanAction = {
    handlePrint: () => void;
};
const PrintQrCode = forwardRef(
    (
        { name, qrcodeList, title, qrcodeProps = {}, onAfterPrint, onBeforePrint }: PrintCode,
        ref: React.ForwardedRef<ScanAction>,
    ) => {
        const qrcodePrintRef = useRef<HTMLDivElement>(null);
        useImperativeHandle(ref, () => ({
            handlePrint: () => {
                handlePrint();
            },
        }));
        // 缓存内容
        const reactToPrintPatchContent = useCallback(() => {
            return qrcodePrintRef.current;
        }, [qrcodePrintRef.current]);
        // const changeCanvasToPic = () => {
        //     const canvasImg = document.getElementById('qrCode') as HTMLCanvasElement; // 获取canvas类型的二维码
        //     const img = new Image();
        //     img.src = canvasImg.toDataURL('image/png', 1.0); // 将canvas对象转换为图片的data url
        // };
        /**
         * 批量打印
         */
        const handlePrint = useReactToPrint({
            content: reactToPrintPatchContent,
            documentTitle: title,
            removeAfterPrint: true,
            // copyStyles: true,
            // 导入样式表
            bodyClass: styles.Box,
            onAfterPrint: onAfterPrint,
            onBeforePrint: onBeforePrint,
            onPrintError: (
                errorLocation: 'onBeforeGetContent' | 'onBeforePrint' | 'print',
                error: Error,
            ) => {
                console.log({ errorLocation, error });
            },
        });

        const getIndex = (index: any) => {
            return index;
        };
        const Colstyle = {
            padding: '1mm  4mm',
            wordBreak: 'break-all',
            textAlign: 'center',
        } as React.CSSProperties;
        return (
            <div style={{ height: '0px', overflow: 'hidden' }}>
                <div ref={qrcodePrintRef}>
                    {qrcodeList.map((msg, idx) => {
                        return (
                            // 一页
                            <div key={getIndex(idx)} className="page-break">
                                <div>
                                    <div style={Colstyle} className={'logobox'}>
                                        <QrCode value={msg} {...qrcodeProps} />
                                    </div>
                                    <div style={Colstyle} className={'msg'}>
                                        <div style={{fontSize:'10px',marginBottom:'10px'}}>{searchQuery(msg, 'QrCode')}</div>
                                        {name && <div>{name}</div>}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    },
);

export default PrintQrCode;
