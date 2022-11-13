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

const Rider = (props) => {

  const [riders, setRiders] = useState(props.riders)

  const getRiderInfo = (riderName) => {
    console.log('doing it')
    return new Promise((resolve, reject) => {
      resolve()
    }).then((res) => {return {
      name: 'Amy',
      location: {lat: 51.51, lng: -0.08},
      time: '8:00'
    }}).then( (res) => {
      setRiders( (tmp) => {
          const cpy = [...tmp]
          cpy[tmp.indexOf(riderName)] = res
          return cpy
      })
    })
  }

  const [mapOn, setMapOn] = useState(false)
  const [cont, setCont] = useState((<div>No Rider Yet</div>))

  const deleteRider = (index) => {
    setRiders((orig) => {
      return [...orig.splice(0, index), ...orig.splice(index+1,orig.length)]
    })
  }

  const display = (riderInfo, riderIndex) => {
    // console.log(riderInfo)
    return (
      <div className="site-card-border-less-wrapper">
      <Card title={riderInfo !== '' ? 'Your Rider' : 'No Rider'} bordered={false} style={{ width: 500 }}>
      <div>
          <div>
          <p>Rider Name: {riderInfo.name}</p>
          <p>Scheduled Time: {riderInfo.time}</p>
          <p>Pick Up Location: <a onClick={() => setMapOn((prev) => {return !prev})}>{riderInfo.locations}</a></p>
          
          </div>
          <Button type='primary' danger onClick={() => deleteRider(riderIndex)}>Delete Schedule</Button></div>
      </Card>
      {mapOn && 
      <>
          <MapContainer center={[getRiderInfo.lat, getRiderInfo.lng]} zoom={20} scrollWheelZoom={true} style = {{height: '300px', width: '100%'}}>
              {/* <div style = {{height: '300px', width: '300px'}}></div> */}
              <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
              <MyMap setCurrLoc = {(_) => {console.log('hehe')}} startPin = {[getRiderInfo.lat, getRiderInfo.lng]}></MyMap>
          </MapContainer>
      </>
      }
    </div>
    )
  }

    return riders.length == 0 ? (<div>No Riders Yet</div>) : riders.map((obj) => {
      if (typeof obj.then === 'function'){
        return ''
      }else{
        return display(obj, riders.indexOf(obj))
      }
    })
  }


const PeopleInfo = (props) => {

  const selfInfo = props.user 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mapOn, setMapOn] = useState(false)
  const [currLoc, setCurrLoc] = useState([])
  const [currDate, setCurrDate] = useState('')

  const showModal = () => {
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


  return ( <div className="site-card-border-less-wrapper">
  <Card title="Your Info" bordered={false} style={{ width: 500 }}> 
  <div>
      <div>
      <p>Your Name: {selfInfo.name}</p>
      <p>Your Univeristy: {selfInfo.universityId}</p>
      <p>Your Pick Up Location: <a onClick={() => setMapOn((prev) => {return !prev})}>{currLoc.lat + ', ' + currLoc.lng}</a></p>
      <p>Your Capacity: {(selfInfo.Riders ? selfInfo.capacity - selfInfo.Riders.length : -1) + '/' + selfInfo.capacity}</p>
      <div>Your Scheduled Time:  <Popover content={content} title="Title" trigger="click"><Button>{currDate? currDate : "Find Your Time"}</Button></Popover></div>
      <br></br>
      <Button type="primary">Save</Button>
      </div>
    </div>
  </Card>
  {mapOn && 
        <>
            <MapContainer center={[37.7591842,-122.4607287]} zoom={20} scrollWheelZoom={true} style = {{height: '300px', width: '100%'}}>
                {/* <div style = {{height: '300px', width: '300px'}}></div> */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                <MyMap setCurrLoc = {setCurrLoc} startPin = {null}></MyMap>
            </MapContainer>
        </>
    }
  </div>)
}



const Driver = () => {

  const { Header, Content, Footer } = Layout;
  const userId = useParams()

  const [user, setUser] = useState([])
  const [currKey, setCurrKey] = useState('')

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
                Riders: ['john1', 'john2'],
                capacity: 3
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


  return (
    <Layout className="layout">
        <Header>
        <div className="logo" />
        <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            items = {[
                {key: 1, label : 'My Info'},
                {key: 2, label : 'My Riders'}
            ]}
            onSelect= {(item) => {
                setCurrKey(item.key)
                console.log(currKey)
            }}
        />
        </Header>
        <Content style={{ padding: '0 50px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Ridesharer Driver</Breadcrumb.Item>
            {/* <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item> */}
        </Breadcrumb>
        <div className="site-layout-content">
            {currKey == '2' ? <Rider riders={user.Riders}></Rider> : 
            <PeopleInfo user={user}></PeopleInfo>}
        </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
    </Layout>
  )
}

export {Driver}