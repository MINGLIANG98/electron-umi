/**
 * @Author QIANMINGLIANG
 * @Date 2022-12-12 10:13:07
 * @Description 请填写简介
 * @memo
 */

import { DeleteOutlined } from '@ant-design/icons';
import type { ActionType, ProListMetas } from '@ant-design/pro-components';
import { ModalProps, Space } from 'antd';
import { message, Modal, Button } from 'antd';
import { useEffect, useRef, useState } from 'react';
import ListTable, { contentColumns } from '..';
import styles from './modal.less';

// ? 联合类型收窄
type Model<T> =
  | {
      model?: 'mutplie';
      onChange?: (selectedRows?: T[]) => void;
      value?: T[];
    }
  | {
      model?: 'single';
      value?: T;
      onChange?: (selectedRows?: T) => void;
    };
interface IModalProps<T> extends Partial<Omit<ModalProps, 'visible' | 'onCancel'>> {
  renderName?: string; //todo 暂时使用     visible调试完成之后废弃
  // todo  外部控制有问题  受控组件 未做
  visible?: boolean;
  // 显示value的情况下必填 非受控组件
  ButtonKeyName?: keyof T;
  // model?: 'mutplie' | 'single';
  // value: T[] | T;
  // Modal提交
  // onChange?: (selectedRows?: T[] | T) => void;
  // 关闭Modal
  onCancel?: () => void;
  // 过滤参数
  filterValue?: Record<string, any>;
  toolbar?: {
    title?: string;
    search: string[]; //需要查找的字段
  };
  // 请求url
  url: string;
  // 类型不通过
  // metas: Pick<ListTableProps<T>, 'metas'>;
  metas: { content?: contentColumns<T> } & Omit<ProListMetas<T>, 'content'>;
  // 自定义按钮
  render?: () => void;
  recordItem?: number; //一行几条数据 默认两条
  // Pad选择方式为双击 web为底部选择
  isPad?: boolean;
}
type ListSelectModalProps<T> = IModalProps<T> & Model<T>;

const ListSelectModal = <T extends { id: number }>(props: ListSelectModalProps<T>) => {
  const {
    // MODAL
    renderName,
    ButtonKeyName,
    visible,
    value,
    onChange,
    onCancel,
    render,
    isPad,
    // LISTABLE
    url,
    metas,
    toolbar,
    filterValue,
    recordItem,
    model = 'single',
    ...modalProps
  } = props;
  // 自我控制visible
  const [selfVisible, setselfVisible] = useState(false);
  // 选中行
  const [selectRow, setselectRow] = useState<T[]>([]);
  const listRef = useRef<ActionType>();

  useEffect(() => {
    // 自定义渲染下 modal 由 组件visible控制
    // 非自定义渲染下 modal 由 selfVisible控制
    if (!!render || visible == null || visible === undefined) {
      return;
    }
    setselfVisible(visible);
  }, [visible, render]);

  const renderButton = () => {
    if (!!render) {
      return render();
    }
    return <Button onClick={() => setselfVisible(true)}>{renderName ?? '+选择'}</Button>;
  };
  const renderValue = () => {
    if (!ButtonKeyName) {
      return '';
    }
    const remove = (item: T) => {
      onChange?.((value as T[]).filter((itm) => itm.id !== item.id) as any);
    };
    if (model === 'mutplie') {
      return ((value as T[]) ?? []).map((item, index) => (
        <Button
          key={item.id ?? index}
          style={{ lineHeight: '16px' }}
          icon={<DeleteOutlined className={styles.icon} onClick={() => remove(item)} />}
        >
          <span
            style={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100px',
              overflow: 'hidden',
            }}
          >
            {item[ButtonKeyName] as string}
          </span>
        </Button>
      ));
    }
    return (
      !!value && (
        <Button
          style={{ lineHeight: '16px' }}
          icon={<DeleteOutlined className={styles.icon} onClick={() => onChange?.(undefined)} />}
        >
          <span
            style={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100px',
              overflow: 'hidden',
            }}
          >
            {((value as T)?.[ButtonKeyName] as string) ?? ''}
          </span>
        </Button>
      )
    );
  };
  // 确认
  const onOk = (selectVal: T[]) => {
    if (selectVal.length === 0) {
      message.warning('请至少选择一条货物！');
      return;
    }
    // 多选情况下 afterClsoe 回调可能失效未知原因  与单选不同onChange导致-----
    if (model === 'mutplie') {
      if (((value as T[]) ?? []).find((item) => item.id === selectVal[0].id)) {
        message.error('请勿重复选择货物');
        return;
      }
      onChange?.(((value as T[]) ?? []).concat(selectVal) as any);
    } else {
      if ((value as T)?.id === selectVal[0].id) {
        message.error('请勿重复选择货物');
        return;
      }
      onChange?.(selectVal[0] as any);
    }
    if (!render) {
      setselfVisible(false);
    }
    // 主动清除
    setselectRow([]);
    return;
  };
  // 取消
  const onCloseModal = () => {
    onCancel?.();
    if (!render) {
      setselfVisible(false);
    }
  };
  // 关闭回调 未知原因不生效
  // const afterClose = () => {
  //     setselectRow([]);
  // };
  return (
    <>
      {/* @ts-ignore  children类型报错 */}
      <Space>
        {renderValue()}
        {renderButton()}
        <Modal
          className={styles.modal}
          title={'数据选择'}
          open={!!render ? visible : selfVisible}
          onOk={() => onOk(selectRow)}
          onCancel={onCloseModal}
          width={'80%'}
          bodyStyle={{ maxHeight: '70vh', overflowY: 'scroll' }}
          // afterClose={afterClose}
          // forceRender
          // 关闭弹窗不会清除组件state数据 afterClose清除
          destroyOnClose
          {...(isPad ? { footer: false } : {})}
          {...modalProps}
        >
          <ListTable<T>
            recordItem={recordItem}
            filterValue={filterValue}
            toolbar={!isPad ? toolbar : undefined}
            ref={listRef}
            url={url}
            metas={metas}
            onSelect={function (selectVal: any[], type: 'click' | 'doubleClick'): void {
              if (type === 'doubleClick' && isPad) {
                onOk(selectVal);
                return;
              }
              // throw new Error('Function not implemented.');
              setselectRow(selectVal);
            }}
          />
        </Modal>
      </Space>
    </>
  );
};

export default ListSelectModal;
