/**
 * @file 所有对外请求的API通用接口
 * @version 1.1.0
 * @author Guojun
 * @todo: 增加了header 以后，type 返回了response和data 类型导致类型判断有误！后续解决，应该是只返回data
 */
 import type {
    StatisticAction
} from './conditions_v2';
import {
    createAndQueryCondition,
    createOrQueryCondition,
    createQueryCondition,
    createStatisticCondition
} from './conditions_v2';
import {request} from 'umi';
import type { ResponseTableType, UserHead, WResponseType } from './type'


export type PageInfo = {
    current: number;
    pageSize: number;
};

export type queryCondtionType = {
    orCondition?: Record<string, any>[];  // 外层是OR，里层是and
    andCondition?: []; // 外出是and，里层是or
    orderCondition?: Record<string, 'DESC' | 'ASC'>;   //兼容老的，已废弃
    orderConditionList?: Record<string, 'DESC' | 'ASC'>[];
} & Partial<PageInfo> & Record<string, any>;



/**
 * 添加记录
 * @param url ：请求URL
 * @param params ：添加实体数据
 * @param successFun 成功回调
 * @param errorFun   错误回调
 * @param user       流程需要携带的用户信息{userId，groupId}
 * @param keyword    是否需要添加create 的字段，默认添加
 * @returns   默认返回成功/失败
 */
export async function addRecord(
    url: string,
    params: any,
    successFun?: ((result: any) => void) | null,
    errorFun?: (msg: string) => void,
    keyword = false,
): Promise<boolean> {
    let u = keyword ? url : url + 'create';
    let res = await request(u, {
        getResponse: false,
        method: 'POST',
        data: params,

    });
    if (!res) {
        return false;
    }
    if (res.code === 200) {
        successFun?.(res.result);
        return true;
    } else {
        errorFun?.(res.message)
        return false;
    }
}

/**
 * 批量添加记录
 * @param url ：请求URL
 * @param params ：添加实体数据
 * @param successFun 成功回调
 * @param errorFun   错误回调
 * @param user       流程需要携带的用户信息{userId，groupId}
 * @param keyword    是否需要添加create 的字段，默认添加
 * @returns   默认返回成功/失败
 */
export async function batchAddRecord(
    url: string,
    params: any,
    successFun?: ((result: any) => void) | null,
    errorFun?: (msg: string) => void,
    user?: UserHead,
    keyword = false,
): Promise<boolean> {
    let u = keyword ? url : url + 'batchCreate';
    let res = await request(u, {
        method: 'POST',
        data: params,
    });
    if (!res) {
        return false;
    }
    if (res.code === 200) {
        if (successFun) {
            successFun(res.result);
        }
        return true;
    } else {
        if (errorFun) {
            errorFun(res.message);
        }
        return false;
    }
}

/**
 * 批量添加记录
 * @param url ：请求URL
 * @param params ：删除条件
 * @param successFun 成功回调
 * @param errorFun   错误回调
 * @returns
 */
export async function removeRecord(
    url: any,
    params: any,
    successFun?: ((result: any) => void) | null,
    errorFun?: (msg: string) => void,
) {
    let cc = createQueryCondition(params);
    request(url + 'remove', {
        method: 'DELETE',
        data: cc,
    })
        .then((res) => {
            if (res.code === 200) {
                if (successFun) {
                    successFun(res.result);
                }
            } else {
                if (errorFun) {
                    errorFun(res.message);
                }
            }
        })
        .catch((err) => {
            console.error(err);
        });
}

/**
 *
 * @param url url地址，注意不用带update
 * @param params //查询条件参数
 * @param entity  //更新内容
 * @param successFun //更新成功回调
 * @param errorFun  //更新失败回调
 * @param user  //当前用户，没有流程可不用填
 * @deprecated  //由于这个函数经常更新多个，因此需要后台拆分接口，不建议使用
 */
export async function updateRecord(
    url: any,
    params: any,
    entity: any,
    successFun: ((result: any) => void) | null,
    errorFun: (msg: string) => void,
) {
    let cc = createQueryCondition(params);
    delete cc.current;
    delete cc.pageSize;
    request(url + 'update', {
        method: 'PUT',
        data: { ...cc, entity },
    })
        .then((res) => {
            if (res.code === 200) {
                if (successFun) {
                    successFun(res.result);
                }
            } else {
                errorFun(res.message);
            }
        })
        .catch((err) => {
            console.error(err);
        });
}


