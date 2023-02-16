/**
 * @Author QIANMINGLIANG
 * @Date 2022-11-18 14:10:09
 * @Description 请填写简介
 * @memo
 */

import { queryCondtionType, queryTable } from "@/common/common_api";
import { message } from "antd";
import { ForwardedRef, useRef } from "react";
import { useEffect } from "react";
import { useState, forwardRef, useImperativeHandle } from "react";
import { debounceAsync, searchQuery } from "../Tools";
import scanEvent from "./scanEvent";
import type { Scan_progress_type } from "./ScanProgress";
import ScanProgress from "./ScanProgress";
interface IScanProps {
  requestParamter: (code: string) => {
    url: string;
    params: queryCondtionType;
  };
  //? 与onChange 抛出数据形成闭环 解闭包问题
  value?: any[];
  onChange: (value: any[]) => void;
  onLoading?: (loading: boolean) => void;
}
export type ScanAction = {
  startScan: (data?: any[]) => void;
  closeScan: () => void;
};
const Scan = forwardRef(
  (
    { requestParamter, onChange, onLoading, value }: IScanProps,
    ref: ForwardedRef<ScanAction>
  ) => {
    // 扫码loading
    const [isLoading, setisLoading] = useState(false);
    // 扫码进度条
    const [percent, setpercent] = useState(0);
    const [status, setstatus] = useState<Scan_progress_type["status"]>();
    const valueRef = useRef<any[]>();
    useImperativeHandle(ref, () => ({
      // 开始扫码
      startScan: () => {
        open_scan();
      },
      // 停止扫码
      closeScan: () => {
        close_scan();
      },
    }));
    useEffect(() => {
      valueRef.current = value;
      return () => {
        valueRef.current = undefined;
      };
    }, [value]);

    useEffect(() => {
      onLoading?.(isLoading);
    }, [isLoading]);

    const queryEvent = debounceAsync(async ({ code }: { code: string }) => {
      try {
        const { url, params } = requestParamter(code);
        const res = await queryTable(url, params);
        if (res.code === 200) {
          // 防止查寻的单号没有
          // 防止扫码枪单号不全查不到
          if (res.data.length > 0) {
            setpercent(100);
          } else {
            // 没查到
            setstatus("exception");
            message.error("扫描有误");
          }
        } else {
          // 查询失败
          setstatus("exception");
          message.error("扫描有误");
        }
        return res.data;
      } catch (error) {
        setstatus("exception");
        message.error("扫描有误");
        return [];
      }
    }, 500);

    /**
     * @name 扫码事件
     * todo  闭包 函数
     */
    const scanWrapper = async (e: any) => {
      const { code, type } = scanEvent(e);
      if (type === "开始扫码") {
        console.log(code, type);
        setpercent(30);
      }
      if (type === "扫码结束") {
        console.log(code, type);
        const result = (await queryEvent({ code: code })) as any[];
        if (result.length === 0) {
          // message.error("扫描为空");
          return;
        }
        // 根据qrcode匹配 防止扫码字符串不全
        const QRCODE=searchQuery(code!, 'QrCode')??''
        const isUsed = (result[0]?.useBatchCode ?? []).find(
          (item: string) => item.search(QRCODE)>0
        );
        if (isUsed) {
          message.error("该原材料已使用");
          return;
        }
        const record = {
          ...result[0],
          //  扫描的单号保存在查出的结果中 用于后续追溯
          qrCode: code,
        };
        // ??  访问引用缓存数据
        const old = valueRef.current ?? [];
        const find = old.find(({ id }) => id === record.id);
        //同一个原材料重复扫码
        if (find) {
          message.error("请勿扫描同一种原材料");
          return;
        }
        onChange([...old, record]);
      }
    };
    /**
     * @name 开始扫码
     * @description 监听键盘事件和window失焦事件
     */
    //  https://codeantenna.com/a/a00kMpTj9G
    //  https://www.cnblogs.com/Wayou/p/react_event_issue.html
    //React事件只支持事件冒泡。原生事件通过配置第三个参数，true为事件捕获，false为事件冒泡
    // 此处第三个参数Boolean即代表监听事件的阶段；
    // 为true时，在在捕获阶段监听事件，执行逻辑处理；
    // 为false时，在冒泡阶段监听事件，执行逻辑处理。
    function open_scan() {
      window.addEventListener("blur", close_scan, true);
      window.addEventListener("keypress", scanWrapper, true);
      setisLoading(true);
    }
    /**
     * @name 结束扫码
     * @description 移除监听
     */
    function close_scan() {
      window.removeEventListener("blur", close_scan, true);
      window.removeEventListener("keypress", scanWrapper, true);
      setisLoading(false);
    }
    return (
      <>
        {isLoading ? (
          <ScanProgress
            percent={percent}
            onChange={() => {
              setpercent(0);
              setstatus(undefined);
            }}
            status={status}
          />
        ) : null}
      </>
    );
  }
);

export default Scan;
