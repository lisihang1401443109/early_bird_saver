import { useEffect, useRef } from "react"
import { Button, Checkbox, Form, Input } from 'antd';

const Myform = () => {

    const usernameRef = useRef('')
    const passwordRef = useRef('')

    const finishHandler = () => {
        console.log(usernameRef.current.input.value)
        console.log(passwordRef.current.input.value)
    }

    useEffect(() => {
        console.log('changed')
    }, [usernameRef.current, passwordRef.current])

    return (
    <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={finishHandler}
        onFinishFailed={() => {console.log('finish failed')}}
        autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input ref={usernameRef} />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password ref={passwordRef}/>
      </Form.Item>

      <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
    )
}

const Login = () => {
    return (
        <div>
            <Myform></Myform>
            {/* <Submit></Submit> */}
        </div>
    )
}

export { Login }