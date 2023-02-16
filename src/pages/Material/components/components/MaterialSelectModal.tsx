/**
 * @Author QIANMINGLIANG
 * @Date 2022-11-22 14:50:14
 * @Description 请填写简介
 * @memo
 */
import ListSelectModal from '@/components/ListTable/Components/ListSelectModal';
import { RAW_MATERIAL_CONTROL } from '@/services/config';
import WImage from '@/components/Image';
import { Tag } from 'antd';
import { useModel } from 'umi';
export type RawMaterialType = {
  id: number;
  code: string; // 编号
  name: string; // 名称
  supplier: {
    id: number;
    name: string;
    // 供应商
    // ...
  }[];
  unit: string; // 单位
  image: any[]; // 图片
  intorduce: string;
  materialSpec: string;
  //
  category?: {
    categoryId: string;
    categoryName: string;
    serialNumber: string;
  };
  categoryId: string;
  categoryName: string;
  serialNumber: string;
};
interface ImaterialSelectModal {
  model?: 'mutplie' | 'single';
  onChange?: (value?: any) => void;
  value?: any;
}
const MaterialSelectModal: React.FC<ImaterialSelectModal> = (props) => {
  const { onChange, value, model = 'single' } = props;
  const { initialState } = useModel('@@initialState');
  const columns = [
    {
      title: '原材料编号',
      dataIndex: 'code',
    },
    {
      title: '物料规格',
      dataIndex: 'materialSpec',
    },
    {
      title: '供应商名称',
      dataIndex: 'name',
    },
    {
      title: '供应商',
      dataIndex: 'supplier',
      render: ({ supplier }: any) => {
        return (supplier ?? []).map((item: any) => <Tag key={item.id}>{item.name}</Tag>);
      },
    },
  ];
  const onsubmit = (selectedRows?: RawMaterialType[] | RawMaterialType) => {
    if (!selectedRows) {
      onChange?.(undefined);
      return;
    }
    if (model === 'mutplie') {
      const newList = ((selectedRows as RawMaterialType[]) ?? []).map(
        ({ serialNumber, name, code, materialSpec, image, unit, id }) => ({
          serialNumber,
          name,
          materialCode: code,
          materialSpec,
          image,
          unit,
          id,
        }),
      );
      onChange?.(newList);
    } else {
      const { serialNumber, name, materialSpec, image, unit, id, code } =
        selectedRows as RawMaterialType;
      onChange?.({
        ...{ serialNumber, name, materialSpec, image, unit, id },
        materialCode: code,
      });
    }
  };

  return (
    <>
      <ListSelectModal<RawMaterialType>
        model={model}
        value={value}
        ButtonKeyName="name"
        isPad={true}
        title={'原材料选择'}
        recordItem={2}
        onChange={onsubmit}
        filterValue={{ 'creator:id': initialState?.currentUser?.id }}
        url={RAW_MATERIAL_CONTROL}
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

export default MaterialSelectModal;
