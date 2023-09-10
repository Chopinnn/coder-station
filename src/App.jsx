import React, { useState, useEffect } from 'react'
import RouteBefore from './router/RouteBefore'
import './css/App.css'

import { useDispatch } from 'react-redux'
import { changeLoginStatus, initUserInfo } from './redux/userSlice'

import { getInfo, getUserById } from './api/user'

import NavHeader from './components/NavHeader'
import PageFooter from './components/PageFooter'
import LoginForm from './components/LoginForm'

import { Layout, message } from 'antd'
const { Header, Footer, Content } = Layout

export default function App () {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const dispatch = useDispatch()

  // 加载根组件的时候，需要恢复用户的登录状态
  useEffect(() => {
    async function fetchData () {
      const result = await getInfo()
      if (result.data) {
      // 说明 token 有效
      // 获取该 id 对应的用户信息，存储到状态仓库
        const { data } = await getUserById(result.data._id)
        dispatch(initUserInfo(data))
        dispatch(changeLoginStatus(true))
      } else {
      // 说明 token 过期了
        message.warning(result.msg)
        localStorage.removeItem('userToken')
      }
    }
    if (localStorage.getItem('userToken')) {
      fetchData()
    }
  }, [])

  /**
   * 关闭弹框
   */
  function closeModal () {
    setIsModalOpen(false)
  }

  /**
   * 打开弹框
   */
  function loginHandle () {
    setIsModalOpen(true)
  }

  return (
    <div className="App">
      {/* 头部 */}
      <Header className="header">
        <NavHeader loginHandle={loginHandle}/>
      </Header>
      {/* 匹配上的路由页面 */}
      <Content className="content">
        <RouteBefore />
      </Content>
      {/* 底部 */}
      <Footer className="footer">
        <PageFooter />
      </Footer>
      {/* 登录弹窗 */}
      <LoginForm isShow={isModalOpen} closeModal={closeModal}/>
    </div>
  )
}
