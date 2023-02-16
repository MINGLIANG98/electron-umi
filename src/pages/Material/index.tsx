/**
 * @Author QIANMINGLIANG
 * @Date 2022-11-21 16:05:41
 * @Description 请填写简介
 * @memo
 */

import { queryRecordById, updateRecordById, addRecord } from '@/common/common_api';
import { searchQuery } from '@/components/Tools';
import { RAW_MATERIAL_FOOTPRINT } from '@/services/config';
import { message, Tabs } from 'antd';
import { useState, useEffect } from 'react';
import Edit from './components/Edit';
import Print from './components/Print';
import styles from './index.less';
import { omitBy, isNil } from 'lodash';
import { useModel } from 'umi';
export type MaterialRecord = {
  id: number;
  supplier: any;
  status: '未使用' | '已使用' | '部分使用';
  relationCode: string; //关联足迹编码
  printNumber: number;
  materialSpec: string;
  material: any; //物料名
  materialCode: string;
  footprintCode: string;
  buyNumber: number;
  batchCode: string;
  attach: any[];
  printBatchCode?: string[];
  useBatchCode?: string[];
  qrCode: string;
};

const Add = () => {
  const [activeKey, setactiveKey] = useState<string>('edit');
  const [record, setrecord] = useState<MaterialRecord>();
  const { initialState } = useModel('@@initialState');

  const URL_ID = searchQuery(location.href, 'id'); // 获取修改时url带来的id
  useEffect(() => {
    console.log(URL_ID);

    if (!!URL_ID) {
      queryRecordById(
        RAW_MATERIAL_FOOTPRINT,
        // @ts-ignore
        { id__eq: URL_ID },
        (data: any) => {
          // console.log('=====详情', data);
          if (!data) {
            message.error('查询失败');
            return;
          }
          setactiveKey('print');
          setrecord(data);
        },
        (msg: string) => message.error(msg),
      );
    }
    return () => {};
  }, [URL_ID]);

  /**
   * @name 修改
   * @description
   */
  const dispatchModify = async (params: any): Promise<number> => {
    return new Promise<number>((resolve, reject) => {
      updateRecordById(
        RAW_MATERIAL_FOOTPRINT,
        {
          creator: omitBy(initialState?.currentUser, isNil),
          ...params,
        },
        (res) => {
          resolve(res);
        },
        () => {
          message.error('修改失败');
          reject();
        },
      );
    });
  };
  /**
   * @name 新增
   * @description
   */
  const dispatchCreate = async (params: any): Promise<number> => {
    return new Promise<number>((resolve, reject) => {
      addRecord(
        RAW_MATERIAL_FOOTPRINT,
        {
          creator: omitBy(initialState?.currentUser, isNil),
          ...params,
        },
        (res) => {
          console.log(res);

          resolve(res);
        },
        () => {
          message.error('新建失败');
          reject();
        },
      );
    });
  };
  const onEditChange = (data: MaterialRecord) => {
    console.log(data);

    const { material, ...rest } = data;
    // 修改-- 有id或者有数据都是修改
    const modifyID = URL_ID ?? record?.id;
    if (modifyID) {
      dispatchModify({ material, ...material, ...rest, id: modifyID }).then(() => {
        queryRecordById(RAW_MATERIAL_FOOTPRINT, { id: modifyID }, (record) => {
          setrecord(record);
          setactiveKey('print');
        });
      });
      return;
    }
    // 新建
    dispatchCreate({ material, ...material, ...rest }).then((res) => {
      queryRecordById(RAW_MATERIAL_FOOTPRINT, { id: res }, (record) => {
        setrecord(record);
        setactiveKey('print');
      });
    });
  };
  const cloumns = [
    {
      components: <Edit value={record} onChange={onEditChange} />,
      key: 'edit',
    },
    {
      components: (
        <Print
          value={record}
          onChange={() => {
            setactiveKey('edit');
          }}
          submit={(data: Partial<MaterialRecord>) => {
            dispatchModify({ ...data }).then(() => {
              // history.back()
              location.reload();
            });
          }}
        />
      ),
      key: 'print',
    },
  ];
  return (
    <>
      <Tabs
        activeKey={activeKey}
        className={styles.tab}
        tabPosition={'left'}
        items={cloumns.map((item) => ({
          label: '',
          key: item.key,
          children: item.components,
        }))}
      />
    </>
  );
};

export default Add;
