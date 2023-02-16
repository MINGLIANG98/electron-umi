/**
 * @Author QIANMINGLIANG
 * @Date 2022-12-07 09:10:53
 * @Description 请填写简介
 * @memo
 */
import { PRODUCT_FOOTPRINT } from '@/services/config';
import WImage from '@/components/Image';
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

const CommoditYSelectModal: React.FC<any> = () => {
  const { canAdmin, currentUser } = useAccess();
  const columns = [
    {
      title: '商品名称',
      dataIndex: 'product:commodityName',
      render(entity: any) {
        return entity.product?.commodityName;
      },
      ellipsis: true,
      width: 120,
    },
    {
      title: '商品编号',
      dataIndex: 'materialCode',
      render(entity: any) {
        return entity.product?.commodityCode;
      },
      ellipsis: true,
    },
    {
      title: '批次号',
      dataIndex: 'batchCode',
    },
    {
      title: '标签编号',
      dataIndex: 'footprintcode',
      render(entity: any) {
        const total = (entity.useBatchCode?.length ?? 0) + (entity.printBatchCode?.length ?? 0);
        return entity.footprintCode + `_(0/${total})`;
      },
      width: 160,
    },
    {
      title: '规格',
      dataIndex: 'materialSpec',
      render(entity: any) {
        let str = '';
        for (const [key, value] of Object.entries(entity.commoditySpec ?? {})) {
          str += `${key}:${value} `;
        }
        return str;
      },
    },
    {
      title: '单位数量',
      dataIndex: 'amount',
    },
    {
      title: '条码数量',
      dataIndex: 'length',
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
    if (location.hash.search('/commodity') > 0) {
      jumpEdit('/commodity', selectedRows);
      location.reload();
      return;
    }
    jumpEdit('/commodity', selectedRows);
  };
  const isAdmin = canAdmin ? {} : { 'creator:id': currentUser?.id };
  return (
    <>
      <ListSelectModal<TProduct>
        isPad={true}
        renderName={'商品条码记录'}
        title={'商品条码记录'}
        recordItem={1}
        onChange={onsubmit}
        url={PRODUCT_FOOTPRINT}
        footer={false}
        filterValue={{ type: '商品',...isAdmin }}
        metas={{
          avatar: {
            dataIndex: 'image',
            render(_: any, { product }: any) {
              return (
                <WImage
                  type="components"
                  width={80}
                  height={80}
                  src={product?.commodityAttach?.[0]?.url}
                />
              );
            },
          },
          content: columns,
        }}
      />
    </>
  );
};

export default CommoditYSelectModal;
