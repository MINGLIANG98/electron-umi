import moment from 'moment';
import { getDvaApp } from 'umi';
/**
 * 打印协议栈
 */
export function printCallStack() {
  var i = 0;
  var fun = arguments.callee;
  do {
    fun = fun.arguments.callee.caller;
    console.log(++i + ': ' + fun);
  } while (fun);
}



/**
 * 获取相对BODY 位置
 * @param {*} el
 * @returns
 */

export function getOffsetByBody(el: { tagName: string; offsetTop: number; offsetLeft: number; offsetParent: any; }) {
  let offsetTop = 0;
  let offsetLeft = 0;

  while (el && el.tagName !== 'body') {
    offsetTop += el.offsetTop;
    offsetLeft += el.offsetLeft;
    el = el.offsetParent;
  }
  return { top: offsetTop, left: offsetLeft };
}

/**
 * 获取URL参数
 * @param {*} name
 * @returns
 */
export function getUrlParmas(name: string) {
  let query = window.location.search;

  let searchParams = new URLSearchParams(query);

  return searchParams.get(name);
}

/**
 * 移除对象中空属性
 * @param {*} obj
 */
export const removeEmpty = (obj: { [x: string]: any; }) => {
  if (!obj) return;
  Object.keys(obj).forEach((key) => obj[key] == null && delete obj[key]);
};





/**
 * 按照属性排序
 * @param {any} property
 */
export function compare(property: string | number) {
  return function (a: { [x: string]: any; }, b: { [x: string]: any; }) {
    let value1 = a[property];
    let value2 = b[property];
    return value1 - value2;
  };
}

/**
 * @description: 判断字符串是否为空
 * @param {string} str
 * @return {*}
 */
export const isEmpty = (str: string | null) => {
  if (str == 'undefined' || str == null || str == '') {
    return true;
  } else {
    return false;
  }
};

/**
 * 获得六位随机数
 * @returns
 */
export const getRandomSn = () => {
  let tm = new Date().valueOf();
  return tm % 100000; //取最后六位
};



export function list2tree(data: any[], isSerialNumber: any, isStringValue: any) {
  let tdata: never[] = [];
  let ltr: never[] = []; //已增加的节点

  data.forEach((item: any) => {
    addTreeNodeData(item, tdata, ltr, data, isSerialNumber, isStringValue);
  });
  return tdata;
}

function addTreeNodeData(item: { name: undefined; id: undefined; serialNumber: string; fullName: any; }, tdata: any[], ltr: any[], data: any[], isSerialNumber: any, isStringValue: any) {
  // console.log(item);
  //先判断属性是不是在
  if (item.name === undefined || item.id === undefined) {
    console.error('属性不存在');
    return;
  }
  //如果已经加入过的节点，直接返回
  let ff = ltr.find((l: { serialNumber: any; }) => l.serialNumber === item.serialNumber);
  if (ff) {
    //已经加过
    return;
  }

  //准备加入的节点
  let res = {
    key: isSerialNumber ? item.serialNumber : isStringValue ? `${item.id}` : item.id,
    value: isSerialNumber ? item.serialNumber : isStringValue ? `${item.id}` : item.id,
    title: item.name,
    name: item.fullName ?? item.name, // 对于新建用户组织里，name用作label回显，值首选fullName（李）
    serialNumber: item.serialNumber,
    // data: item,
  };

  if (!item.serialNumber) {
    console.error('节点没有sn', item);
    return;
  }

  let levelSn = item.serialNumber.split('-');
  //如果父节点为空，则创建一级节点

  if (levelSn.length === 1) {
    //如果长度为1 为根节点
    tdata.push(res);
    ltr.push({ serialNumber: res.serialNumber, node: res });

    // console.log('添加一级节点' + item.name);
    return;
  } else {
    let index = item.serialNumber.lastIndexOf('-');
    let fatherSn = item.serialNumber.substring(0, index);

    // console.log(levelSn, fatherSn)
    //加入下级节点，先找父节点
    do {
      // console.log(ltr)
      let findItem = ltr.find((element: { serialNumber: any; }) => element.serialNumber === fatherSn);
      if (!findItem) {
        //没有父节点递归增加父节点,在业务节点寻找
        let findFatherNode = data.find((el: { serialNumber: any; }) => el.serialNumber === fatherSn);
        if (!findFatherNode) {
          console.error('找不到节点，系统错误' + fatherSn);
          return;
        } else {
          // console.log('找到父节点递归' + fatherSn);
          addTreeNodeData(findFatherNode, tdata, ltr, data, isSerialNumber, isStringValue);
        }
      } else {
        //如果有节点，直接加在里面
        // console.log('找到父节点,添加子节点', findItem.node.name, res);
        let l = findItem.serialNumber.split('-').length; //根据sn 算出层级，使用不同图标

        if (findItem.node.children === undefined) {
          findItem.node.children = [res];
        } else {
          findItem.node.children?.push(res);
        }
        ltr.push({ serialNumber: res.serialNumber, node: res });
        //递归完成后，唯一出口
        return;
      }
    } while (true);
  }
}

/**
 * 获取用户详细信息
 * @returns
 */
export const getCurrentUserInfo = () => {
  let currentUserInfo = undefined;
  try {
    // 从reduce中获取用户信息而不是从localStorage中获取
    if (getDvaApp()) {
      let data = getDvaApp()._store.getState();
      if (!data) {
        console.error('获取当前用户失败----------currentUserInfo');
        return null;
      }
      // @@@
      currentUserInfo = data.user.currentUserInfo;
      if (!currentUserInfo) {
        return null;
      }
    }
    // let str = localStorage.getItem('CURRENTUSERINFO');
    // if(!str){
    //     console.error("获取当前用户失败");
    //     return null;
    // }
    // currentUser =  JSON.parse(str);
    // if (!currentUser) {
    //   return null;
    // }
  } catch (error) {
    console.error('获取当前用户失败----------currentUserInfo' + error);
    return null;
  }
  return currentUserInfo;
};
