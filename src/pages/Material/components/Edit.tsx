/**
 * @Author QIANMINGLIANG
 * @Date 2022-11-21 16:17:12
 * @Description 请填写简介
 * @memo
 */
import { ProForm, ProFormText, ProFormDigit } from '@ant-design/pro-components';
import { Card, Row, Col, Button } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import PitcureUpload from '@/components/FileUpload/components/PitcureUpload';
import styles from '../index.less';
import FileUpload from '@/components/FileUpload';
import type { MaterialRecord } from '..';
import { useEffect } from 'react';
import MaterialSelectModal from './components/MaterialSelectModal';
import SupplierSelectModal from './components/SupplierSelectModal';

interface IEDitProps {
    onChange: (formData: MaterialRecord) => void;
    value?: MaterialRecord;
}

const Edit: React.FC<IEDitProps> = ({ onChange, value }) => {
    const [formInstance] = useForm();

    useEffect(() => {
        if (value) {
            formInstance.setFieldsValue({
                ...value,
                logo:(value?.material?.image ?? []).slice(0, 1)
            });
        }
    }, [value]);

    const submitEvent = async () => {
        const formData = await formInstance.validateFields();
        onChange(formData);
    };
    const onMaterialChange = (material: any) => {
        let logo, materialSpec;
        if (!!material) {
            logo = (material.image ?? []).slice(0, 1);
            materialSpec = material.materialSpec;
        }
        console.log({material});
        
        formInstance.setFieldsValue({
            logo,
            materialSpec,
        });
    };
    return (
        <Card>
            <Card title={'原材料'} type='inner'>
                <ProForm<MaterialRecord>
                    name="edit"
                    form={formInstance}
                    layout={'vertical'}
                    wrapperCol={{ span: 10 }}
                    submitter={false}
                >
                    <div className={styles.innerCard}>
                        <Row wrap={true} className={styles.edit} gutter={20}>
                            <Col span={8} style={{ padding: '0 30px' }}>
                                <ProForm.Item wrapperCol={{ span: 24 }} name="logo">
                                    <PitcureUpload
                                        className={styles.pic}
                                        renderReadonly={() => '默认展示主图'}
                                        disabled
                                    />
                                </ProForm.Item>
                            </Col>
                            <Col span={16}>
                                <ProForm.Item
                                    name="material"
                                    label="原材料"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <MaterialSelectModal onChange={onMaterialChange} />
                                </ProForm.Item>
                                <ProFormText
                                    // rules={[
                                    //     {
                                    //         required: true,
                                    //     },
                                    // ]}
                                    disabled
                                    name="materialSpec"
                                    label="规格"
                                />
                                <ProForm.Item
                                    name="supplier"
                                    label="供应商"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <SupplierSelectModal />
                                </ProForm.Item>
                                <ProForm.Item shouldUpdate noStyle>
                                    {({ getFieldValue }) => (
                                        <>
                                            <ProFormDigit
                                                rules={[
                                                    {
                                                        required: true,
                                                    },
                                                ]}
                                                name="amount"
                                                label="单位数量"
                                                fieldProps={{
                                                    addonAfter: (
                                                        <div>{getFieldValue('material')?.unit}</div>
                                                    ),
                                                }}
                                                addonAfter={<div />}
                                            />
                                        </>
                                    )}
                                </ProForm.Item>
                                {/* <ProForm.Item
                                    name="batchCode"
                                    label="批次号"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                    initialValue={'相同批次'}
                                >
                                    <Radio.Group  buttonStyle="solid">
                                        <Radio.Button value="相同批次" style={{marginRight:'20px'}}>相同批次</Radio.Button>
                                        <Radio.Button value="批次递增">批次递增</Radio.Button>
                                    </Radio.Group>
                                </ProForm.Item> */}
                                <ProFormDigit
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                    name="printNumber"
                                    label="打印标签数量"
                                    fieldProps={{
                                        addonAfter: <div>份</div>,
                                    }}
                                    addonAfter={<div />}
                                />
                                <ProForm.Item name="attach" label={'附件凭证'}>
                                    <FileUpload name="新增附件" />
                                </ProForm.Item>
                                <Button
                                    type="primary"
                                    className={styles.submit}
                                    onClick={submitEvent}
                                >
                                    提交
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </ProForm>
            </Card>
        </Card>
    );
};

export default Edit;