/**
 * 根据ID 来更新实体
 * @param url url地址，注意不用带update
 * @param entity  //更新内容,必须携带id，如果不带后端会返回失败
 * @param successFun //更新成功回调
 * @param errorFun  //更新失败回调
 */
export async function updateRecordById(
    url: string,
    entity: { id: string | number } & any,
    successFun?: ((result: any) => void) | null,
    errorFun?: (msg: string) => void,
) {
    request(url + 'updateById', {
        method: 'PUT',
        data: entity,
    })
        .then((res) => {
            if (res.code === 200) {
                successFun?.(res.result)
            } else {
                errorFun?.(res.message);
            }
        })
        .catch((err) => {
            console.error(err);
        });
}

/**
 * 更新流程V2 ---new
 * @param url url地址，注意不用带update
 * @param entity  //更新内容,必须携带id，如果不带后端会返回失败
 * @param successFun //更新成功回调
 * @param errorFun  //更新失败回调
 */
export async function updateWorkFlowTask(
    url: string,
    id: number,
    action?: string,  //流程所需要的action,为空不需要带
    comment?: string,
    successFun?: ((result: any) => void) | null,
    errorFun?: (msg: string) => void,
) {
    let data = action ? {
        id,
        workflowVariables: {
            action,
        }
    } : { id }
    if (data.workflowVariables && comment) {
        data.workflowVariables["comment"] = comment;
    }
    request(url + 'updateWorkflow', {
        method: 'POST',
        data: data,
    })
        .then((res) => {
            if (res.code === 200) {
                successFun?.(res.result)
            } else {
                errorFun?.(res.message);
            }
        })
        .catch((err) => {
            console.error(err);
        });
}

/**
 * 更新流程V2
 * @param url url地址，注意不用带update
 * @param entity  //更新内容,必须携带id，如果不带后端会返回失败
 * @param successFun //更新成功回调
 * @param errorFun  //更新失败回调
 */
export async function commitWorkFlowTask(
    url: string,
    id: number,
    action?: string,  //流程所需要的action,为空不需要带
    comment?: string,
    successFun?: ((result: any) => void) | null,
    errorFun?: (msg: string) => void,
) {
    let data = action ? {
        id,
        workflowVariables: {
            action,
        }
    } : { id }
    if (data.workflowVariables && comment) {
        data.workflowVariables["comment"] = comment;
    }
    request(url + 'updateWorkFlow', {
        method: 'POST',
        data: data,
    })
        .then((res) => {
            if (res.code === 200) {
                successFun?.(res.result)
            } else {
                errorFun?.(res.message);
            }
        })
        .catch((err) => {
            console.error(err);
        });
}


/**
 * 更新流程
 * @param url url地址，注意不用带update
 * @param entity  //更新内容,必须携带id，如果不带后端会返回失败
 * @param successFun //更新成功回调
 * @param errorFun  //更新失败回调
 *  @deprecated  //V1 版本，兼容旧，新版本不适用
 */
export async function updateWorkFlow(
    url: string,
    entity: { id: string | number },
    successFun?: ((result: any) => void) | null,
    errorFun?: (msg: string) => void,
) {
    request(url + 'updateWorkFlow', {
        method: 'POST',
        data: entity,
    })
        .then((res) => {
            if (res.code === 200) {
                successFun?.(res.result)
            } else {
                errorFun?.(res.message);
            }
        })
        .catch((err) => {
            console.error(err);
        });
}


/**
 * 根据条件来跟新，条件不允许为空，只能更新一条记录，如果查询有多条则返回失败
 * @param url url地址，注意不用带update
 * @param params //查询条件参数
 * @param entity  //更新内容
 * @param successFun //更新成功回调
 * @param errorFun  //更新失败回调
 * @param user  //当前用户，没有流程可不用填
 */
export async function updateRecordByCondition(
    url: any,
    params: any,
    entity: any,
    successFun: ((result: any) => void) | null,
    errorFun: (msg: string) => void,
    user?: UserHead,
) {
    if (params === undefined || JSON.stringify(params) === "{}") {
        console.error("查询条件为空");
        return;
    }
    let cc = createQueryCondition(params);
    delete cc.current;
    delete cc.pageSize;
    request(url + 'updateByCondition', {
        method: 'PUT',
        data: { ...cc, entity },
    })
        .then((res) => {
            if (res.code === 200) {
                if (successFun) {
                    successFun(res.result);
                }
            } else {
                errorFun(res.message);
            }
        })
        .catch((err) => {
            console.error(err);
        });
}

