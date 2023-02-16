/**
 * @Author QIANMINGLIANG
 * @Date 2022-11-21 16:17:15
 * @Description 请填写简介
 * @memo
 */
import { ProForm, ProFormText, ProFormDigit } from "@ant-design/pro-components";
import { Card, Row, Col, Button, Space } from "antd";
import { useForm } from "antd/lib/form/Form";
import PitcureUpload from "@/components/FileUpload/components/PitcureUpload";
import styles from "../index.less";
import React, { useEffect, useRef, useState } from "react";
import FileUpload from "@/components/FileUpload";
import type { MaterialRecord } from "..";
import { useDetectPrint } from "@/components/Tools";
import PrintQrCode from "@/components/Scan/PrintQrCode";
import { PRODUCTION_URL } from "@/requestErrorConfig";

interface IPrintProps {
  value: MaterialRecord | undefined;
  onChange: () => void;
  submit: (value: Partial<MaterialRecord>) => void;
}
const Print: React.FC<IPrintProps> = ({ value, onChange, submit }) => {
  const [formInstance] = useForm();
  const isPrinting = useDetectPrint();
  const [isPrint, setisPrint] = useState(false);
  const printRef = useRef<any>();
  useEffect(() => {
    const { material, supplier, ...rest } = value ?? {};
    formInstance.setFieldsValue({
      materialName: material.name,
      supplierName: supplier?.name,
      image: (material.image ?? []).slice(0, 1),
      ...rest,
    });
    return () => {};
  }, [value]);
  const print = () => {
    printRef.current?.handlePrint();
  };

  const renderPrint = () => {
    const queryStringify = (obj: Record<string, string | number>) => {
      let query = "?";
      for (const [key, value] of Object.entries(obj)) {
        query += `${key}=${value}&`;
      }
      return query.substring(0, query.length - 1);
    };
    return (
      <ProForm.Item labelCol={{ span: 4 }} shouldUpdate>
        {({ getFieldsValue, getFieldValue }) => {
          const printData = getFieldsValue([
            "id",
            // 'materialCode',
            // 'footprintCode',
            // 'batchCode',
          ]);
          // 公共参数
          const url = `${PRODUCTION_URL}productRecord/rawMaterial/add${queryStringify(
            printData
          )}`;
          // 产品码/二维码共用编号
          // ??  不可为空  二维码的qrcode根据此生成 扫码也要依据footprintCode的命名规则
          const footprintCode = getFieldValue("footprintCode");
          // 打印数量
          const length = getFieldValue("printNumber");
          const printValue = [...Array(length ?? 0).keys()].map(
            (item) => url + `&QrCode=${footprintCode}_${item}`
          );
          if (!printData.id || printValue.length === 0) {
            // message.error('缺少打印数据');
            return "";
          }
          return (
            <PrintQrCode
              onBeforePrint={() => {
                setisPrint(true);
              }}
              onAfterPrint={() => {
                setisPrint(false);
                submit({ printBatchCode: printValue,id: value!.id });
              }}
              qrcodeList={printValue}
              ref={printRef}
              title="原材料记录"
              name={getFieldValue("materialName")}
            />
          );
        }}
      </ProForm.Item>
    );
  };
  return (
    <>
      <Card title="原材料记录">
        <ProForm<MaterialRecord>
          name="add"
          form={formInstance}
          layout={"horizontal"}
          // labelCol={{ span: 4 }}
          submitter={false}
        >
          <Row wrap={true} gutter={20} justify="space-around">
            <Col span={10} style={{ padding: "0 30px" }}>
              <ProForm.Item wrapperCol={{ span: 24 }} name="image">
                <PitcureUpload
                  className={styles.pic}
                  renderReadonly={() => "默认展示主图"}
                  disabled
                />
              </ProForm.Item>
            </Col>
            <Col span={14}>
              <div className={styles.innerCard}>
                <Row wrap={true} className={styles.desc} gutter={20}>
                  <Col span={16}>
                    <ProFormText name="batchCode" label="批次号" readonly />
                    <ProFormText
                      name="footprintCode"
                      label="跟踪条码"
                      readonly
                    />
                    <ProFormText
                      name="materialName"
                      label="原材料名称"
                      readonly
                    />
                    <ProFormText
                      name="materialCode"
                      label="原材料编码"
                      readonly
                    />
                    <ProFormText name="materialSpec" label="规格" readonly />
                    <ProFormText name="supplierName" label="供应商" readonly />
                    <ProFormDigit
                      readonly
                      name="amount"
                      label="单位数量"
                      addonAfter={<div>{value?.material?.unit}</div>}
                    />
                    <ProFormText name="status" label="状态" readonly />
                    <ProFormText
                      name="relationCode"
                      label="关联跟踪编号"
                      readonly
                    />
                    <ProFormDigit
                      name="printNumber"
                      label="打印数量"
                      readonly
                      addonAfter={<div>份</div>}
                    />
                    <ProForm.Item name="attach" label={"附件凭证"}>
                      <FileUpload render={() => <></>} />
                    </ProForm.Item>
                    {/* <ProForm.Item name="jindu" label={'打印进度'}>
                                            <Progress
                                                status={isPrinting ? 'active' : 'exception'}
                                                percent={50}
                                                strokeLinecap="square"
                                            />
                                        </ProForm.Item> */}
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
              </div>
            </Col>
          </Row>
          {/* </Card> */}
        </ProForm>
      </Card>
    </>
  );
};

export default Print;
