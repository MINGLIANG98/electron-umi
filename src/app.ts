/**
 * @todo 这个文件需要重新处理，先放着，后续build 后的远端地址怎么搞？？？
 */
import { errorConfig } from './requestErrorConfig';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { queryCurrent } from './services/user';

export type CurrentUser = {
  id?: number; //personId
  avatar?: string;
  createTime?: string;
  email?: string;
  groupId?: string;
  groupName?: string;
  group?: string;
  name?: string;
  roleId?: string;
  roleName?: string;
  signature?: string;
  telephone?: string;
  title?: string;
  userid?: number; //账号id
  unreadCount?: number;
  userName?: string;
  groups?: string[];
  roles?: string[];
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
  permission?: permissionObject[];
  gender?: string;
  accountName?: string;
  //  rolePagePermissionMap?: { mes: RolePagePermissions };
  rolesDetail?: { name: string; roleType: string; haveAllPermissions: boolean }[];
};
export type permissionObject = {
  number: string;
  levelChilds: permissionObject[];
  name: string;
};
/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...errorConfig,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const res = await queryCurrent();
      // if (res.code === 200) {
      //   return res.result;
      // }
      return res 
    } catch (error) {
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  const currentUser = await fetchUserInfo();
  console.log({currentUser});
  
  return {
    // fetchUserInfo,
    currentUser,
    // settings: defaultSettings,
  };
}