/**
 * 根据条件来更新，条件不允许为空，可以更新多条记录，@谨慎使用
 * @param url url地址，注意不用带update
 * @param params //查询条件参数
 * @param entity  //更新内容
 * @param successFun //更新成功回调
 * @param errorFun  //更新失败回调
 * @param user  //当前用户，没有流程可不用填
 */
export async function updateRecordMulti(
    url: any,
    params: any,
    entity: any,
    successFun: ((result: any) => void) | null,
    errorFun: (msg: string) => void,
    user?: UserHead,
) {
    if (params === undefined || JSON.stringify(params) === "{}") {
        console.error("查询条件为空");
        return;
    }
    let cc = createQueryCondition(params);
    delete cc.current;
    delete cc.pageSize;
    request(url + 'updateMulti', {
        method: 'PUT',
        data: { ...cc, entity },
    })
        .then((res) => {
            if (res.code === 200) {
                if (successFun) {
                    successFun(res.result);
                }
            } else {
                errorFun(res.message);
            }
        })
        .catch((err) => {
            console.error(err);
        });
}

/**
 * 统计记录
 * @param url
 * @param params  统计条件 @todo 原先的统计动作需要继承。。。
 * @param successFun
 * @param errorFun
 * @returns
 */
export async function statisticRecord(
    url: string,
    params: any,
    successFun?: ((result: any) => void) | null,
    errorFun?: (msg: string) => void,
): Promise<boolean> {
    let res = await request(url, {
        method: 'POST',
        data: params,
    });
    if (!res) {
        return false;
    }
    if (res.code === 200) {
        if (successFun) {
            successFun(res.result.result);
        }
        return true;
    } else {
        if (errorFun) {
            errorFun(res.message);
        }
        return false;
    }
}
/**
 * 处理查询条件
 * @param params
 * @returns
 */
const processCondtions = (params: queryCondtionType) => {
    let page = { pageSize: 20, current: 1 }
    let condtions = undefined;
    // 先处理and 优先，and 和 OR不能同时存在
    // console.log(params.andCondition)
    if (params.andCondition) {
        //and 的CONDITION
        condtions = createAndQueryCondition({ ...page, ...params });

    } else if (params.orCondition) {
        //or 的CONDITION
        condtions = createOrQueryCondition({ ...page, ...params });
    } else {
        //普通CONDITION
        condtions = createQueryCondition({ ...page, ...params });
    }
    return condtions;
}
/**
 * 查询单表表单
 * @param url
 * @param params
 * @param successFun
 * @param errorFun
 * @returns
 */
export async function queryRecord<T = any>(
    url: string,
    params: queryCondtionType,
    successFun?: ((result: any) => void) | null,
    errorFun?: (msg: string) => void,
    keyword = false,
): Promise<WResponseType<T>> {

    let condition = processCondtions(params);

    let msg = request(!keyword ? url + 'query' : url, {
        method: 'POST',
        data: condition,
    })
        .then((res) => {
            if (res.code === 200) {
                if (successFun) {
                    successFun(res.result.records);
                }
            } else {
                if (errorFun) {
                    errorFun(res.message);
                }
            }
            return res;
        })
        .catch((err) => {
            console.error(err);
            return err;
        });
    return Promise.resolve(msg);
}

// /**
//  * GET查询
//  * @param url
//  * @param queryObj
//  * @param params
//  * @param successFun
//  * @param errorFun
//  * @returns
//  */
// export async function queryRecordGET(
//   url: string,
//   queryObj:string,
//   params: {},
//   successFun?: ((result: any) => void) | null,
//   errorFun?: (msg: string) => void,
// ): Promise<any> {
//     let s = '';
// Object.entries(params).forEach(([key,value],index) => {
//     if(index === 0) {
//         s = s + `?${key}=${value}`
//     } else {
//         s = s + `&${key}=${value}`
//     }
// })
//   let msg = request(url + queryObj + s, {
//     method: 'GET',
//   })
//     .then((res) => {
//       if (res.code === 200) {
//         if (successFun) {
//           successFun(res.result);
//         }
//       } else {
//         if (errorFun) {
//           errorFun(res.message);
//         }
//       }
//       return res;
//     })
//     .catch((err) => {
//       console.error(err);
//       return err;
//     });
//   return Promise.resolve(msg);
// }

