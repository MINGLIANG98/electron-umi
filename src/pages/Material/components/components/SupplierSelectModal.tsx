/**
 * @Author QIANMINGLIANG
 * @Date 2022-11-28 16:36:11
 * @Description 请填写简介
 * @memo
 */
import ListSelectModal from '@/components/ListTable/Components/ListSelectModal';
import { SUPPLIER } from '@/services/config';
import { fileType } from '@/components/FileUpload';
import WImage from '@/components/Image';
import { useModel } from 'umi';
export type TSupplier = {
  id: number;
  code: string;
  name: string;
  address: string;
  contractName: string;
  contractPhone: number;
  isAccount: '是' | '否';
  account: string;
  password: string;
  logo: fileType[];
  intorduce: string;
};
const SupplierSelectModal: React.FC<any> = (props) => {
  const { initialState } = useModel('@@initialState');
  const { onChange, value } = props;
  const columns = [
    {
      title: '供应商编号',
      dataIndex: 'code',
      width: 120,
    },
    {
      title: '供应商名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '联系人',
      dataIndex: 'contractName',
    },
    {
      title: '手机号码',
      dataIndex: 'contractPhone',
      width: 120,
    },
  ];
  const onsubmit = (selectedRows?: TSupplier) => {
    if (!selectedRows) {
      onChange(undefined);
      return;
    }
    const { code, logo, id, name, address, intorduce } = selectedRows;
    onChange({ code, logo, id, name, address, intorduce });
  };
  return (
    <>
      <ListSelectModal
        ButtonKeyName="name"
        isPad={true}
        title={'供应商选择'}
        recordItem={2}
        value={value}
        onChange={onsubmit}
        url={SUPPLIER}
        filterValue={{
          parentId: initialState?.currentUser?.id,
      }}
        metas={{
          avatar: {
            dataIndex: 'image',
            render(_: any, { logo }: any) {
              return <WImage width={80} height={80} src={logo?.[0]?.url} alt="暂无图片" />;
            },
          },
          title: {
            dataIndex: 'intorduce',
            title: '介绍信息',
          },
          content: columns,
        }}
      />
    </>
  );
};

export default SupplierSelectModal;
