/**
 * @Author QIANMINGLIANG
 * @Date 2022-12-06 17:18:54
 * @Description 请填写简介
 * @memo
 */
import ListSelectModal from '@/components/ListTable/Components/ListSelectModal';
import { Tag } from 'antd';
import { useModel } from 'umi';
const CommoditySelectModal: React.FC<any> = (props) => {
  const { onChange, value } = props;
  const { initialState } = useModel('@@initialState');
  const columns = [
    {
      title: '商品编号',
      dataIndex: 'commodityCode',
      ellipsis: true,
      width: 120,
    },
    {
      title: '商品名称',
      dataIndex: 'commodityName',
      ellipsis: true,
      width: 120,
    },
    {
      title: '商品品牌',
      dataIndex: 'commodityBrand:brandName',
      ellipsis: true,
      width: 120,
      render: (record: any) => {
        if (!record) {
          return;
        }
        return record.commodityBrand?.brandName;
      },
    },
  ];
  const onsubmitCommdity = (selectedRows: any) => {
    onChange(selectedRows);
  };
  return (
    <>
      <ListSelectModal
        ButtonKeyName="commodityName"
        isPad={true}
        title={'商品选择'}
        value={value}
        onChange={onsubmitCommdity}
        url={'/carbonFootprint/commodity/'}
        filterValue={{ 'creator:id': initialState?.currentUser?.id }}
        metas={{
          title: {
            dataIndex: 'commoditySlogan',
            title: '品名',
          },
          avatar: {
            dataIndex: 'image',
            render(_: any, { commodityAttach }: any) {
              if (!commodityAttach) {
                return;
              }
              return <img src={commodityAttach[0]?.url} alt="" width={80} height={80} />;
            },
          },
          content: columns,
          description: {
            render: (_: any, { commodityLabel }: any) => (
              <>
                {(commodityLabel ?? []).map((item: any) => (
                  <Tag key={item.label}>{item.label}</Tag>
                ))}
              </>
            ),
          },
        }}
      />
    </>
  );
};

export default CommoditySelectModal;
