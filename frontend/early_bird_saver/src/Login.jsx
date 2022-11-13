import { useEffect, useRef, useState } from "react"
import { Button, Checkbox, Form, Input, Select } from 'antd';
import { useNavigate } from "react-router-dom";
import 'antd/dist/antd.css';

const Myform = () => {

    const usernameRef = useRef('')
    const passwordRef = useRef('')
    const [typeUser, setTypeUser] = useState([])
    const navigator = useNavigate()

    const loginWithCredentials = (username, password, typeUser) => {
        return new Promise( (resolve, reject) => {
            resolve('success')
        } )
    }

    const finishHandler = () => {
        console.log(usernameRef.current.input.value)
        console.log(passwordRef.current.input.value)
        console.log(typeUser)

        const login = loginWithCredentials(usernameRef.current.input.value, passwordRef.current.input.value, typeUser);
        login.then(
            (res) => {
                navigator('/'+typeUser)
            }
        ).catch(
            (error) => {
                console.log(error)
            }
        )
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

      <Form.Item label="userType">
          <Select onSelect={(value) => {setTypeUser(value)}}>
            <Select.Option value="Car">Car</Select.Option>
            <Select.Option value="People">People</Select.Option>
          </Select>
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