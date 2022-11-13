import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { Breadcrumb, Layout, Menu, Card, Button, Modal, Popover } from 'antd';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import {Marker, Popup} from 'react-leaflet'
import "leaflet/dist/leaflet.css"
import 'leaflet-geosearch/dist/geosearch.css';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon} from 'leaflet'
import { DatePicker, Space } from 'antd';



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
        <Card title={driverID >= 0 ? 'Your Driver' : 'No Driver'} bordered={false} style={{ width: 500 }}>
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

const MyMap = (props) => {

    const setCurrLoc = props.setCurrLoc
    
    const [position, setPosition] = useState(null)
    const map = useMapEvents({
      click(e) {
        console.log(e)
        setPosition(e.latlng)
        setCurrLoc(e.latlng)
      },
    })

  
    return position === null ? null : (
      <Marker position={position} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})} >
        <Popup>This Position</Popup>
      </Marker>
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

    // console.log(selfInfo)

    const updateUserInformation = (userInfo) => {
        return 0
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [matchedDriver, setMatchedDriver] = useState([])
    const [matched, setMatched] = useState(0)
    const [mapOn, setMapOn] = useState(false)
    const [currLoc, setCurrLoc] = useState([])
    const [currDate, setCurrDate] = useState('')

    useEffect(() => {
        setCurrLoc(selfInfo.home)
        setCurrDate(selfInfo.time)
    }, [])

    useEffect(() => {
        const temp = {...selfInfo}
        temp.home = currLoc
        updateUserInformation(temp)
    }, [currLoc, currDate])

    

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

    const onChange = (date, dateString) => {
        console.log(date, dateString);
        setCurrDate((orig) => dateString)
    };

    const content = (
        <div>
            <Space direction="vertical">
                <DatePicker onChange={onChange} showTime={true}/>
            </Space>
        </div>
    )


    return (        
    <div className="site-card-border-less-wrapper">
        <Card title="Your Info" bordered={false} style={{ width: 500 }}> 
        <div>
            <div>
            <p>Your Name: {selfInfo.name}</p>
            <p>Your Univeristy: {selfInfo.universityId}</p>
            <p>Your Pick Up Location: <a onClick={() => setMapOn((prev) => {return !prev})}>{currLoc.lat + ', ' + currLoc.lng}</a></p>
            <div>Your Scheduled Time:  <Popover content={content} title="Title" trigger="click"><Button>{currDate? currDate : "Find Your Time"}</Button></Popover></div>
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
        {mapOn && 
        <>
            <MapContainer center={[37.7591842,-122.4607287]} zoom={13} scrollWheelZoom={true}>
                <div style = {{height: '300px', width: '300px'}}></div>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                <MyMap setCurrLoc = {setCurrLoc}></MyMap>
            </MapContainer>
        </>
        }
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
        // console.log(user)
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