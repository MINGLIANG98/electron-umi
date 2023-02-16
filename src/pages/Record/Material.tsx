import { RAW_MATERIAL_FOOTPRINT } from '@/services/config';
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

const MaterialRecord: React.FC<any> = () => {
  const { canAdmin, currentUser } = useAccess();
  //   const size = useClientSize();
  const columns = [
    {
      title: '原材料名称',
      dataIndex: 'material:name',
      render(entity: any) {
        return entity?.material?.name;
      },
      ellipsis: true,
    },
    {
      title: '原材料编号',
      dataIndex: 'materialCode',
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
    console.log(selectedRows);

    if (location.hash.search('/material') > 0) {
      jumpEdit('/material', selectedRows);
      location.reload();
      return;
    }
    jumpEdit('/material', selectedRows);
  };

  return (
    <>
      <ListSelectModal<TProduct>
        ButtonKeyName="name"
        isPad={true}
        renderName={'原材料条码记录'}
        title={'原材料条码记录'}
        recordItem={1}
        onChange={onsubmit}
        url={RAW_MATERIAL_FOOTPRINT}
        footer={false}
        // filterValue={{ 'creator:id': initialState?.currentUser?.id }}
        filterValue={canAdmin ? undefined : { 'creator:id': currentUser?.id }}
        metas={{
          avatar: {
            dataIndex: 'image',
            render(_: any, { material }: any) {
              return (
                <WImage type="components" width={80} height={80} src={material?.image?.[0]?.url} />
              );
            },
          },
          content: columns,
        }}
      />
    </>
  );
};

export default MaterialRecord;
