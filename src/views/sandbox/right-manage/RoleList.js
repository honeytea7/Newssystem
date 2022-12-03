import React, { useEffect, useState } from 'react'
import{Table,Popover,Switch,Button,Modal,Tree}from 'antd'
import axios from 'axios'
import{DeleteOutlined,EditOutlined,ExclamationCircleOutlined}from'@ant-design/icons'

export default function RoleList() {
  //dataSource设置数组
  const [dataSource, setDataSource] = useState([])
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [rightList, setRightList] = useState([])
  const [currentRights, setCurrentRights] = useState([])
  // currentId是现在treeData中被选中项的id ,通过dhandleok函数中更新界面和后台数据
  const [currentId,setCurrentId]=useState()
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      render: (roleName) => {
        return <b>{roleName}</b>
      }
    },
    {
      title: "操作",
    //item是一个没有的项，那么使用这个对象里没有的项就可以拿到被点击的那个对象
    render: (item) => {

      return <div>
<Button danger type="primary" shape="circle" icon={<DeleteOutlined  />} onClick={() => {showConfirm(item) }} />
        
        
        <Popover content={<div style={{ 'textAlign': 'center' }}>
          <Switch checked={item.pagepermisson} onChange={() => { }}></Switch></div>} title="页面配置项" trigger={item.pagepermisson === undefined ? '' : 'click'}>
          <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => {
            setIsModalOpen(true)
            console.log('item',  item);
            console.log(currentRights);
           setCurrentId(item.id)

            
            setCurrentRights(item.rights)
           }} />
      </Popover>
       
      </div>
    }
    }
  ]
  
  // 如果请求的后端数据没有KeY值那么需要自己手动设置Key值

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

  const deleteMethod = (item) => {
    const list = dataSource.filter((data) => {
     return  data.id!==item.id
      
    })
    setDataSource(list)
    axios.delete(`/roles/${item.id}`)
    console.log(item);

}

   const disposeData = (datas) => {
     return datas.filter((item) => {
       if (item.children && item.children.length !== 0) {
         item.title = item.label;
         return (item.children = disposeData(item.children));
       } else {
         item.title = item.label;

         return item;
       }
     });
   };

  useEffect(() => {
    axios.get("/roles").then((res) => {
      // 遇到问题,手贱多加了个数组框框
      // setDataSource([res.data])
      console.log(res.data);
      setDataSource(res.data);
    });
    axios.get("/rights?_embed=children").then((res) => {
      res.data = disposeData(res.data);
      setRightList(res.data);
    });
  }, []);


 
  
  
  const handleOk = () => {
    setIsModalOpen(false)
    // 同步datasource
    setDataSource(dataSource.map((item) => {
      if (item.id === currentId) {
        return {
          ...item,
          rights:currentRights
        }
      }
      return item
    }))
  
    axios.patch(`/roles/${currentId}`,{rights:currentRights});


  }



  const handleCancel = () => {
    setIsModalOpen(false)
  }




  const onCheck = (checkKeys) => {
    console.log(checkKeys);

    setCurrentRights(checkKeys.checked)

  }
  
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={item=>item.id} />
      <Modal title="权限分配" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
         <Tree
      checkable
      checkStrictly={true}
      // onSelect={onSelect}
          onCheck={onCheck}
          // currentRights控制的是被选中的权限
          checkedKeys={currentRights}
          // rightList是所有的权限
      treeData={rightList}
    />
      </Modal>
 </div>
  )
}
