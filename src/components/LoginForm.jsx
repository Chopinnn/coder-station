import React, { useState, useRef, useEffect } from 'react'
import { Modal, Radio, Form, Input, Button, Row, Col, Checkbox, message } from 'antd'
import styles from '../css/LoginForm.module.css'
import { getCaptcha, userIsExist, addUser, userLogin, getUserById } from '../api/user'
import { initUserInfo, changeLoginStatus } from '../redux/userSlice'
import { useDispatch } from 'react-redux'

function LoginForm (props) {
  // 用于判断是登录表单(1)还是注册表单(2)
  const [value, setValue] = useState(1)
  const [captcha, setCaptcha] = useState(null)

  const loginFormRef = useRef()
  const registerFormRef = useRef()
  const dispatch = useDispatch()

  // 登录表单的状态数据
  const [loginInfo, setLoginInfo] = useState({
    loginId: '',
    loginPwd: '',
    captcha: '',
    remember: false
  })
  // 注册表单的状态数据
  const [registerInfo, setRegisterInfo] = useState({
    loginId: '',
    nickname: '',
    captcha: ''
  })

  useEffect(() => {
    captchaClickHandle()
  }, [props.isShow])

  function handleOk () { }

  // 登录注册切换事件
  function onChange (e) {
    setValue(e.target.value)
    captchaClickHandle()
  }

  async function loginHandle () {
    const result = await userLogin(loginInfo)
    if (result.data) {
      // 验证码是正确的
      const data = result.data
      if (!data.data) {
        // 账号密码不正确
        message.error('账号或密码不正确')
        captchaClickHandle()
      } else if (!data.data.enabled) {
        // 账号被禁用了
        message.warning('账号被禁用')
        captchaClickHandle()
      } else {
        // 账号密码正确
        // 存储 token
        localStorage.userToken = data.token
        const result = await getUserById(data.data._id)
        dispatch(initUserInfo(result.data))
        dispatch(changeLoginStatus(true))
        handleCancel()
      }
    } else {
      message.warning(result.msg)
      captchaClickHandle()
    }
  }

  function handleCancel () {
    // 清空上一次的内容
    setRegisterInfo({
      loginId: '',
      nickname: '',
      captcha: ''
    })
    setLoginInfo({
      loginId: '',
      loginPwd: '',
      captcha: '',
      remember: false
    })
    props.closeModal()
  }

  async function registerHandle () {
    const result = await addUser(registerInfo)
    if (result.data) {
      message.success('用户注册成功，默认密码为 123456')
      dispatch(initUserInfo(result.data))
      dispatch(changeLoginStatus(true))
      handleCancel()
    } else {
      message.warning(result.msg)
      captchaClickHandle()
    }
  }

  /**
   * 根据用户输入，修改对应表单的对应信息
     * @param {*} oldInfo 之前的状态
     * @param {*} newValue 用户输入的新内容
     * @param {*} key 新内容对应的键名
     * @param {*} setInfo 修改状态值的函数
     */
  function updateInfo (oldInfo, newValue, key, setInfo) {
    const obj = { ...oldInfo }
    obj[key] = newValue
    setInfo(obj)
  }

  // 验证码点击事件
  async function captchaClickHandle () {
    const result = await getCaptcha()
    setCaptcha(result)
  }

  /**
     * 验证登录账号是否存在
     */
  async function checkLoginIdIsExist () {
    if (registerInfo.loginId) {
      const { data } = await userIsExist(registerInfo.loginId)
      if (data) {
        return Promise.reject(new Error('该用户已经注册过了'))
      }
    }
  }

  let container = null

  if (value === 1) {
    // 登录面板的 JSX
    container = (
        <div className={styles.container}>
            <Form
                name="basic1"
                autoComplete="off"
                onFinish={loginHandle}
                ref={loginFormRef}
            >
                <Form.Item
                    label="登录账号"
                    name="loginId"
                    rules={[
                      {
                        required: true,
                        message: '请输入账号'
                      }
                    ]}
                >
                    <Input
                        placeholder="请输入你的登录账号"
                        value={loginInfo.loginId}
                        onChange={(e) => updateInfo(loginInfo, e.target.value, 'loginId', setLoginInfo)}
                    />
                </Form.Item>

                <Form.Item
                    label="登录密码"
                    name="loginPwd"
                    rules={[
                      {
                        required: true,
                        message: '请输入密码'
                      }
                    ]}
                >
                    <Input.Password
                        placeholder="请输入你的登录密码，新用户默认为123456"
                        value={loginInfo.loginPwd}
                        onChange={(e) => updateInfo(loginInfo, e.target.value, 'loginPwd', setLoginInfo)}
                    />
                </Form.Item>

                {/* 验证码 */}
                <Form.Item
                    name="logincaptcha"
                    label="验证码"
                    rules={[
                      {
                        required: true,
                        message: '请输入验证码'
                      }
                    ]}
                >
                    <Row align="middle">
                        <Col span={16}>
                            <Input
                                placeholder="请输入验证码"
                                value={loginInfo.captcha}
                                onChange={(e) => updateInfo(loginInfo, e.target.value, 'captcha', setLoginInfo)}
                            />
                        </Col>
                        <Col span={6}>
                            <div
                                className={styles.captchaImg}
                                onClick={captchaClickHandle}
                                dangerouslySetInnerHTML={{ __html: captcha }}
                            ></div>
                        </Col>
                    </Row>
                </Form.Item>

                <Form.Item
                    name="remember"
                    wrapperCol={{
                      offset: 5,
                      span: 16
                    }}
                >
                    <Checkbox
                        onChange={(e) => updateInfo(loginInfo, e.target.checked, 'remember', setLoginInfo)}
                        checked={loginInfo.remember}
                    >记住我</Checkbox>
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                      offset: 5,
                      span: 16
                    }}
                >
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{ marginRight: 20 }}
                    >
                        登录
                    </Button>
                    <Button type="primary" htmlType="submit">
                        重置
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
  } else {
    // 注册面板的 JSX
    container = (
        <div className={styles.container}>
        <Form
            name="basic2"
            autoComplete="off"
            ref={registerFormRef}
            onFinish={registerHandle}
        >
            <Form.Item
                label="登录账号"
                name="loginId"
                rules={[
                  {
                    required: true,
                    message: '请输入账号，仅此项为必填项'
                  },
                  // 验证用户是否已经存在
                  { validator: checkLoginIdIsExist }
                ]}
                validateTrigger='onBlur'
            >
                <Input
                    placeholder="请输入账号"
                    value={registerInfo.loginId}
                    onChange={(e) => updateInfo(registerInfo, e.target.value, 'loginId', setRegisterInfo)}
                />
            </Form.Item>

            <Form.Item
                label="用户昵称"
                name="nickname"
            >
                <Input
                    placeholder="请输入昵称，不填写默认为新用户xxx"
                    value={registerInfo.nickname}
                    onChange={(e) => updateInfo(registerInfo, e.target.value, 'nickname', setRegisterInfo)}
                />
            </Form.Item>

            <Form.Item
                name="registercaptcha"
                label="验证码"
                rules={[
                  {
                    required: true,
                    message: '请输入验证码'
                  }
                ]}
            >
                <Row align="middle">
                    <Col span={16}>
                        <Input
                            placeholder="请输入验证码"
                            value={registerInfo.captcha}
                            onChange={(e) => updateInfo(registerInfo, e.target.value, 'captcha', setRegisterInfo)}
                        />
                    </Col>
                    <Col span={6}>
                        <div
                            className={styles.captchaImg}
                            onClick={captchaClickHandle}
                            dangerouslySetInnerHTML={{ __html: captcha }}
                        ></div>
                    </Col>
                </Row>
            </Form.Item>

            <Form.Item
                wrapperCol={{
                  offset: 5,
                  span: 16
                }}
            >
                <Button
                    type="primary"
                    htmlType="submit"
                    style={{ marginRight: 20 }}
                >
                    注册
                </Button>
                <Button type="primary" htmlType="submit">
                    重置
                </Button>
            </Form.Item>
        </Form>
    </div>
    )
  }
  return (
    <div>
      <Modal title="注册/登录" open={props.isShow} onOk={handleOk} onCancel={props.closeModal}>
                <Radio.Group
                    value={value}
                    onChange={onChange}
                    className={styles.radioGroup}
                    buttonStyle="solid"
                >
                    <Radio.Button value={1} className={styles.radioButton}>登录</Radio.Button>
                    <Radio.Button value={2} className={styles.radioButton}>注册</Radio.Button>
                </Radio.Group>
                {/* 登录表单或注册表单 */}
                {container}
            </Modal>
    </div>
  )
}

export default LoginForm
