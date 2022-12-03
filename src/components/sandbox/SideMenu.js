import React,{useEffect, useState} from 'react'
import { Layout, Menu } from 'antd';

import {
    PieChartOutlined,
    HomeOutlined 
} from '@ant-design/icons';
import './index.css'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch,useSelector } from 'react-redux';
const { Sider } = Layout;

// 渲染子菜单的items数组生成函数
  function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}
    


// ico图标
const iconList = {
    '/home': <HomeOutlined />,
    '/publish-manage': <PieChartOutlined />,
    '/user-manage/list': <HomeOutlined />,
    '/right-manage/role/list': <HomeOutlined />,
     '/right-manage/right/list':<HomeOutlined />,
    
}



export default function SideMenu() {
    const collapsed = useSelector(state=>state.collapsed.collapsed)
    // 菜单栏
    const dispatch=useDispatch()
       const [menu, setMenu] = useState([])
  
    const navigate=useNavigate()
   
    const onClick = (e) => {
       
           
        // setCurrent(e.key);
        navigate(e.key)
    };
    
const {role:{rights}}=JSON.parse(localStorage.getItem('token'))
    // 数据过滤
    const filter = (items) => {

       
        return items.filter(item => {
            if (item.pagepermisson&&rights.includes(item.key)) {
                if (item.children && item.children.length !== 0) {
                   return item.children=filter(item.children)
                }
                return item
            }
        })
     
    }
    // 菜单过滤
    const getMenu = (items) => {
        
      return  items.map(item => {
                if (item?.children&&item.children?.length!==0) {
                    item.children = getMenu(item.children)
          }
          
          if (item?.children && item.children?.length > 0) {
           
                    return getItem(item.label,item.key,iconList[item.key],item.children)
          } else {
              
                     return getItem(item.label,item.key,iconList[item.key])
                
             }
             
      })
        
        
    }
    //获取location
    const location = useLocation();
   
    const selectKeys = [location.pathname]
    const openKeys=['/'+location.pathname.split('/')[1]]

    console.log(location);
    
    useEffect(() => {
       
        axios.get('/rights?_embed=children').then(res => {
          
   
            const menu22 = getMenu(filter(res.data))
       
               setMenu(menu22)
            
        })
    },[])

  return (
      <Sider trigger={null} collapsible   collapsed={collapsed}>
          {/* 标题 */}
          <div   style={{display:'flex',height:'100%',"flexDirection":'column'}}>
               <div className="logo" >全球新闻发布管理系统  </div>

          {/* 菜单 */}
              <div style={{'flex':1}}>
                   <Menu
                    //   defaultSelectedKeys={selectKeys}
                    //   用默认就是非受控组件，页面会先跳转到'/'再重定向跳转到/home此时这个默认选中就会失效
                    //   改成SelectedKeys就是受控组件
                     selectedKeys={selectKeys}
                    
              defaultOpenKeys={openKeys}
              mode="inline"
              theme="dark"
            //   inlineCollapsed={collapsed}
              items={menu}
              onClick={onClick}
        />
           </div>
         </div>
            

      </Sider>
  )
}
