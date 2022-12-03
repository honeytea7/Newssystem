import React, { forwardRef, useEffect, useState } from 'react'
import { Form, Input, Select } from 'antd'
import { flushSync } from 'react-dom'
const { Option } = Select


// 使用forwardRef()来接收参数ref,第二个参数为ref

const UseForm = forwardRef((props, ref) => {
 const[isDisabled,setIsDisabled] =useState(false)

    useEffect(() => {
    setIsDisabled(props.isUpdateDisabled)
},[props.isUpdateDisabled])
    
  const { roleId ,region} = JSON.parse(localStorage.getItem('token'))
  const roleObj = {
    '1': 'superadmin',
    '2': 'admin',
    '3':'editior'
  }
  const checkRegionDisbled = (item) => {
    // 在更新的时候加一个给UseForm传一个isupdate属性，根据此属性判断是否是更新表单
    if (props.isUpdate) {
      // 更新时
      if (roleObj[roleId] === 'superadmin') {
        // 如果时超级管理员
        return false
      } else {
        return true
      }
      
    } else {
      if (roleObj[roleId] === 'superadmin') {
        return false
      } else {
        return item.value !== region
        // 和地区不一样就返回true和地区一样就是返回false、
        // false时不禁用，true时禁用
      }
    }
  
  }
  const checkRoleDisabled = (item) => {
    // 在更新的时候加一个给UseForm传一个isupdate属性，根据此属性判断是否是更新表单
    if (props.isUpdate) {
      // 更新时
      if (roleObj[roleId] === 'superadmin') {
        // 如果时超级管理员
        return false
      } else {
        return true
      }
      
    } else {
      if (roleObj[roleId] === 'superadmin') {
        return false
      } else {
        return roleObj[item.id] !== roleObj[3]
        // 3是区域编辑的id
        // false时不禁用，true时禁用
      }
    }
  
  }

  return (
    <div><Form

        layout="vertical"
       ref={ref}
      >
        <Form.Item
          name="username"
          label="用户名"
          rules={[
            {
              required: true,
              message: 'Please input the title of collection!',
            },
          ]}
        >
          <Input />
          </Form.Item>
          
        <Form.Item
          name="password"
          label="密码"
          rules={[
            {
              required: true,
              message: 'Please input the title of collection!',
            },
          ]}
        >
          <Input />
          </Form.Item>
          
         <Form.Item
          name="region"
          label="区域"
          rules={isDisabled ? [] : [{
                  message: 'Please input the title of collection!'
              }]}
        >
            <Select  disabled={isDisabled}>
              {
                // 没有在UseState开始时指定它的数据类型为数组,然后渲染界面的时候,数据不为数组类型,就无法使用map()遍历,解决办法是,在usestate时给它赋值一个空数组,或者打一个问号,遇到问题,就是网慢的时候消息回来的慢,就会报错
                props.regionList.map(item => {
                 return <Option value={item.value} key={item.id} disabled={checkRegionDisbled(item)}>{item.title}</Option>
              })
              }
          </Select>
          </Form.Item>
          <Form.Item
          name="roleId"
          label="角色"
              rules={[{
                   required: true,
                  message: 'Please input the title of collection!'
              }]}
        >
              <Select onChange={(value) => {
                  if (value === 1) {
                      setIsDisabled(true)
                      ref.current.setFieldsValue({
                          region:''
                      })
                  } else {
                      setIsDisabled(false)
                  }
            }}>
              {
                  props.roleList.map(item => {
                 return <Option value={item.id} key={item.id} disabled={checkRoleDisabled(item)}>{item.roleName}</Option>
              })
              }
          </Select>
        </Form.Item>
      </Form></div>
  )
})
export default UseForm