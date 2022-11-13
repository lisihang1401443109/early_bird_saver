import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { Breadcrumb, Layout, Menu, Card, Button, Modal } from 'antd';
import { useRef } from "react";


const Driver = (props) => {

    const getDriverInfo = (id) => {
        return (id == -1) ? [] : {
            driverName: 'Andrew',
            scheduledTime: '10:00',
            pickupLocation: 'location'
        }
    }

    const doMatch = (location, time, university) => {
        // TODO
        return -1
    }

    const matchDriver = () => {
        return doMatch(userInfo.pickupLocation, userInfo.scheduledTime, userInfo.universityId)
    }




    const deleteDriver = () => {
        // TODO

        setDriverID(-1)

        update()
    }

    const [ driverID, setDriverID ] = useState(props.shared)
    const [driverInfo, setDriverInfo] = useState([])
    const userInfo = props.user

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
        <Card title={driverID >= 0 ? 'Your Driver' : 'No Driver'} bordered={false} style={{ width: 300 }}>
        {driverID > -1 ? 
        <div>
            <div>
            <p>Driver Name: {driverInfo.driverName}</p>
            <p>Scheduled Time: {driverInfo.scheduledTime}</p>
            <p>Pick Up Location: {driverInfo.pickupLocation}</p>
            </div>
            <Button type='primary' danger onClick={deleteDriver}>Delete Schedule</Button></div> :
        <div>
            No driver Currently Selected
            <Button type='primary' onClick={matchDriver}></Button>
        </div>}
          
        </Card>
      </div>
    )
}

const PeopleInfo = (props) => {

    const selfInfo = props.user

    const doMatch = (location, time, university) => {
        // TODO
        return new Promise((resolve, reject) => {
            setTimeout(resolve({
                driverName: 'Andrew',
                scheduledTime: '8:00 am',
                pickupLocation: 'location'
            }), 2000)
        })
    }

    const matchDriver = () => {
        return doMatch(selfInfo.pickupLocation, selfInfo.scheduledTime, selfInfo.universityId)
    }

    console.log(selfInfo)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [matchedDriver, setMatchedDriver] = useState([])
    const [matched, setMatched] = useState(0)
    const [mapOn, setMapOn] = useState(false)

    const showModal = () => {
        console.log()
        const match = matchDriver()
        console.log(match)
        match.then((res) => {
            setMatchedDriver( (prev) => {
                return {
                    ...res
                }
            })
            console.log('matched')
            console.log(res)
            console.log('get here')
            setMatched(
                (prev) => {return 1}
            )})
        setIsModalOpen(true)
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (        
    <div className="site-card-border-less-wrapper">
        <Card title="Your Info" bordered={false} style={{ width: 300 }}> 
        <div>
            <div>
            <p>Your Name: {selfInfo.name}</p>
            <p>Your Univeristy: {selfInfo.universityId}</p>
            <p>Your Pick Up Location: <a onClick={() => setMapOn((prev) => {return !prev})}>{selfInfo.home}</a></p>
            <p>Your Scheduled Time: {selfInfo.time}</p>
            </div>
            <Button type='primary' onClick={showModal}>find match</Button></div>
            <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Card title="Your Driver" bordered={false} style={{ width: 300 }} >
                    <div>
                        {matched == 1 ? <div>
                            <p>Driver Name: {matchedDriver.driverName}</p>
                            <p>Scheduled Time: {matchedDriver.scheduledTime}</p>
                            <p>Pick Up Location: {matchedDriver.pickupLocation}</p>
                            <Button type="primary">Accept Driver</Button>
                        </div> : 
                        <div>matching...</div>}
                    </div>
                </Card>
            </Modal>
        </Card>
        {mapOn && <div id="mapid"></div>}
    </div>)
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

    const [currKey, setCurrKey] = useState('')
    
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
                onSelect= {(item) => {
                    // console.log(item)
                    setCurrKey(item.key)
                    console.log(currKey)
                }}
            />
            </Header>
            <Content style={{ padding: '0 50px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Ridesharer User</Breadcrumb.Item>
                {/* <Breadcrumb.Item>List</Breadcrumb.Item>
                <Breadcrumb.Item>App</Breadcrumb.Item> */}
            </Breadcrumb>
            <div className="site-layout-content">
                {currKey == '2' ? <Driver shared={user.driverID} user = {user}></Driver> : 
                <PeopleInfo user={user}></PeopleInfo>}
            </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
        // <topBar></topBar>
    )
}

export {People}