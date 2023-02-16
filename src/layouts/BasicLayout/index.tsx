/**
 * 用于内容页面的布局，可以在这儿做权限控制和公共的
 */
import RecordListmodal from '@/pages/Record/Product';
import CommoditYSelectModal from '@/pages/Record/Commodity';
import MaterialRecord from '@/pages/Record/Material';
import type { MenuDataItem } from '@ant-design/pro-components';
import { ProLayout, PageContainer } from '@ant-design/pro-components';
import { ConfigProvider, Space } from 'antd';
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useModel } from 'umi';
export default function BasicLayout() {
  const [pathname, setPathname] = useState('/material');
  const location = useLocation();
  const { initialState } = useModel('@@initialState');

  useEffect(() => {
    if (location) {
      if (location.pathname !== pathname) {
        setPathname(location.pathname);
      }
    }
  }, [location]);

  const renderMenu = (
    menuItemProps: MenuDataItem & { isUrl: boolean; onClick: () => void },
    defaultDom: React.ReactNode,
  ) => {
    console.log({ menuItemProps, defaultDom });
    return null;
  };
  return (
    <>
      <ProLayout
        menu={{
          hideMenuWhenCollapsed: true,
        }}
        title={initialState?.currentUser?.name ?? '碳足迹扫码'}
        logo={false}
        headerTitleRender={false}
        rightContentRender={() => (
          <Space>
            <MaterialRecord />
            <RecordListmodal />
            <CommoditYSelectModal />
          </Space>
        )}
        location={{
          pathname,
        }}
        // onPageChange={(location) => {
        //   console.log(location);
        // }}
        {...{
          fixSiderbar: true,
          layout: 'top',
          splitMenus: true,
        }}
        // route={routers}
        route={{
          path: '/',
          routes: [
            {
              path: '/material',
              name: '原材料',
              component: './Material',
            },
            {
              path: '/product',
              name: '产成品',
              component: './Product',
            },
            {
              path: '/commodity',
              name: '商品',
              component: './Commodity',
            },
          ],
        }}
        menuItemRender={(item, dom) => (
          <Link
            to={item.path || '/welcome'}
            onClick={() => {
              setPathname(item.path || '/welcome');
            }}
          >
            {dom}
          </Link>
        )}
        subMenuItemRender={(item, dom) => {
          return null;
        }}
        postMenuData={(menuData) => {
          return menuData || [];
        }}
      >
        <PageContainer title={false}>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#00bab5',
              },
            }}
          >
            <Outlet />
          </ConfigProvider>
        </PageContainer>
      </ProLayout>
    </>
  );
}
