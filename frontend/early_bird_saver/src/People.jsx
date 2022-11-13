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
import axios from "axios";


const MyMap = (props) => {

    const setCurrLoc = props.setCurrLoc
    
    const [position, setPosition] = useState(null)
    const map = useMapEvents({
      click(e) {
        console.log(e)
        if (!props.startPin){
            setPosition(e.latlng)
        }
        setCurrLoc(e.latlng)
      },
    })

    useEffect(() => {
        if (props.startPin) {
            setPosition(props.startPin)
        }
    }, [])

  
    return position === null ? null : (
      <Marker position={position} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})} >
        <Popup>This Position</Popup>
      </Marker>
    )
}

const Driver = (props) => {

    const [mapOn, setMapOn] = useState(false)

    const getDriverInfo = (id) => {
        return axios.get('http://localhost:5000/test_person').then(res => res.data).then(res => {
            console.log('hi there')
            console.log(res)
            update({
            driverName: res.NAME,
            scheduledTime: res.DPRTRT,
            pickupLocation: res.LAT + ', ' + res.LNG,
        })})
    }

    const goBack = () => {
        
    }

    const deleteDriver = () => {
        // TODO

        setDriverID((prev) => '')

        update()
    }

    const [ driverID, setDriverID ] = useState(props.shared)
    const [driverInfo, setDriverInfo] = useState([])
    const userInfo = props.user

    const update = (newDriverInfo) => {
        setDriverInfo(
            (prev) => {
                return {...newDriverInfo}
            }
        )
    }

    useEffect(() => {getDriverInfo('man')}, [])
    

    return (
        <div className="site-card-border-less-wrapper">
        <Card title={driverID !== '' ? 'Your Driver' : 'No Driver'} bordered={false} style={{ width: 500 }}>
        {driverID !== '' ? 
        <div>
            <div>
            <p>Driver Name: {driverInfo.driverName}</p>
            <p>Scheduled Time: {driverInfo.scheduledTime}</p>
            <p>Pick Up Location: <a onClick={() => setMapOn((prev) => {return !prev})}>{driverInfo.pickupLocation}</a></p>
            
            </div>
            <Button type='primary' danger onClick={deleteDriver}>Delete Schedule</Button></div> :
        <div>
            No driver Currently Matched
            <Button type='primary' onClick={goBack}></Button>
        </div>}
        </Card>

        {mapOn && 
        <>
            <MapContainer center={[driverInfo.pickupLocation.split(', ')[0], driverInfo.pickupLocation.split(', ')[1]]} zoom={20} scrollWheelZoom={true} style = {{height: '300px', width: '100%'}}>
                {/* <div style = {{height: '300px', width: '300px'}}></div> */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                <MyMap setCurrLoc = {(_) => {console.log('hehe')}} startPin = {[driverInfo.pickupLocation.split(', ')[0], driverInfo.pickupLocation.split(', ')[1]]}></MyMap>
            </MapContainer>
        </>
        }
      </div>
    )
}



const PeopleInfo = (props) => {

    const [selfInfo, setSelfInfo] = useState(props.user)

    const [driverLoc, setDriverLoc] = useState('')

    const doMatch = (location, time, university) => {
        console.log('getting...')
        return axios.get('http://localhost:5000/test_match_frontend').then((res) => {
            console.log('hhhh')
            console.log(res)
            setDriverLoc((orig) => res.LAT + ', ' + res.LNG)
            return res
        })
    }

    const matchDriver = () => {
        return doMatch(selfInfo.pickupLocation, selfInfo.scheduledTime, selfInfo.universityId)
    }

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
        doMatch(0, 0, 0)
    }, [])


    useEffect(() => {
        const temp = {...selfInfo}
        temp.home = currLoc
        updateUserInformation(temp)
        console.log(currDate)
    }, [currLoc, currDate])

    

    const showModal = () => {
        const match = matchDriver()
        match.then((res) => {
            setMatchedDriver( (prev) => {
                return {
                    name: res.NAME,
                    location: res.WAYPNTS[0]
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
                <DatePicker onChange={onChange} showTime={true} showSecond={false}/>
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
            <p>Your Pick Up Location: <a onClick={() => setMapOn((prev) => {return !prev})}>{currLoc ? currLoc.lat + ', ' + currLoc.lng : 'select location'}</a></p>
            <div>Your Scheduled Time:  <Popover content={content} title="Title" trigger="click"><Button>{currDate ? currDate : "Find Your Time"}</Button></Popover></div>
            </div>
            <br></br>
            <Button type='primary' onClick={showModal}>find match</Button></div>
            <Modal title="Matched Driver" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={700}>
                <Card title="Your Driver" bordered={false} style={{ width: 500 }} >
                    <div>
                        {matched == 1 ? <div>
                            <p>Driver Name: {matchedDriver.name}</p>
                            {/* <p>Scheduled Time: "N/A"</p> */}
                            <p>Pick Up Location: {driverLoc}</p>
                            {/* <Button type="primary">Accept Driver</Button> */}
                        </div> : 
                        <div>matching...</div>}
                    </div>
                </Card>
            </Modal>
        </Card>
        {mapOn && 
        <>
            <MapContainer center={[37.7591842,-122.4607287]} zoom={20} scrollWheelZoom={true} style = {{height: '300px', width: '100%'}}>
                {/* <div style = {{height: '300px', width: '300px'}}></div> */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                <MyMap setCurrLoc = {setCurrLoc} startPin = {currLoc}></MyMap>
            </MapContainer>
        </>
        }
    </div>)
}

const People = () => {

    const { Header, Content, Footer } = Layout;
    const userId = useParams()
    const [user, setUser] = useState([])


    const getUserInfo = (id) => {
        // TODO
        return new Promise((resolve, reject) => {
            resolve(
                {
                    name: 'Sihang Li',
                    universityId: 0,
                    home: 'location',
                    time: '8:00am',
                    shared: true,
                    driverID: 'man'
                }
            )
        })
    }

    useEffect(() => {
        getUserInfo(userId).then(ppl => {
            setUser((usr) => {
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
                defaultSelectedKeys={['1']}
                // items={new Array(2).fill(null).map((_, index) => {
                // const key = index + 1;
                // return {
                //     key,
                //     label: `nav ${key}`,
                // };
                // })}
                items = {[
                    {key: 1, label : 'My Info'},
                    {key: 2, label : 'My Driver'}
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