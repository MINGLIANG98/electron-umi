/**
 * @Author QIANMINGLIANG
 * @Date 2022-11-18 13:33:57
 * @Description 请填写简介
 * @memo
 */
import PitcureUpload from '@/components/FileUpload/components/PitcureUpload';
import React, { useRef, useState } from 'react';
import { Row, Col, Button, Empty, message, Tooltip } from 'antd';
import Scan from '@/components/Scan';
import { PRODUCT_FOOTPRINT } from '@/services/config';
import { searchQuery } from '@/components/Tools';
import { CloseCircleOutlined } from '@ant-design/icons';
import type { ProductRecord } from '../..';
import styles from '@/pages/Commodity/index.less';
// todo  MF 原材料  PF 产成品/半成品
enum URLMap {
  // 'MF' = RAW_MATERIAL_FOOTPRINT,
  'PF' = PRODUCT_FOOTPRINT,
}
interface ImaterialScanProps {
  value?: ProductRecord[];
  onChange?: (value?: ProductRecord[]) => void;
  readonly?: boolean;
}
const overflowCss: React.CSSProperties = {
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
};
const MaterialScan: React.FC<ImaterialScanProps> = ({ onChange, readonly, value }) => {
  const ScanInstance = useRef<any>();
  const [loading, setloading] = useState(false);

  const cloumns = [
    {
      title: '原材料名称',
      dataIndex: 'name',
      render: (record: any) => {
        return record?.product?.name;
      },
    },
    {
      title: '原材料编号',
      dataIndex: 'productCode',
      render: (record: any) => {
        return record?.product?.productCode;
      },
    },
    {
      title: '产品码',
      dataIndex: 'qrCode',
      render: (record: any) => {
        return searchQuery(record?.qrCode ?? '', 'QrCode');
      },
    },
    {
      title: '批次号',
      dataIndex: 'batchCode',
    },
    {
      title: '规格',
      dataIndex: 'productSpec',
    },
    //  {
    //      title: '供应商',
    //      dataIndex: 'supplier',
    //      render: (record: any) => {
    //          return record?.supplier?.name;
    //      },
    //  },
    {
      title: '数量',
      dataIndex: 'num',
      render: ({ amount, product }: any) => {
        return `${amount ?? 0}${product?.unit}`;
      },
    },
  ];
  const onScanChange = (data: any) => {
    if (data.length == 0) {
      // onChange?.(undefined);
      return;
    }
    onChange?.(data);
  };
  const renderButton = () => {
    if (readonly) {
      return <></>;
    }
    return (
      <>
        <Button
          loading={loading}
          type="primary"
          className={styles.scanButton}
          onFocus={() => {
            ScanInstance.current?.startScan?.();
          }}
          onBlur={() => {
            ScanInstance.current?.closeScan?.();
          }}
        >
          扫码
        </Button>
      </>
    );
  };
  const remove = (removeId: number) => {
    onChange?.(value?.filter(({ id }) => id !== removeId));
    message.success('删除成功');
  };
  const renderMaterial = () => {
    if (!value) {
      return (
        <>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="扫码添加原料" />
        </>
      );
    }
    console.log({ value });

    const dom = (value ?? []).map((item) => {
      return (
        <div key={item.id}>
          <Row gutter={12} style={{ margin: '5px 0' }}>
            <Col span={8}>
              <PitcureUpload
                className={styles.pic}
                value={item.product?.image?.slice(0, 1)}
                renderReadonly={() => '扫码添加原料'}
                disabled
              />
            </Col>
            <Col span={16}>
              <Row gutter={10} style={{ lineHeight: '40px', marginTop: '10px' }}>
                {cloumns.map(({ title, dataIndex, render }) => (
                  <Col span={12} key={dataIndex} style={overflowCss}>
                    <span>{title}: </span>
                    <span style={{ fontSize: '14px' }}>
                      <Tooltip
                        title={render?.(item) ?? item?.[dataIndex]}
                        color={'#ffff'}
                        overlayInnerStyle={{ color: 'black' }}
                      >
                        {render?.(item) ?? item?.[dataIndex]}
                      </Tooltip>
                    </span>
                  </Col>
                ))}
              </Row>
              {!readonly && (
                <CloseCircleOutlined
                  style={{
                    color: '#00bab5',
                    fontSize: 20,
                    position: 'absolute',
                    right: 5,
                    top: -5,
                    cursor: 'pointer',
                  }}
                  onClick={() => remove(item.id)}
                />
              )}
            </Col>
          </Row>
          <div
            style={{
              borderBottom: '2px dashed #ccc',
              margin: '10px 0',
            }}
          />
        </div>
      );
    });
    return dom;
  };
  const requestEvent = (url: string) => {
    // ??  tag有可能为空
    const tag = searchQuery(url, 'QrCode')?.substring(0, 2) ?? '';
    return { url: URLMap[tag], params: { id__eq: searchQuery(url, 'id') } };
  };
  return (
    <div className={styles.scanWrapper}>
      <div className={styles.materialBox}>{renderMaterial()}</div>
      <div className={styles.buttonBox}>{renderButton()}</div>
      <div style={{ padding: '0  10px' }}>
        <Scan
          ref={ScanInstance}
          value={value}
          requestParamter={(url: string) => requestEvent(url)}
          onChange={onScanChange}
          onLoading={(e: boolean) => setloading(e)}
        />
      </div>
    </div>
  );
};

export default MaterialScan;
