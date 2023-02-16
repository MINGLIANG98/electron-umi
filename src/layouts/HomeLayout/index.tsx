import { Link, Outlet, useLocation } from 'umi';
import styles from './index.less';
import React, { useState } from 'react'
import { history } from 'umi';


export default function HomeLayout() {
    // const history = useHistory()
    const location = useLocation()
    const { pathname } = location
  
    const setRouteActive = (value: string) => {
      history.push(value)
    }
  
  


  return (
    <div  className={styles.app}>
      <div className={styles.body}>
        <Outlet />
      </div>
    </div>
  );
}