/**
 * 查询联表视图表单
 * @param url
 * @param params
 * @param viewRelation
 * @param successFun
 * @param errorFun
 * @returns
 */
export async function queryViewRecord(
    url: string,
    params: queryCondtionType,
    viewRelation: any,
    successFun?: ((result: any) => void) | null,
    errorFun?: (msg: string) => void,
): Promise<ResponseType> {
    // if (params.orderCondition) {
    // 	params.action = "groupFilter"
    // }
    if (params.pageSize === undefined) {
        params.pageSize = 20;
        params.current = 1;
    }
    let condition;
    if (params.orCondition) {
        //or 的CONDITION
        condition = createOrQueryCondition(params);
    } else {
        //普通CONDITION
        condition = createQueryCondition(params);
    }
    // let condition = createQueryCondition(params);
    // console.log(condition);
    if (viewRelation) {
        condition = { ...condition, viewRelation };
    }

    let msg = request(url, {
        method: 'POST',
        data: condition,
    })
        .then((res) => {
            if (res.code === 200) {
                if (successFun) {
                    successFun(res.result.records);
                }
            } else {
                if (errorFun) {
                    errorFun(res.message);
                }
            }
            return res;
        })
        .catch((err) => {
            console.error(err);
            return err;
        });
    return Promise.resolve(msg);
}




/**
 * 查询记录，返回表格形式,支持新格式
 * @param url
 * @param params
 * @returns
 */
export async function queryTable<T = any>(url: string, params: queryCondtionType, keyword = false): Promise<ResponseTableType<T>> {
    const condition = processCondtions(params);

    const msg = await request(!keyword ? url + 'query' : url, {
        method: 'POST',
        data: condition,
    });
    // console.log(msg);
    if (msg.code === 200) {
        //  console.log(msg.result.records)
        return {
            data: msg.result.records,
            code: msg.code,
            success: msg.success,
            total: msg.result.total,
        };
    } else {
        return {
            data: [],
            code: msg.code,
            success: msg.success,
            total: 0
        };
    }
}

/**
 * 查询联表记录，返回表格形式
 * @param url
 * @param params
 * @param viewRelation
 * @returns
 */
export async function queryViewTable<T = any>(url: string, params: queryCondtionType, viewRelation: any): Promise<ResponseTableType<T>> {
    let condition = processCondtions(params);

    if (viewRelation) {
        // @ts-ignore
        condition = { ...condition, viewRelation }
    }

    // console.log('queryViewTable----conditon',condition)

    //  console.log(condition);
    let msg = await request(url, {
        method: 'POST',
        data: condition
    });
    // console.log(msg);
    if (msg.code === 200) {
        // console.log(msg.result.records)
        return {
            data: msg.result.records,
            code: msg.code,
            success: msg.success,
            total: msg.result.total
        }
    } else {
        return {
            data: [],
            code: msg.code,
            success: msg.success,
            total: 0
        }
    }
}

/**
 *
 * @param url url地址，注意不用带update
 * @param params //查询条件参数
 * @param entity  //更新内容
 * @param successFun //更新成功回调
 * @param errorFun  //更新失败回调
 * @deprecated  //兼容原先小写,后续逐步废弃
 */
export async function queryrecordById(
    url: string,
    params: { id: string | number; pageSize?: number; current?: number },
    successFun?: ((result: any) => void) | null,
    errorFun?: (msg: string) => void,
): Promise<boolean> {

    return queryRecordById(url, params, successFun, errorFun);
}
/**
 *  根据记录id 查询详细信息
 * @param url
 * @param params
 * @param successFun
 * @param errorFun
 * @returns
 */
export async function queryRecordById(
    url: string,
    params: { id: string | number; pageSize?: number; current?: number },
    successFun?: ((result: any) => void) | null,
    errorFun?: (msg: string) => void,
): Promise<WResponseType<any>> {
    // console.log(params);
    let condition = createQueryCondition(params);
    let res = await request(url + 'query', {
        method: 'POST',
        data: condition,
    });

    if (!res) {
        return res;
    }
    if (res.code === 200) {
        if (successFun) {
            if (res.result) {
                if (res.result.records.length >= 1) {
                    successFun(res.result.records[0]);
                } else {
                    successFun(undefined);
                }
            }
        }
        return res;
    } else {
        if (errorFun) {
            errorFun(res.message);
        }
        return res;
    }
}

