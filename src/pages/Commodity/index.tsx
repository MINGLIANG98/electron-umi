/**
 * @Author QIANMINGLIANG
 * @Date 2022-12-05 09:22:19
 * @Description 请填写简介
 * @memo
 */
/**
 * @Author QIANMINGLIANG
 * @Date 2022-11-07 14:31:19
 * @Description 请填写简介
 * @memo
 */
import { message, Tabs } from "antd";
import { PRODUCT_FOOTPRINT } from "@/services/config";
import { useEffect, useState } from "react";
import Edit from "./components/Edit";
import Print from "./components/Print";
import styles from "./index.less";
import {
  queryRecordById,
  updateRecordById,
  addRecord,
} from "@/common/common_api";
import { searchQuery } from "@/components/Tools";
import { isNil, omitBy } from "lodash";
import { useModel } from "umi";
export type ProductRecord = {
  id: number;
  footprintCode: string;
  material: any[]; //使用物料
  product: any; //产品
  productCode: string;
  productSpec: string;
  produceNumber: number;
  batchCode: string;
  status: "未使用" | "已使用" | "部分使用";
  relationCode: string; //关联足迹编码
  printNumber: number;
  attach: any;
  printBatchCode: string[];
  useBatchCode: string[];
};
const Add = () => {
  const [activeKey, setactiveKey] = useState<string>("edit");
  const [record, setrecord] = useState<ProductRecord>();
  const URL_ID=searchQuery(location.href, 'id') // 获取修改时url带来的id
  const { initialState } = useModel('@@initialState');
  useEffect(() => {
    if (!!URL_ID) {
      queryRecordById(
        PRODUCT_FOOTPRINT,
        // @ts-ignore
        { id__eq: URL_ID },
        (data: any) => {
          console.log("=====详情", data);
          if (!data) {
            message.error("查询失败");
            return;
          }
          setactiveKey('print');
          setrecord(data);
        },
        (msg: string) => message.error(msg)
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
        PRODUCT_FOOTPRINT,
        {
          creator: omitBy(initialState?.currentUser, isNil),
          type: "商品",
          ...params,
        },
        (res) => {
          resolve(res);
        },
        () => {
          message.error("修改失败");
          reject();
        }
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
        PRODUCT_FOOTPRINT,
        {
          creator: omitBy(initialState?.currentUser, isNil),
          type: "商品",
          ...params,
        },
        (res) => {
          resolve(res);
        },
        () => {
          message.error("新建失败");
          reject();
        }
      );
    });
  };
  // const onFinish = async (formData: ProductRecord) => {
  //     // 修改
  //     if (URL_ID) {
  //         dispatchModify({
  //             ...formData,
  //             id: URL_ID,
  //         });
  //         return;
  //     }
  //     // 新建
  //     dispatchCreate(formData);
  // };
  const onEditChange = (data: ProductRecord) => {
    const { product, ...rest } = data;
    // 修改-- 有id或者有数据都是修改
    const modifyID = URL_ID ?? record?.id;
    if (modifyID) {
      dispatchModify({ product, ...rest, id: modifyID }).then(() => {
        queryRecordById(PRODUCT_FOOTPRINT, { id: modifyID }, (record) => {
          setrecord(record);
          setactiveKey("print");
        });
      });
      return;
    }
    dispatchCreate({ product, ...rest }).then((res) => {
      queryRecordById(PRODUCT_FOOTPRINT, { id: res }, (record) => {
        setrecord(record);
        setactiveKey("print");
      });
    });
  };
  const cloumns = [
    {
      components: <Edit value={record} onChange={onEditChange} />,
      key: "edit",
    },
    {
      components: (
        <Print
          value={record}
          onChange={() => {
            setactiveKey("edit");
          }}
          submit={(data: ProductRecord) => {
            dispatchModify({ ...data }).then(() => {
              location.reload();
            });
          }}
        />
      ),
      key: "print",
    },
  ];
  return (
    <>
      <Tabs
        activeKey={activeKey}
        className={styles.tab}
        tabPosition={"left"}
        items={cloumns.map((item) => ({
          label: "",
          key: item.key,
          children: item.components,
        }))}
      />
    </>
  );
};

export default Add;
