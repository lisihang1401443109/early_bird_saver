import { useEffect, useRef, useState } from "react"
import { Button, Checkbox, Form, Input, Select } from 'antd';
import { useNavigate } from "react-router-dom";
import 'antd/dist/antd.css';

const Failed = () => {
    return (
    <div id="fail_info">

    </div>
    )
}

const Myform = () => {

    const usernameRef = useRef('')
    const passwordRef = useRef('')
    const [typeUser, setTypeUser] = useState([])
    const navig = useNavigate()

    const loginWithCredentials = (username, password, typeUser) => {
        return new Promise( (resolve, reject) => {
            resolve('success')
            reject('failed')
        } )
    }

    const finishHandler = () => {
        console.log(usernameRef.current.input.value)
        console.log(passwordRef.current.input.value)
        console.log(typeUser)

        const login = loginWithCredentials(usernameRef.current.input.value, passwordRef.current.input.value, typeUser);
        login.then(
            (res) => {
                navig('/' + typeUser + '?userId=' + res)
            }
        ).catch(
            (error) => {
                document.getElementById('fail_info').innerHTML = error
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
      <Failed></Failed>

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

      {/* <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
        <Checkbox>Remember me</Checkbox>
      </Form.Item> */}

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