/**
 * 下载文件
 * @param params 文件下载名称和远端的链接
 * @param errorFun
 */
export function downloadFile(
    url: string,
    params: { id: number; tableName: string; fileName?: string },
    errorFun?: (msg: string) => void,
) {
    request(url, {
        method: 'POST',
        responseType: 'blob', //这个很重要，要求fetch返回blob
        data: params,
    })
        .then((content) => {
            try {
                let a = document.createElement('a'); // 生成一个a元素
                let event = new MouseEvent('click'); // 创建一个单击事件
                a.download = `${params.fileName}.zip`; // 设置图片名称
                let data = new Blob([content]);

                a.href = URL.createObjectURL(data); // 将生成的URL设置为a.href属性
                a.dispatchEvent(event); // 触发a的单击事件
                URL.revokeObjectURL(a.href);
            } catch (e) {
                console.error(e);
            }
        })
        .catch((res) => {
            if (errorFun) {
                errorFun(res.message);
            }
        });
}


// 通过XHR 可实时获取上传进度
export async function uploadFileXhr(
    url: string,
    fileName: string,
    file: any,
    progressFunc?: any,
    successFunc?: any,
    errorFunc?: any,
) {
    let fd = new FormData();
    fd.append('fileName', fileName);
    fd.append('file', file);

    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.status != 200) {
            // 分析响应的 HTTP 状态
            console.log(`Error ${xhr.status}: ${xhr.statusText}`);
            alert(`Error ${xhr.status}: ${xhr.statusText}`); // 例如 404: Not Found
        } else {
            // 显示结果
            // alert(`Done, got ${xhr.response.length} bytes`); // response 是服务器响应
            console.log(`Done, got ${xhr.response.length} bytes`);
            let res = JSON.parse(xhr.response);
            // console.log(res);
            if (res.code === 200) {
                if (successFunc) successFunc(res.result);
            } else {
                if (errorFunc) errorFunc(res.msg);
            }
        }
    };

    xhr.upload.onprogress = function (event) {
        if (event.lengthComputable) {
            if (progressFunc) progressFunc(event.loaded, event.total);
            // console.log(`Received ${event.loaded} of ${event.total} bytes`);
        } else {
            if (progressFunc) progressFunc(event.loaded);
            // console.log(`Received ${event.loaded} bytes`); // 没有 Content-Length
        }
        // if (progressFunc) progressFunc(event.loaded);
    };
    xhr.onerror = function () {
        if (errorFunc) errorFunc();
    };
    xhr.open('POST', url, true);
    xhr.send(fd);
}

// 条件统计 TODO
export async function statisticByCondition(
    url: string,
    params: any, //过滤条件
    filed: string[],
    action?: string,
    successFun?: ((result: any) => void) | null,
    errorFun?: (msg: string) => void,
): Promise<any> {
    let statParams: StatisticAction = {
        statisticField: filed,
        condition: params,
        action: action ?? 'keyedReduce',
    };
    let cc = createStatisticCondition(statParams);
    request(url + 'statistics', {
        method: 'POST',
        data: cc,
    })
        .then((res) => {
            if (res.code === 200) {
                if (successFun) {
                    successFun(res.result.result);
                }
            } else {
                if (errorFun) {
                    errorFun(res.message);
                }
            }
        })
        .catch((err) => {
            console.error(err);
        });
}

/**
 * 查询excel二进制
 * @param url
 * @param params
 * @param viewRelation
 * @param successFun
 * @param errorFun
 * @returns
 */
export async function queryBinaryRecord(url: string, params: queryCondtionType, successFun?: ((result: any) => void) | null, errorFun?: (msg: string) => void,): Promise<any> {
    // if (params.orderCondition) {
    //  params.action = "groupFilter"
    // }
    if (params.pageSize === undefined) {
        params.pageSize = 20;
        params.current = 1;
    }
    let condition;
    if (params.orCondition) {
        //or 的CONDITION
        condition = createOrQueryCondition(params);
    } else {
        //普通CONDITION
        condition = createQueryCondition(params);
    }

    let msg = request(url, {
        method: 'POST',
        data: condition,
        responseType: 'arrayBuffer'
    }).then((res) => {
        if (successFun) {
            successFun(res);
        }

        return res;
    }).catch((err) => {
        console.error(err);
        return err
    });
    return Promise.resolve(msg);

}

