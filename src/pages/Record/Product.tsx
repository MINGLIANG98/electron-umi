/**
 * @Author QIANMINGLIANG
 * @Date 2022-12-07 09:10:53
 * @Description 请填写简介
 * @memo
 */

import { PRODUCT_FOOTPRINT } from '@/services/config';
import WImage from '@/components/Image';
import type { ProductRecord } from '../Product';
import { jumpEdit } from '@/components/Tools';
import ListSelectModal from '@/components/ListTable/Components/ListSelectModal';
import { useAccess } from 'umi';
// todo  线程通信
// import { useClientSize } from "@/components/Tools";
// const electron = window.require('electron');

// 产成品类型
export type TProduct = {
  id: number;
  code: string; // 产成品编号
  name: string; // 产成品名称
  unit: string; // 单位
  rawMaterial: {
    name: string;
    serialNumber: string;
    image: any[];
    // 原材料
    // ...
  }[];
  image: any[]; // 图片
  productSpec: string;
  intorduce: string;
  category?: {
    categoryId: string;
    categoryName: string;
    serialNumber: string;
  };
  categoryId: string;
  categoryName: string;
  serialNumber: string;
};

const RecordListmodal: React.FC<any> = () => {
  const { canAdmin, currentUser } = useAccess();
  const columns = [
    {
      title: '产品名称',
      dataIndex: 'name',
      render(entity: any) {
        return entity?.product?.name;
      },
    },
    {
      title: '产成品编号',
      dataIndex: 'productCode',
    },
    {
      title: '批次号',
      dataIndex: 'batchCode',
    },
    {
      title: '标签编号',
      dataIndex: 'bqbh',
      render(entity: any) {
        const total = (entity.useBatchCode?.length ?? 0) + (entity.printBatchCode?.length ?? 0);
        return entity.footprintCode + `_(0/${total})`;
      },
      width: 160,
    },
    {
      title: '规格',
      dataIndex: 'productSpec',
      render(entity: any) {
        return entity?.product?.productSpec;
      },
    },
    {
      title: '单位数量',
      dataIndex: 'amount',
    },
    {
      title: '条码数量',
      dataIndex: 'tmsl',
      render(entity: any) {
        const total = (entity.useBatchCode?.length ?? 0) + (entity.printBatchCode?.length ?? 0);
        return total;
      },
    },
    {
      title: '已使用/未使用',
      dataIndex: 'use',
      render({ useBatchCode, printBatchCode }: any) {
        return `${useBatchCode?.length ?? 0}/${printBatchCode?.length ?? 0}`;
      },
      width: 120,
    },
    {
      title: '区块链凭证',
      dataIndex: 'pz',
      render: () => '-',
    },
  ];
  const onsubmit = (selectedRows: any) => {
    if (location.hash.search('/product') > 0) {
      jumpEdit('/product', selectedRows);
      location.reload();
      return;
    }
    jumpEdit('/product', selectedRows);
  };
  const isAdmin = canAdmin ? {} : { 'creator:id': currentUser?.id };
  return (
    <>
      <ListSelectModal<ProductRecord>
        isPad={true}
        renderName={'产成品条码记录'}
        title={'产成品条码记录'}
        recordItem={1}
        onChange={onsubmit}
        url={PRODUCT_FOOTPRINT}
        footer={false}
        filterValue={{ type: '半成品', ...isAdmin }}
        metas={{
          avatar: {
            dataIndex: 'image',
            render(_: any, { product }: any) {
              return (
                <WImage type="components" width={80} height={80} src={product?.image?.[0]?.url} />
              );
            },
          },
          content: columns,
        }}
      />
    </>
  );
};

export default RecordListmodal;
