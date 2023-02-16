import { CurrentUser } from "@/app";

export function queryUser(values) {
  console.log('SSSS --->', values);
}

export function queryUsers() {
  console.log('dddd');
}

const CurrentUserData: Partial<CurrentUser> = {
  "id": 10,
  "name": "染厂",
  "telephone": "19988746512",
  "email": null,
  "createTime": null,
  "updateTime": null,
  "status": null,
  "logicDeleted": null,
  "logicDeleteTime": null,
  "tenantId": 1,
  "avatar": null,
  "nickname": "周老板",
  "isInitialPassword": false,
  "permission": [],
  "groups": null,
  "roles": [
      "worker"
  ],
  "rolePagePermissionVOList": null,
  "rolePagePermissionMap": {}
}
export type permissionObject = {
  number: string;
  levelChilds: permissionObject[];
  name: string;
};

export const queryCurrent = () => {
  return Promise.resolve(CurrentUserData);
};
