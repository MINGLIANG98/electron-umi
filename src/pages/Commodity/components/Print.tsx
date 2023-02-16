/**
 * @Author QIANMINGLIANG
 * @Date 2022-11-07 14:31:19
 * @Description 请填写简介
 * @memo
 */
import { ProForm, ProFormText, ProFormDigit } from '@ant-design/pro-components';
import { Card, Row, Col, Button, Space } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import PitcureUpload from '@/components/FileUpload/components/PitcureUpload';
import styles from '../index.less';
import React, { useEffect, useRef } from 'react';
import MaterialScan from './component/materialScan';
import FileUpload from '@/components/FileUpload';
import type { ProductRecord } from '..';
import PrintQrCode from '@/components/Scan/PrintQrCode';
import MachineScan from '@/pages/Product/components/component/MachineScan';
interface IPrintProps {
  value: ProductRecord | undefined;
  onChange: () => void;
  submit: (value: ProductRecord) => void;
}
// 商品打印
const Print: React.FC<IPrintProps> = ({ value, onChange, submit }) => {
  const [formInstance] = useForm();
  const printRef = useRef<any>();

  useEffect(() => {
    const { product, ...rest } = value ?? {};
    console.log(product, rest);

    formInstance.setFieldsValue({
      logo: (value?.product?.commodityAttach ?? []).slice(0, 1),
      ...product,
      ...rest,
    });
    formInstance.setFieldsValue(value);
    return () => {};
  }, [value]);
  const print = () => {
    printRef.current?.handlePrint();
  };
  const renderPrint = () => {
    const queryStringify = (obj: Record<string, string | number>) => {
      let query = '?';
      for (const [key, value] of Object.entries(obj)) {
        query += `${key}=${value}&`;
      }
      return query.substring(0, query.length - 1);
    };
    return (
      <ProForm.Item labelCol={{ span: 4 }} shouldUpdate>
        {({ getFieldsValue, getFieldValue }) => {
          const printData = getFieldsValue([
            'id',
            // 'productCode',
            // 'footprintCode',
            // 'batchCode',
          ]);
          // 公共参数
          const url = `http://mes.wisdomopen.com:11113/goods${queryStringify(printData)}`;
          // 产品码/二维码共用编号
          // ??  不可为空  二维码的qrcode根据此生成 扫码也要依据footprintCode的命名规则
          const footprintCode = getFieldValue('footprintCode');
          // 打印数量
          const length = getFieldValue('printNumber');
          const printValue = [...Array(length ?? 0).keys()].map(
            (item) => url + `&QrCode=${footprintCode}_${item}`,
          );
          if (!printData.id || printValue.length === 0) {
            // message.error('缺少打印数据');
            return '';
          }
          const str = getFieldValue('commodityName');
          const name = str.length > 12 ? str.substring(0, 24) + '...' : str;
          return (
            <PrintQrCode
              onBeforePrint={() => {}}
              onAfterPrint={() => {
                const res = formInstance.getFieldsValue();
                submit({ ...res, printBatchCode: printValue, id: value!.id });
              }}
              qrcodeList={printValue}
              ref={printRef}
              title="原材料记录"
              name={name}
            />
          );
        }}
      </ProForm.Item>
    );
  };
  return (
    <>
      <Card>
        <ProForm<ProductRecord>
          name="add"
          form={formInstance}
          layout={'horizontal'}
          // labelCol={{ span: 4 }}
          submitter={false}
        >
          <Row wrap={true} gutter={20} justify="space-around">
            <Col span={10}>
              <Card title="原材料" type="inner" className={styles.halfCard}>
                <ProForm.Item name="material">
                  <MaterialScan readonly={true} />
                </ProForm.Item>
              </Card>
              <Card title="机器" type="inner" className={styles.halfCard}>
                <ProForm.Item name="machine">
                  <MachineScan readonly={true} />
                </ProForm.Item>
              </Card>
            </Col>
            <Col span={14}>
              <Card title="商品" type="inner" className={styles.innerCard}>
                <Row wrap={true} className={styles.desc} gutter={20}>
                  <Col span={8}>
                    <ProForm.Item wrapperCol={{ span: 24 }} name="logo">
                      <PitcureUpload
                        className={styles.pic}
                        renderReadonly={() => '默认展示主图'}
                        disabled
                      />
                    </ProForm.Item>
                  </Col>
                  <Col span={16}>
                    <ProFormText name="footprintCode" label="跟踪条码" readonly />
                    <ProFormText name="commodityName" label="商品" readonly />
                    <ProFormText name="commodityCode" label="商品编码" readonly />
                    <ProForm.Item shouldUpdate noStyle>
                      {({ getFieldValue }) => {
                        const spec = getFieldValue('commoditySpec') ?? {};
                        let str = '';
                        for (const [key, value] of Object.entries(spec)) {
                          str += `${key}:${value} `;
                        }
                        return (
                          <ProFormText
                            name="productSpec"
                            label="规格"
                            readonly
                            fieldProps={{
                              value: str,
                            }}
                          />
                        );
                      }}
                    </ProForm.Item>
                    <ProForm.Item shouldUpdate noStyle>
                      {({ getFieldValue }) => (
                        <>
                          <ProFormDigit
                            name="amount"
                            label="单位数量"
                            readonly
                            addonAfter={<div>{getFieldValue('product')?.unit ?? '份'}</div>}
                          />
                        </>
                      )}
                    </ProForm.Item>
                    <ProFormText name="batchCode" label="批次号" readonly />
                    <ProFormText name="status" label="状态" readonly />
                    <ProFormText name="relationCode" label="关联跟踪编号" readonly />
                    <ProFormDigit name="printNumber" label="打印数量" readonly />
                    <ProForm.Item name="attach" label={'附件凭证'}>
                      <FileUpload render={() => <></>} />
                    </ProForm.Item>
                    {renderPrint()}
                    <Space className={styles.printSubmit}>
                      <Button type="primary" onClick={print}>
                        打印
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => {
                          onChange?.();
                        }}
                      >
                        修改
                      </Button>
                    </Space>
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

export default Print;
