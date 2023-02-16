/**
 * @Author QIANMINGLIANG
 * @Date 2022-11-22 14:50:14
 * @Description 请填写简介
 * @memo
 */
import ListSelectModal from '@/components/ListTable/Components/ListSelectModal';
import { PRODUCT_CONTROL } from '@/services/config';
import WImage from '@/components/Image';
import { useModel } from 'umi';
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

const ProductSelectModal: React.FC<any> = (props) => {
  const { onChange, value } = props;
  const { initialState } = useModel('@@initialState');
  const columns = [
    {
      title: '产成品名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '产成品编号',
      dataIndex: 'code',
      width: 120,
    },
    {
      title: '分类',
      dataIndex: 'categoryName',
      ellipsis: true,
    },
    {
      title: '规格',
      dataIndex: 'productSpec',
      ellipsis: true,
    },
  ];
  const onsubmit = (selectedRows?: TProduct) => {
    if (!selectedRows) {
      onChange(undefined);
      return;
    }
    const { serialNumber, name, code, productSpec, image, unit, id } = selectedRows!;
    onChange({ serialNumber, name, productCode: code, productSpec, image, unit, id });
  };
  return (
    <>
      <ListSelectModal<TProduct>
        ButtonKeyName={'name'}
        isPad={true}
        title={'产成品选择'}
        recordItem={2}
        value={value}
        filterValue={{ 'creator:id': initialState?.currentUser?.id }}
        onChange={onsubmit}
        url={PRODUCT_CONTROL}
        metas={{
          avatar: {
            dataIndex: 'image',
            render(_: any, { image }: any) {
              return <WImage width={80} height={80} src={image?.[0]?.url} />;
            },
          },
          content: columns,
        }}
      />
    </>
  );
};

export default ProductSelectModal;
