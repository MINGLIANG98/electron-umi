/*
 * @Author: Guojun
 * @Date: 2021-12-06 11:31:56
 * @LastEditTime: 2022-11-05 11:42:08
 * @LastEditors: 黄代勇 huangdaiyong@wisdomopen.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \grid1\src\common\condition.ts
 */

import { isArray } from "lodash";

export declare type PageInfo = {
	pageSize?: number;
	current?: number;
};

type FeildCondition<T> = {
	action: string,
	field: string,
	param: T
}

export type Conditions<T> = {
	condition: FeildCondition<T>[];
	innerCondition?: 'or';
	outerCondition?: 'and';
}

export declare type IConditionsQuery<T> = {
	conditions: Conditions<T>[];
	current?: number;
	pageSize?: number;
	entity?: T
	orderBy?: { field: string, sortAction: string }; // 排序
	action?: string; // 归并分组排序必填
	orderByList?: { field?: string, sortAction?: string }[];
}
export declare type IConditionsStatistic<T> = {
	whereConditions?: Conditions<T>[];
	action?: string;
	field?: string[];
}

type QueryAction = {
	orderCondition?: any;
	orCondition?: any[];// 外层是or，
	andCondition?: (Record<string, any>)[]; // 外层是and，
	action?: any  //归并分组使用
	orderConditionList?: { [key: string]: 'DESC' | 'ASC' }[];
}


export type StatisticAction = {
	statisticField?: any;
	action?: any;
	condition?: any;
}



/**
 * 创建SQL 原生带action的条件，通过key__action:value的形式,由于key 格式原因，通过actionmap来
 * @param params
 * @returns
 */
const createActionCondition = <T>(key: string, value: any) => {
	const actionMap = { "eq": "=", "neq": "!=", "lt": "<", "le": "<=", "ge": ">=", "gt": ">", "nl": "not like" ,"py":"pinyin_like"};

	//对于每个查询对象遍历，生成查询条件

	let conditions: any[] = [];
	let s = key.split('__');
	if (s.length === 1) {
		console.error("查询条件失败，没有action！");
		return;
	}

	let k = s[0];
	let action = s[1];

	if (action in actionMap) {
		action = actionMap[action];
	}
	//json_contains 需要值为数组
	if (value instanceof Array && action !== 'json_contains'  && action !== 'json_extract') {

		for (let v of value) {
			let condition = { action, field: k, param: v };
			if (action === "between") {
				condition = { action, field: k, param: value };
				//between数组表示直接用
				return [condition];
			} else if (action === "ll") {  //left like
				condition.action = "like";
				condition.param = '%' + value;
			} else if (action === "rl") {
				condition.action = "like";
				condition.param = value + '%';
			}
			conditions.push(condition);
		}

	} else {

		let condition = { action, field: k, param: value };
		if (action === "ll") {  //left like
			condition.action = "like";
			condition.param = '%' + value;
		} else if (action === "rl") {
			condition.action = "like";
			condition.param = value + '%';
		}
		conditions = [condition];
	}


	return conditions;
};


/**
 * 创建默认的条件，默认如果string like，number = ， array in
 * @param params
 * @returns
 */
const createDefaultCondition = (key: string, value: any) => {
	if (value === undefined) {
		return undefined;
	}
	//对于每个查询对象遍历，生成查询条件
	const actionMap = { "Number": "=", "String": "like", "Array": "in" }
	let condition;
	let action;
	let type: string = Object.prototype.toString.call(value); // "[object String]"

	type = type.substring(8, type.length - 1);
	// console.log(type);
	if (type in actionMap) {
		action = actionMap[type];
		if (type === 'String') {
			//字符串需要增加%
			value = '%' + value + '%';
		}
		// 如果是in 但是长度为空，不放在条件里面，后台处理不了
		if (type === 'Array' && value.length === 0) {
			return undefined;
		}
		condition = { action, field: key, param: value };
	} else {

		console.error("暂时不支持这种类型" + type);
		condition = undefined;
	}
	return [condition];
};


/**
 * 查询，
 * @param params
 * @param isSql
 * @returns
 */
const createConditions = <T>(params: T & PageInfo): any[] => {
	//  console.log(params);

	let conditions: any[] = [];
	//对于每个查询对象遍历，生成查询条件
	for (let key in params) {
		let condition;
		//如果定义了动作，以定义的为准，否则按照默认的来
		if (key.includes("__")) {
			//ACTION
			condition = createActionCondition(key, params[key]);
		} else {
			condition = createDefaultCondition(key, params[key]);
		}


		if (condition) conditions = conditions.concat(condition);
	};


	return conditions;
};

/**
 * 转换排序的条件
 * @param list
 * @returns
 */
const convertOrderList = (list: { [key: string]: 'DESC' | 'ASC' }[]) => {
	let outList: { field?: string, sortAction?: string }[] = [];

	for (let item of list) {
		let outItem: { field?: string, sortAction?: 'DESC' | 'ASC' } = {};
		const field = Object.keys(item)[0]
		outItem.field = field;
		outItem.sortAction = item[field]
		outList.push(outItem)
	}
	return outList;
}


/**
 * AND  如果子条件为or 的为数组，如果子条件为and 则为对象
 * @param params 需要条件的参数，默认VALUE 条件string like，number = ，date =, array in，如果特殊action，采用key__action:value
 */
