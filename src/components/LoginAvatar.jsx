import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearUserInfo, changeLoginStatus } from '../redux/userSlice'

import styles from '../css/LoginAvatar.module.css'
import { Button, List, Popover, Avatar, Image } from 'antd'
import { UserOutlined } from '@ant-design/icons'

// 该组件用于显示用户的头像，如果用户没有登录，那么就显示登录注册按钮
function LoginAvatar (props) {
  const { isLogin, userInfo } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  function listClickHandle (item) {
    if (item === '个人中心') {
      // 跳转到个人中心
      navigate('/personal')
    } else {
      // 退出登录
      localStorage.removeItem('userToken')
      dispatch(clearUserInfo)
      dispatch(changeLoginStatus(false))
      navigate('/')
    }
  }

  let loginStatus = null
  if (isLogin) {
    // 已经登录
    const content = (
      <List
        dataSource={['个人中心', '退出登录']}
        size="large"
        renderItem={(item) => {
          return <List.Item style={{ cursor: 'pointer' }} onClick={() => listClickHandle(item)}>{item}</List.Item>
        }}
      />
    )
    loginStatus = (
      <Popover content={content} trigger="hover" placement="bottom">
        <div className={styles.avatarContainer}>
            {/* preview:是否支持预览(放大) */}
          <Avatar src={<Image src={userInfo?.avatar} preview={false}/>} size="large" icon={<UserOutlined />} />
        </div>
      </Popover>
    )
  } else {
    // 没有登录
    loginStatus = (
      <Button type="primary" size="large" onClick={props.loginHandle}>
        注册/登录
      </Button>
    )
  }

  return <div>{loginStatus}</div>
}

export default LoginAvatar
