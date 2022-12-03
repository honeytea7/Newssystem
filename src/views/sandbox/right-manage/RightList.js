import React, { useEffect, useState } from 'react'
import { Table ,Button,Tag, Modal,Popover,Switch} from 'antd';
import axios from 'axios';

import { EditOutlined, DeleteOutlined ,ExclamationCircleOutlined} from '@ant-design/icons'

export default function RightList() {
const [dataSource,setDataSource]=useState()
  // table表格的列
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    render: (id) => {
      return <b>{id}</b>
    }

  },
  {
    title: '权限名称',
    dataIndex: 'label',
  
  },
  {
    title: '权限路径',
    dataIndex: 'key',
    key: 'address',
      render: (key) => {
     return <Tag color='orange'>{key}</Tag>
    }
  },
  {
    title: "操作",
    //item是一个没有的项，那么使用这个对象里没有的项就可以拿到被点击的那个对象
    render: (item) => {

      return <div>


        <Button danger type="primary" shape="circle" icon={<DeleteOutlined />} onClick={() => { showConfirm(item) }} />
        
        <Popover content={<div style={{ 'textAlign': 'center' }}><Switch checked={item.pagepermisson} onChange={()=>{switchMethod(item)}}></Switch></div>} title="页面配置项" trigger={item.pagepermisson===undefined?'':'click'}>
                <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagepermisson===undefined} />
      </Popover>
       
      </div>
    }
  }
  ];
// 发送请求
  useEffect(() => {
    axios.get('/rights?_embed=children').then(res => {
      setDataSource(res.data)
      const list =res.data
      list.forEach(item => {
        if (item.children.length === 0)
        {
          item.children=''
          }
      })
     
    setDataSource(list)
    })
    
  }, [])
  
  const { confirm } = Modal
// 确认框
const showConfirm = (item) => {
  confirm({
    title: '',
    icon: <ExclamationCircleOutlined />,
    content: '你确认吗',

    onOk() {
     
       deleteMethod(item)
    },
 
    onCancel() {
     
    },
  });
};
//删除功能，需要当前页面和后端同步
  const deleteMethod = (item) => {
    //此功能有用请勿直接点击
    // axios.delete(`http://localhost:8000/rights/${item.id}`)
    if (item.grade === 1) {
      setDataSource(dataSource.filter(data=>data.id!==item.id))
        axios.delete(`/rights/${item.id}`)
    } else {
      let  list = dataSource.filter((i) => {
       return i.rightId===item.id
      })
      list[0].children = list[0].children.filter(data => data.id !== item.id)
      setDataSource([...dataSource])
      axios.delete(`/children/${item.id}`)
    }
  
  }

// switch开关函数
  const switchMethod = (item) => {
    console.log(item);
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
    setDataSource([...dataSource])
    if (item.grade === 1) {
      axios.patch(`/rights/${item.id}`,{pagepermisson:item.pagepermisson})
    }
    else {
      axios.patch(`/rights/children/${item.id}`,{pagepermisson:item.pagepermisson})
    }
  }
  return (
    <Table dataSource={dataSource} columns={columns}  />
  )
}