export function createAndQueryCondition<T>(params?: T & PageInfo & QueryAction, withPage = true): IConditionsQuery<T> {

	if (!params) {
		let cParams: IConditionsQuery<T>;
		cParams = {
			conditions: [],
		};
		return cParams;
	} else {
		let cParams: IConditionsQuery<T>;
		if (params.orderConditionList) {
			cParams = {
				orderByList: convertOrderList(params.orderConditionList),
				conditions: []
			}
		} else if (params.orderCondition) {
			cParams = {
				orderBy: params.orderCondition,
				conditions: [],
			};
		} else {
			cParams = {
				conditions: [],
			};
		}
		let pageSize = params.pageSize;
		let current = params.current;
		delete params.current;
		delete params.pageSize;
		delete params.orderCondition;
		delete params.action;
		delete params.orderConditionList;

		if (!params.andCondition) {
			console.error("系统错误");
			return cParams;
        }
        // console.log('andCondition',params.andCondition)
		for (let param of params.andCondition) {
			if (param ) {
				if (isArray(param)) {
					// 数组为OR
					let condition: any[] = [];
					for (let subParam of param) {
                        if(!subParam) {
                            continue
                        }
						let cc = createConditions(subParam);
                        condition = condition.concat(cc)
					}
					cParams.conditions!.push({ condition, innerCondition: "or", outerCondition: 'and' });

				} else {
					// 对象为AND
					if( Object.getOwnPropertyNames(param).length !== 0){
						let cc = createConditions(param);
						cParams.conditions!.push({ condition: cc, outerCondition: 'and' });
					}

				}
			}
		}

		if (withPage) {
			cParams['current'] = current ? current : 1;
			cParams['pageSize'] = pageSize ? pageSize : 20;
		}
		// console.log("处理好的andConditon查询条件--->", cParams);
		return cParams;
	}


}

/**
 *
 * @param params 需要条件的参数，默认VALUE 条件string like，number = ，date =, array in，如果特殊action，采用key__action:value
 */
export function createOrQueryCondition<T>(params?: T & PageInfo & QueryAction, withPage = true): IConditionsQuery<T> {
	if (!params) {
		let cParams: IConditionsQuery<T>;
		cParams = {
			conditions: [],
		};
		return cParams;
	} else {
		let cParams: IConditionsQuery<T>;
		if (params.orderConditionList) {
			cParams = {
				orderByList: convertOrderList(params.orderConditionList),
				conditions: []
			}
		} else if (params.orderCondition) {
			cParams = {
				orderBy: params.orderCondition,
				conditions: [],
			};
		} else {
			cParams = {
				conditions: [],
			};
		}
		let pageSize = params.pageSize;
		let current = params.current;
		delete params.current;
		delete params.pageSize;
		delete params.orderCondition;
		delete params.action;
		delete params.orderConditionList;

		if (!params.orCondition) {
			console.error("系统错误");
			return cParams;
		}

		for (let param of params.orCondition) {
			if (Object.getOwnPropertyNames(param).length !== 0) {
				//Object.getOwnPropertyNames遍历可枚举属性和不可枚举属性
				let cc = createConditions(param);
				cParams.conditions!.push({ condition: cc });
			}

		}

		if (withPage) {
			cParams['current'] = current ? current : 1;
			cParams['pageSize'] = pageSize ? pageSize : 20;
		}

		return cParams;
	}


}

/**
 *
 * @param params 需要条件的参数，默认VALUE 条件string like，number = ，date =, array in，如果特殊action，采用key__action:value
 */
export function createQueryCondition<T>(params?: T & PageInfo & QueryAction, withPage = true): IConditionsQuery<T> {
	if (!params) {
		let cParams: IConditionsQuery<T>;
		cParams = {
			conditions: [],
		};
		return cParams;
	} else {
		let cParams: IConditionsQuery<T>;
		if (params.orderConditionList) {
			cParams = {
				orderByList: convertOrderList(params.orderConditionList),
				conditions: []
			}
		} else if (params.orderCondition) {
			cParams = {
				orderBy: params.orderCondition,
				conditions: [],
			};
		} else {
			cParams = {
				conditions: [],
			};
		}
		let pageSize = params.pageSize;
		let current = params.current;
		delete params.current;
		delete params.pageSize;
		delete params.orderCondition;
		delete params.action;
		delete params.orderConditionList;

		if (Object.getOwnPropertyNames(params).length !== 0) {
			//Object.getOwnPropertyNames遍历可枚举属性和不可枚举属性
			let cc = createConditions(params);
			cParams.conditions!.push({ condition: cc });
		}

		if (withPage) {
			cParams['current'] = current ? current : 1;
			cParams['pageSize'] = pageSize ? pageSize : 20;
		}

		return cParams;
	}


}



/**
 *
 * @param params
 * 需要条件的参数 statisticFeild :string[]
 *               condtion: any   统计条件
 */
export function createStatisticCondition<T>(params?: T & StatisticAction): IConditionsStatistic<T> | undefined {
	if (!params || !params.statisticField) {
		console.error("统计条件为空");
		return undefined;
	}
	let statCondition: IConditionsStatistic<T> = {
		action: params.action,
		field: params.statisticField,
	}

	if (Object.getOwnPropertyNames(params.condition).length !== 0) {
		//Object.getOwnPropertyNames遍历可枚举属性和不可枚举属性
		let cc = createConditions(params.condition);
		//@ts-ignore
		statCondition.whereConditions = [{ condition: cc }];
	}

	return statCondition;



}
