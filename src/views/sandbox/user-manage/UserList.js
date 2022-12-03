import React, { useEffect, useState,useRef } from 'react'
import{DeleteOutlined ,EditOutlined,ExclamationCircleOutlined} from '@ant-design/icons'
import axios from 'axios'
import { flushSync } from 'react-dom'
import { Table, Switch, Button,  Modal,  } from 'antd'
import UseForm from '../../../components/user-manage/UseForm'

export default function UserList() {
  const addForm = useRef(null)
      const updateForm=useRef(null)
  const [dataSource, setDataSource] = useState([])
  const [open, setOpen] = useState(false);
  const [roleList, setRoleList] = useState([])
  const [regionList, setRegionList] = useState([])
  const [isdUpdateOpen, setIsUpdateOpen] = useState(false)
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false)
  const [current,setCurrent]=useState(null)
  // const roleName=['超级管理员','区域管理员','区域编辑']
  useEffect(() => {
    if (localStorage.getItem('xxx')) {
      console.log('xxx存在');
    } else {
      console.log('xxx不存在');
    }
  })

  const { roleId, region ,username} = JSON.parse(localStorage.getItem('token'))

  const columns = [{
    title: '区域',
    dataIndex: 'region',
    filters: [...regionList.map((item) => 
    ({
      // 因为对象的大括号和函数的大括号容易混淆所以要再外面加一个圆括号
      text: item.label,
      value:item.value
    })
    ), {
      text: '全球',
      value:'全球'
    }],

    onFilter: (value, item) => {
        // value是我点击的那一项的值
       //item是一个没有的项，那么使用这个对象里没有的项就可以拿到被点击的那个对象
      if (value === '全球') {
        return item.region===''
      } else {
        return  item.region===value
      }
    }
    
      
    ,

    render: (region) => {
      return <b>{region===''?'全球':region}</b>
    }
  },
    {
    title: '角色名称',
    dataIndex: 'role',
      render: (role) => {
      
        // 遇到网络请求数据还没回来的时候,直接写role.roleName就会报错
      return <div>{role?.roleName}</div>
    }
  },
  {
    title: '用户名',
    dataIndex: 'username',
    render: (username) => {
      return <b>{username}</b>
    }
    },
  {
    title: '用户状态',
    dataIndex: 'roleState',
    render: (roleState,item) => {
      return <Switch checked={roleState} disabled={item.default} onChange={() => {
        handleChange(item)
        console.log(item);
      }}></Switch>
    }
    },
    {
      title: '操作',
      render: (item) => {
       return  <div>
        <Button danger type="primary" shape="circle" icon={<DeleteOutlined  />}  disabled={item.default}  onClick={() => {showConfirm(item) }} />
        
        
      
          <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => {
           handleUpdata(item)
           }}   disabled={item.default} />

       
      </div>
      }
    }
  ]
//更新用户信息
  const handleUpdata = (item) => {
    
    // setIsUpdateOpen(true)
    // 模态框设置为true出现的时候模态框里面的数据还没有更新完是异步的
    // 热更新
    // 解决方法让它俩同步
//     flushSync(() => {
//    setTimeout(() => {
//      setIsUpdateOpen(true);
//      if (item.roleId === 1) {
//        setIsUpdateDisabled(true);
//      } else {
//        setIsUpdateDisabled(false);
//      }
//      updateForm?.current?.setFieldsValue(item);
//    }, 0);
//        setCurrent(item);
// });

    setTimeout(() => {
   flushSync(() => {
      
       if (item.roleId === 1) {
         setIsUpdateDisabled(true);
       } else {
         setIsUpdateDisabled(false);
       }
       updateForm?.current?.setFieldsValue(item);
     })
   
      
    }, 0)
     
    setCurrent(item);
    setIsUpdateOpen(true);
    
  }

  const handleChange = (item) =>{
    item.roleState = !item.roleState
    setDataSource([...dataSource])
    axios.patch(`/users/${item.id}`);
}

  const onCancel = () => {
  setOpen(false)
}

  const updateFormOk = () => { 
    flushSync(() => {
      updateForm.current.validateFields().then((value) => {
        setIsUpdateOpen(false);
        setDataSource(
          dataSource.map((item) => {
            if (item.id === current.id) {
              return {
                ...item,
                ...value,
                role: roleList.filter((data) => data.id === value.roleId)[0],
              };
            }
            return item;
          })
        );
        axios.patch(`/users/${current.id}`, value);
        setIsUpdateDisabled(!isUpdateDisabled);
      });
   })
  }




  useEffect(() => {
    const roleObj = {
    '1': 'superadmin',
    '2': 'admin',
    '3':'editior'
  }
    axios.get("/users?_expand=role").then(res => {
      const list = res.data
      setDataSource(roleObj[roleId] === 'superadmin' ? list : [
        ...list.filter(item => item.username === username),
        ...list.filter(item=>item.region===region&&roleObj[item.roleId]===roleObj[3])
      ])
      
     
    })
    axios.get('/regions').then(res => {
      const list = res.data 
      setRegionList(list)
      
    })
     axios.get('/roles').then(res => {
      const list = res.data 
      setRoleList(list)
      
    })
  }, [region,roleId,username])
  
//表单数据提交函数
  const addFormOk =()=> {
    addForm.current.validateFields().then(value => {
    

      // 设置消失框
      setOpen(false)
      // 然后先将表单数据post到后端啊,生成新的id然后再设置新的datasource,因为没有id不直接设置成dataSOurce的话
      // 之后方便删除和更新后端数据
      axios.post(`/users`, {
        ...value,
        "roleState": true,
        "default": false,
      }).then(res => {
        console.log(res.data);
        // setDataSource([...dataSource, res.data])
        // 有问题：角色名称没加载,因为没有进行连表,这里之请求了users路径、
        // 解决办法如下自己手动设置role
        setDataSource([...dataSource, {
          ...res.data,
        role:roleList.filter(item=>item.id===value.roleId)[0]
        }
        ])

        
      })



    console.log(value);
  }).catch(err => {
    console.log(err);
  })
}

  
    
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
  
    console.log(item);
    setDataSource(dataSource.filter((data) => {
      return data.id!==item.roleId
    }))
    axios.delete(`/users/${item.id}`)

    }
  
  


  return (
    <div>
      <Button type="primary"  onClick={() => {
        setOpen(true)
      }}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns}  pagination={{pageSize:5}} rowKey={item=>item.id}  />;
        
      {/* 添加用户信息 */}
      <Modal
        open={open}
        title="添加用户信息"
        okText="确认"
        cancelText="取消"
        onCancel={onCancel}
        onOk={() => {addFormOk() }}    
      >
        {/* 把表格的数据从组件UseFrom中拿出来然后发送 */}
      <UseForm regionList={regionList} roleList={roleList} ref={addForm}></UseForm>
      </Modal>
      
      {/* 更新用户信息 */}
       <Modal
        open={isdUpdateOpen}
        title="更新用户信息"
        okText="更新"
        cancelText="取消"
        isUpdate={true}
        onCancel={() => {
          setIsUpdateOpen(false)
        setIsUpdateDisabled(!isUpdateDisabled)}}
        onOk={() => {updateFormOk() }}    
    >
      <UseForm regionList={regionList} roleList={roleList} ref={updateForm} isUpdateDisabled={isUpdateDisabled} isUpdate={true}></UseForm>
    </Modal>
   </div>
  )
}
