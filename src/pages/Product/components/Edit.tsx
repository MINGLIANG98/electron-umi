/**
 * @Author QIANMINGLIANG
 * @Date 2022-11-07 14:31:19
 * @Description 请填写简介
 * @memo
 */
import { ProForm, ProFormText, ProFormDigit } from '@ant-design/pro-components';
import { Card, Row, Col, Button } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import PitcureUpload from '@/components/FileUpload/components/PitcureUpload';
import styles from '../index.less';
import FileUpload from '@/components/FileUpload';
import type { ProductRecord } from '..';
import { useEffect } from 'react';
import ProductSelectModal from '@/pages/Material/components/components/ProductSelectModal';
import MaterialScan from './component/materialScan';
import MachineScan from './component/MachineScan';

interface IEDitProps {
  onChange: (formData: ProductRecord) => void;
  value?: ProductRecord;
}
const Edit: React.FC<IEDitProps> = ({ onChange, value }) => {
  const [formInstance] = useForm();

  useEffect(() => {
    if (value) {
      formInstance.setFieldsValue({
        ...value,
        logo: (value?.product?.image ?? []).slice(0, 1),
      });
    }
  }, [value]);
  const submitEvent = async () => {
    const formData = await formInstance.validateFields();
    onChange(formData);
  };
  const onProductChange = (product: any) => {
    formInstance.setFieldsValue({
      logo: (product?.image ?? []).slice(0, 1),
      productSpec: product?.productSpec,
    });
  };
  return (
    <>
      <Card>
        <ProForm<ProductRecord>
          name="edit"
          form={formInstance}
          layout={'vertical'}
          // labelCol={{ span: 4 }}
          submitter={false}
        >
          <Row wrap={true} gutter={20} justify="space-around">
            <Col span={10}>
              <Card title="原材料" type="inner" className={styles.halfCard}>
                <ProForm.Item
                  name="material"
                  rules={[
                    {
                      required: true,
                      message: '请录入原材料',
                    },
                  ]}
                >
                  <MaterialScan />
                </ProForm.Item>
              </Card>
              <Card title="机器" type="inner" className={styles.halfCard}>
                <ProForm.Item name="machine">
                  <MachineScan />
                </ProForm.Item>
              </Card>
            </Col>
            <Col span={14}>
              <Card title="产成品" type="inner" className={styles.innerCard}>
                <Row wrap={true} className={styles.edit} gutter={20}>
                  <Col span={8}>
                    <ProForm.Item
                      wrapperCol={{ span: 24 }}
                      style={{ marginTop: '20px' }}
                      name="logo"
                    >
                      <PitcureUpload
                        className={styles.pic}
                        renderReadonly={() => '默认展示主图'}
                        disabled
                      />
                    </ProForm.Item>
                  </Col>
                  <Col span={16}>
                    <ProForm.Item
                      name="product"
                      label="产成品"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <ProductSelectModal onChange={onProductChange} />
                    </ProForm.Item>
                    <ProFormText disabled name="productSpec" label="规格" placeholder={''} />
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
                              addonAfter: <div>{getFieldValue('product')?.unit}</div>,
                            }}
                            addonAfter={<div />}
                          />
                        </>
                      )}
                    </ProForm.Item>

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
                    <Button type="primary" className={styles.submit} onClick={submitEvent}>
                      提交
                    </Button>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          {/* </Card> */}
        </ProForm>
      </Card>
    </>
  );
};

export default Edit;
