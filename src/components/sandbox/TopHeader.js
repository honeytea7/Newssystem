import React from 'react'
import { Layout, Menu,Dropdown, Space,Avatar} from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,UserOutlined, 
  
} from '@ant-design/icons';
  import { useDispatch, useSelector } from "react-redux";
import { setCollapsed } from '../../redux/reducer/CollapsedReducer';

const { Header } = Layout;

function TopHeader() {
  const dispatch=useDispatch()
  const collapsed = useSelector(state => state.collapsed.collapsed)
  console.log(collapsed);

    const changeCollapsed = () => {
        dispatch(setCollapsed(!collapsed));
    }
  const navigate = useNavigate()
  const { role: { roleName },username }=JSON.parse(localStorage.getItem('token'))

const menu = (
  <Menu
    onClick={(item) => {
      if (item.key === '2') {
        localStorage.removeItem('token')
       navigate('/login',{replace:true})
      }
    }}
    items={[
      {
        key: '1',
        label: roleName,
      },
      {
        key: '2',
        label:'退出',
        danger: true,
      
       
      },
      
    ]}
  />
);

    return (
      
        
     <Header className="site-layout-background" style={{ padding: '0 16px' }}>
         
          {
              collapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={ changeCollapsed} />
}

          
          {/* 欢迎回来组件 */}
          <div style={{ float:'right'}}>
              <span>欢迎回来<span style={{color:'#1890ff'}}>{username}  </span></span>
              <Dropdown overlay={menu}>
                    
                        <Space>
                        <Avatar size="large" icon={<UserOutlined />} />
                        </Space>
                   
            </Dropdown>
          </div>
        </Header>
  )
}

export default TopHeader