/**
* GET查询
* @param url
* @param queryObj
* @param params
* @param successFun
* @param errorFun
* @returns
*/
export async function queryRecordGET(
    url: string,
    queryObj: string,
    params: {},
    successFun?: ((result: any) => void) | null,
    errorFun?: (msg: string) => void,
): Promise<any> {
    let s = '';
    Object.entries(params).forEach(([key, value], index) => {
        if (index === 0) {
            s = s + `?${key}=${value}`
        } else {
            s = s + `&${key}=${value}`
        }
    })
    let msg = request(url + queryObj + s, {
        method: 'GET',
    })
        .then((res) => {
            if (res.code === 200) {
                if (successFun) {
                    successFun(res.result);
                }
            } else {
                if (errorFun) {
                    errorFun(res.message);
                }
            }
            return res;
        })
        .catch((err) => {
            console.error(err);
            return err;
        });
    return Promise.resolve(msg);
}


/**
 * 新建表单上传文件，在返回内容中获取id和fileUrl，用于之后的查询显示和下载
 * @param url 接口地址
 * @param fileName 文件名称
 * @param file 文件
 */
export function uploadFileAsync(
    url: string,
    fileName: string,
    file: any,
) {
    let fd = new FormData();
    fd.append('fileName', fileName);
    fd.append('file', file);
    return request(url, {
        method: 'POST',
        data: fd,
    })
}


/**
 * 上传文件
 * @param params 文件下载名称和远端的链接
 * @param errorFun
 */
export async function uploadFile(
    url: string,
    fileName: string,
    file: any,
    successFun: (url: string) => void,
    errorFun: (msg: string) => void,
) {
    let fd = new FormData();
    fd.append('fileName', fileName);
    fd.append('file', file);
    let msg = request(url, {
        method: 'POST',
        data: fd,
    })
        .then((res) => {
            if (res.code === 200) {
                successFun(res.result.url);
            } else {
                errorFun(res.message);
            }
        })
        .catch((res) => {
            errorFun(res.message);
        });
}


/**
 * 提交普通数据
 * @param url
 * @param params
 * @param successFun
 * @param errorFun
 * @returns
 */
export async function PostData(
    url: string,
    data: any,
    successFun?: ((result: any) => void) | null,
    errorFun?: (msg: string) => void,
): Promise<any> {

    let msg = request(url + 'query', {
        method: 'POST',
        data: data,
    })
        .then((res) => {
            if (res.code === 200) {
                if (successFun) {
                    successFun(res.result.records);
                }
            } else {
                if (errorFun) {
                    errorFun(res.message);
                }
            }
            return res;
        })
        .catch((err) => {
            console.error(err);
            return err;
        });
    return Promise.resolve(msg);
}

/**
 * 提交普通数据
 * @param url
 * @param params
 * @param successFun
 * @param errorFun
 * @returns
 */
export async function requestGetData(
    url: string,
    data: any,
    successFun?: ((result: any) => void) | null,
    errorFun?: (msg: string) => void,
    keyword = false
): Promise<any> {

    let msg = request(keyword ? url : url + 'query', {
        method: 'GET',
        params: data,
    })
        .then((res) => {
            if (res.code === 200) {
                if (successFun) {
                    if ("records " in res.result) {

                        successFun(res.result.records);
                    } else {
                        successFun(res.result);
                    }
                }
            } else {
                if (errorFun) {
                    errorFun(res.message);
                }
            }
            return res;
        })
        .catch((err) => {
            console.error(err);
            return err;
        });
    return Promise.resolve(msg);
}

/**
 * 提交普通数据,通过POST获取数据，参数不用CONDTION
 * @param url
 * @param params
 * @param successFun
 * @param errorFun
 * @returns
 */
export async function requestPostData(
    url: string,
    data: any,
    successFun?: ((result: any) => void) | null,
    errorFun?: (msg: string) => void,
    keyword = false
): Promise<any> {

    let msg = request(keyword ? url : url + 'query', {
        method: 'POST',
        data: data,
    })
        .then((res) => {
            if (res.code === 200) {
                if (successFun) {
                    successFun(res.result);
                }
            } else {
                if (errorFun) {
                    errorFun(res.message);
                }
            }
            return res;
        })
        .catch((err) => {
            console.error(err);
            return err;
        });
    return Promise.resolve(msg);
}

