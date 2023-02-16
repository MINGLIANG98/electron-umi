/**
 * @Author QIANMINGLIANG
 * @Date 2022-12-05 17:19:40
 * @Description 请填写简介
 * @memo
 */

import { Radio, Space } from 'antd';
interface Iprops {
    value?: any;
    onChange?: (value: any) => void;
    dependence?: { value: string }[];
    readonly?: boolean
}
const ButtonSelect = ({ value, onChange, dependence,readonly }: Iprops) => {
    const dom = dependence?.map(({ value = '' }, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Radio.Button key={index} value={value}>
            {value}
        </Radio.Button>
    ));
    return (
        <Radio.Group buttonStyle="solid" value={value} onChange={onChange} disabled={readonly}>
            <Space size={10}>{dom}</Space>
        </Radio.Group>
    );
};

export default ButtonSelect;
