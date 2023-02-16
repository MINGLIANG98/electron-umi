/**
 * @Author QIANMINGLIANG
 * @Date 2022-12-09 17:45:24
 * @Description 请填写简介
 * @memo
 */

import { ProListProps, ProListMetas, ActionType, ProList } from '@ant-design/pro-components';
import { ReactNode, Ref, useImperativeHandle, useMemo, useRef, useState } from 'react';
import styles from './index.less';
import { Tooltip, Input } from 'antd';
import React from 'react';
import { queryTable } from '@/common/common_api';
const { Search } = Input;

type ToolbarType = {
  title?: string;
  search: string[]; //需要查找的字段
};
export type contentColumns<T> = {
  title: string;
  dataIndex: string;
  render?: (record: T) => ReactNode;
  width?: string | number;
  ellipsis?: boolean;
}[];
declare module 'react' {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null,
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}
export interface ListTableProps<T> extends Partial<Omit<ProListProps<T>, 'grid' | 'metas'>> {
  filterValue?: Record<string, any>;
  toolbar?: ToolbarType;
  // 请求url
  url: string;
  // list 字段定义  重写content块
  metas: { content?: contentColumns<T> } & Omit<ProListMetas<T>, 'content'>;
  // 自定义按钮
  render?: () => void;
  recordItem?: number; //一行几条数据 默认两条
  onSelect?: (value: T[], type: 'click' | 'doubleClick') => void;
}
const ListTable = React.forwardRef(
  <T extends { id: number }>(props: ListTableProps<T>, ref?: Ref<any>) => {
    const { url, metas, toolbar, filterValue, recordItem = 2, onSelect, ...listProps } = props;
    const { content = [], ...originMetas } = metas;
    const [selectedRowKeys, setSelectedRowKeys] = useState<number>(-1);
    const columns = useMemo(() => {
      const keylist: any[] = [];
      for (let [key, record] of Object.entries(metas)) {
        if (key === 'content') {
          record.map((item: any) => {
            keylist.push(item);
          });
          continue;
        }
        // 防止没有key
        if (!record.dataIndex) {
          continue;
        }
        keylist.push(record);
      }
      return keylist;
    }, [metas, metas.content]);
    // LIST
    const listRef = useRef<ActionType>();
    const [searchParams, setSearchParams] = useState<any>();

    useImperativeHandle(ref, () => ({
      reload: () => {
        listRef.current?.reload();
      },
    }));
    /**
     * @description: 查询
     */
    const queryList = async (params: {
      filterValue?: any;
      searchParams?: any[];
      pageSize?: number;
      current?: number;
      keyword?: string;
      orCondition?: [];
    }) => {
      let andCondition = [];
      if (params.searchParams) {
        andCondition.push(params.searchParams);
        delete params.searchParams;
      }
      if (params.filterValue) {
        andCondition.push(params.filterValue);
        delete params.filterValue;
      }
      return await queryTable(url, {
        andCondition: andCondition as [],
        ...params,
        // ...filterValue,
        orderConditionList: [{ updateTime: 'DESC' }],
      });
    };

    /**
     * 渲染整个toolbar
     */
    const renderToolBar = () => {
      if (!toolbar) return <></>;
      /**
       * 默认搜索函数,将搜索数据加入到过滤集中
       */
      const onSearch = (value: string) => {
        let params = [];
        if (value === '') {
          // 搜索字段为空时
          setSearchParams(undefined);
        } else {
          for (let i = 0; i < toolbar.search.length; i++) {
            let key = toolbar.search[i];
            params.push({
              [`${key}`]: value,
            });
          }
          setSearchParams(params);
        }
        console.log(params);
      };
      const renderSearch = () => {
        if (!toolbar.search || toolbar.search.length === 0) {
          return;
        }
        let text = '搜索';
        let isFirst = true;
        for (let key of toolbar.search) {
          //在COLOMS寻找
          let colms = columns.find((c) => c.dataIndex === key);
          if (!colms) continue;
          if (isFirst) {
            text += colms.title;
            isFirst = false;
          } else {
            text += '、' + colms.title;
          }
        }
        return (
          <Search
            placeholder={text}
            allowClear
            onSearch={onSearch}
            style={{ width: 350, marginRight: 10 }}
            enterButton
          />
        );
      };
      return (
        <div
          style={{
            // height: '100%',
            backgroundColor: 'white',
            paddingLeft: 10,
            paddingTop: 10,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row-reverse',
              justifyContent: 'space-between',
              margin: '0px 10px 10px 10px',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {toolbar?.title && (
                <div style={{ fontSize: 20, fontWeight: 'bold', marginRight: 20 }}>
                  {toolbar?.title}
                </div>
              )}
              {renderSearch()}
            </div>
          </div>
        </div>
      );
    };
    const renderContent = (entity: T) => {
      return content.map((record) => {
        const { title, dataIndex, render, width, ellipsis } = record;
        const msg = render?.(entity) ?? entity[dataIndex];
        return (
          <div
            key={dataIndex}
            style={{
              padding: '10px',
              width: width ?? 100,
            }}
          >
            <div style={{ color: '#00000073' }}>{title}</div>
            {ellipsis ? (
              <Tooltip title={msg} color={'#ffff'} overlayInnerStyle={{ color: 'black' }}>
                <div
                  style={{
                    color: '#000000D9',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {msg}
                </div>
              </Tooltip>
            ) : (
              <div
                style={{
                  color: '#000000D9',
                }}
              >
                {msg}
              </div>
            )}
          </div>
        );
      });
    };
    const renderMetas = {
      ...originMetas,
      content: {
        dataIndex: '@content',
        render(dom: any, entity: T) {
          return (
            <div key="label" style={{ display: 'flex', justifyContent: 'space-around' }}>
              {renderContent(entity)}
            </div>
          );
        },
      },
    };

    const renderTable = () => {
      return (
        <>
          {renderToolBar()}
          <ProList<T>
            tableAlertRender={false}
            {...listProps}
            rowKey="id"
            className={recordItem == 1 ? styles.singleList : styles.list}
            actionRef={listRef}
            toolBarRender={() => {
              return [];
            }}
            params={{
              searchParams,
              filterValue,
            }}
            rowClassName={({ id }: T) => {
              if (recordItem === 1) {
                // 一行一个
                return id === selectedRowKeys ? 'selectRowItem' : '';
              } else {
                // 一行多个
                return id === selectedRowKeys ? 'selectRowItems' : '';
              }
            }}
            onItem={(record) => {
              return {
                onClick: () => {
                  setSelectedRowKeys(record.id);
                  onSelect?.([record], 'click');
                },
                // 双击确认
                onDoubleClick: () => {
                  onSelect?.([record], 'doubleClick');
                },
              };
            }}
            grid={recordItem !== 1 ? { gutter: 16, column: recordItem } : undefined}
            metas={renderMetas}
            request={queryList}
          />
        </>
      );
    };

    return <>{renderTable()}</>;
  },
);

export default ListTable;
