/**
 * @Author: QIANMINGLIANG
 * @Date: 2022-12-21 16:23:41
 * @Description: 请填写简介
 * @memo: 
 */

import { CurrentUser } from "./app";

/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: CurrentUser } | undefined) {
    const { currentUser } = initialState ?? {};
    const canAdmin = !!initialState?.currentUser?.roles?.includes('ADMIN');
    return {
        currentUser: currentUser,
        canAdmin: canAdmin,
        notAdmin: !canAdmin,
    };
}
