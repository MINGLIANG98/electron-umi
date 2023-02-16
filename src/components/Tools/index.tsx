import { history } from "umi";
import { useEffect, useState } from "react";

/**
 * @description 高亮url跳转
 * @param {any} record 行数据
 * @param {string} dataIndex  record 显示列dataIndex
 * @param {string} url  跳转url
 */
export const nameLink = (record: any, dataIndex: string, url: string) => {
  if (!record[dataIndex]) {
    return <>暂无单号</>;
  }
  return (
    <a
      onClick={() => {
        history.push({
          pathname: url,
          search: `id=${record?.id}`,
        });
      }}
    >
      {record[dataIndex]}
    </a>
  );
};

/**
 * @description: 跳转编辑页面
 * @param {object} record
 */
export const jumpEdit = (pathname: string, record?: any) => {
  console.log(record);
  
  if (!record) {
    history.push({
      pathname,
    });
    return;
  }
  history.push({
    pathname,
    search: `id=${record?.id}`,
  });
};

export function debounceAsync(
  this: any,
  method: Function | any,
  wait: number,
  immediate?: boolean
) {
  // todo 无法复用   多个异步同时使用 指向同一个timeout引用地址  待解决
  let timeout: NodeJS.Timeout | null, result: any;
  let debounced = (...args: any[]) => {
    // 返回一个Promise，以便可以使用then或者Async/Await语法拿到原函数返回值
    return new Promise((resolve) => {
      // 将method执行时this的指向设为debounce返回的函数被调用时的this指向
      // let context = this;
      if (timeout) {
        clearTimeout(timeout);
      }
      if (immediate) {
        let callNow = !timeout;
        timeout = setTimeout(() => {
          timeout = null;
        }, wait);
        if (callNow) {
          result = method.apply(this, args);
          // 将原函数的返回值传给resolve
          resolve(result);
        }
      } else {
        timeout = setTimeout(() => {
          // args是一个数组，所以使用fn.apply
          // 也可写作method.call(context, ...args)
          result = method.apply(this, args);
          // 将原函数的返回值传给resolve
          resolve(result);
        }, wait);
      }
    });
  };
  return debounced;
}

export const useDetectPrint = (): boolean => {
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const handleMediaQueryEvent = (event: MediaQueryListEvent): void => {
      setIsPrinting(event.matches);
    };

    const mediaQuery = window.matchMedia("print");
    // iOS <=13 has no support forfor addEventListener/removeEventListener on MediaQueryList,
    // but supports addListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleMediaQueryEvent);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleMediaQueryEvent);
    }

    // Trigger on initial render
    setIsPrinting(mediaQuery.matches);

    return (): void => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleMediaQueryEvent);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleMediaQueryEvent);
      }
    };
  });

  return isPrinting;
};

export const searchQuery = (url: string, key: string) => {
  const reg = /\?+/i; // 这里是定义匹配规则,匹配字符串里的1到多个数字
  const Findex = url.search(reg); // 输出 0  这里搜索到的第一项是从位置0开始的
  const query = url.substring(Findex, url.length);
  const searchParams = new URLSearchParams(query);
  return searchParams.get(key);
};


const remote = window.require('electron').remote;

export const useClientSize = (): {
  width: number;
  height: number;
} => {
  const [windowContent, setWindowContent] = useState({
    width: 0,
    height: 0,
  });
  useEffect(() => {
    const size = {
      width: window.innerHeight,
      height: window.innerWidth,
    };
    console.log(window);
    console.log(remote);
    setWindowContent(size);

    const resizeUpdate = (event: any): void => {
        console.log(remote);
    //   setWindowContent({
    //     height: event.target.innerHeight,
    //     width: event.target.innerWidth,
    //   });
    };
    window.addEventListener("resize", resizeUpdate);
    return (): void => {
      // 组件销毁时移除监听事件
      window.removeEventListener("resize", resizeUpdate);
    };
  },[]);
  return windowContent;
};
