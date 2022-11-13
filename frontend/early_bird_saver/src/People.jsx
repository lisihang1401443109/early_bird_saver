import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { Breadcrumb, Layout, Menu, Card, Button } from 'antd';


const Driver = (props) => {

    const getDriverInfo = (id) => {
        return (id == -1) ? [] : {
            driverName: 'Andrew',
            scheduledTime: '10:00',
            pickupLocation: 'location'
        }
    }

    const deleteDriver = () => {
        // TODO

        setDriverID(-1)

        update()
    }

    const [ driverID, setDriverID ] = useState(props.shared)
    const [driverInfo, setDriverInfo] = useState([])

    const update = (id) => {
        setDriverInfo(
            (prev) => {
                return {...(getDriverInfo(id))}
            }
        )
    }

    useEffect(update, [])
    
    console.log(driverID)
    console.log(getDriverInfo(driverID))

    return (
        <div className="site-card-border-less-wrapper">
        <Card title={driverID >= 0 ? 'Your Driver' : 'Your Matched Driver'} bordered={false} style={{ width: 300 }}>
        {driverID > -1 ? <div>
          <p>Driver Name: {driverInfo.driverName}</p>
          <p>Scheduled Time: {driverInfo.scheduledTime}</p>
          <p>Pick Up Location: {driverInfo.pickupLocation}</p>
        </div> : 
        <div>
            noDriver
        </div>}
          <Button type='primary' danger onClick={deleteDriver}>Delete Schedule</Button>
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
    },[])
    
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