import { Form, Input } from 'antd';
import ButtonSelect from './ButtonSelect';
import styles from './Button.less';

/**
 * @Author QIANMINGLIANG
 * @Date 2022-12-05 16:52:04
 * @Description 请填写简介
 * @memo
 */
interface Iprops {
    dependence?: any[];
    name: string;
    readonly?: boolean
}
const CommditySpecSelect = ({ dependence, name,readonly }: Iprops) => {
    if (!dependence || dependence?.length == 0) {
        return <Input disabled placeholder="暂无规格值" />;
    }
    const dom = dependence.map((record, index) => {
        return (
            <Form.Item
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                label={record.name}
                name={[name, record.name]}
                rules={[{ required: true, message: `请选择${record.name}` }]}
                labelAlign={'left'}
                wrapperCol={{ span: 8,offset:1 }}
                className={styles.Button}
            >
                <ButtonSelect readonly={readonly} dependence={record.values ?? []} />
            </Form.Item>
        );
    });
    return <>{dom}</>;
};
export default CommditySpecSelect;
