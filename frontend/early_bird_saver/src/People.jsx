import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { Breadcrumb, Layout, Menu, Card } from 'antd';


const Driver = (props) => {

    const getDriverInfo = (driverID) => {
        return {
            driverName: 'Andrew',
            scheduledTime: '10:00',
            pickupLocation: 'location'
        }
    }

    const driverID  = props.shared
    const driverInfo = getDriverInfo(driverID)
    
    console.log(driverID)

    return (
        <div className="site-card-border-less-wrapper">
        <Card title={driverID >= 0 ? 'Your Driver' : 'Your Matched Driver'} bordered={false} style={{ width: 300 }}>
          <p>Driver Name: {driverInfo.driverName}</p>
          <p>Scheduled Time: {driverInfo.scheduledTime}</p>
          <p>Pick Up Location: {driverInfo.pickupLocation}</p>
        </Card>
      </div>
    )
}

const People = () => {

    const { Header, Content, Footer } = Layout;
    const userId = useParams()
    const [user, setUser] = useState({
        name: '',
        universityId: '',
        home: '',
        time: '',
        shared: '',
        driverID: ''
    })

    const getUserInfo = (id) => {
        return new Promise((resolve, reject) => {
            resolve(
                {
                    name: 'Sihang Li',
                    universityId: 0,
                    home: 'location',
                    time: '8:00am',
                    shared: true,
                    driverID: 100
                }
            )
        })
    }

    useEffect(() => {
        console.log(user)
        getUserInfo(userId).then(ppl => {
            setUser((usr) => {
                    // console.log(Object.keys(ppl))
                    // Object.keys(ppl).forEach(key => {console.log(usr)})
                    return {...ppl}
                }
            )
        })
    }, [])
    
    return (
        <Layout className="layout">
            <Header>
            <div className="logo" />
            <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['2']}
                // items={new Array(2).fill(null).map((_, index) => {
                // const key = index + 1;
                // return {
                //     key,
                //     label: `nav ${key}`,
                // };
                // })}
                items = {[
                    {key: 1, label : 'Info'},
                    {key: 2, label : 'Shard'}
                ]}
            />
            </Header>
            <Content style={{ padding: '0 50px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Ridesharer User</Breadcrumb.Item>
                {/* <Breadcrumb.Item>List</Breadcrumb.Item>
                <Breadcrumb.Item>App</Breadcrumb.Item> */}
            </Breadcrumb>
            <div className="site-layout-content">
                <Driver shared={user.driverID}></Driver>
            </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
        // <topBar></topBar>
    )
}

export {People}