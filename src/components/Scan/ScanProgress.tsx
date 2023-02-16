import type { ProgressProps } from 'antd';
import { Progress } from 'antd';
import { useEffect, useState } from 'react';

export interface Scan_progress_type extends Omit<ProgressProps, 'status' | 'percent'> {
    percent: number;
    onChange?: (precent: number) => void;
    status?: 'success' | 'normal' | 'exception' | 'active' | undefined;
}
const ScanProgress = (props: Scan_progress_type) => {
    const { percent = 0, onChange, status, ...rest } = props;
    const [isshow, setisshow] = useState(false);

    const closeEvent = () => {
        setTimeout(() => {
            setisshow(false);
        }, 300);
        setTimeout(() => {
            onChange?.(0);
        }, 800);
    };
    useEffect(() => {
        // 100加载完成-》隐藏
        if (percent === 100) {
            closeEvent();
        }
        // 不等于零-》展示
        if (percent !== 0) {
            setisshow(true);
            return;
        }
    }, [percent]);
    useEffect(() => {
        if (!status) {
            return;
        }
        // 状态为红色 即为失败->隐藏
        if (status === 'exception') {
            closeEvent();
        }
    }, [status]);

    const fanOut: React.CSSProperties = {
        transition: 'opacity  0.5s linear',
        opacity: 0,
    };
    const fadeIn: React.CSSProperties = {
        opacity: 1,
    };
    return (
        <Progress
            style={isshow ? fadeIn : fanOut}
            strokeColor={status === 'exception' ? '#ff4d4f' : '#66c9ff'}
            status={status ?? 'success'}
            {...rest}
            percent={percent}
        />
    );
};
export default ScanProgress;
