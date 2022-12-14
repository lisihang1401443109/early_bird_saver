import { useParams } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import { Breadcrumb, Layout, Menu, Card, Button, Modal, Popover } from 'antd';
import { MapContainer, TileLayer, useMap, useMapEvents, Polyline } from 'react-leaflet'
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
      console.log(e.latlng)
    },
    locationfound(e) {
      console.log(e.latlng)
    }

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

const MyRoute = (props) => {
  const route = props.route
  const setRoute = props.setRoute

  const limeOptions = { color: 'purple',weight: '5'}

  return (<Polyline pathOptions={limeOptions} positions={route} />)
}

const Route = (props) => {

  // const driver = props.driver.locations
  // console.log(driver)
  const [route, setRoute] = useState([])
  const [center, setCenter] = useState([37.760081344794784, -122.47547208977188])
  const [markers, setMarkers] = useState([])

  // const home = {
  //   lng: -122.46,
  //   lat: 37.759
  // }

  const getRoute = async () => {
    const res = await axios.get('http://localhost:5000/test_person');
    // console.log(res.data.ROUTE)
    setRoute(res.data['ROUTE']);
    setCenter(res.data.CENTER)
    // console.log(res.data)
    console.log(
      res.data.WAYPNTS.map((obj) => {
        (<Marker position={obj} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})} ></Marker>)
      })
    )
    setMarkers(res.data.WAYPNTS.map((obj) => {
      return (<Marker position={obj} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})} ></Marker>)
    }))
  }

  useEffect(() => {
    getRoute()
  }, [])

  useEffect(() => {
    console.log(markers)
  }, [markers])

  // useEffect(() => {
  //   console.log(center)
  // }, [ center ])


  return (
    <>
    <MapContainer center={center} zoom={15} scrollWheelZoom={true} style = {{height: '100%', width: '100%', position: 'absolute', left: '0', top: '64px'}}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers}
      <MyRoute route={route}></MyRoute>
    </MapContainer>
    </>
  )
}

const Rider = (props) => {

  const [riders, setRiders] = useState(props.riders)
  const [cont, setCont] = useState('')

  const getRiderInfo = (rider) => {
    return {
      name: rider.NAME,
      locations: {lat: rider.LAT, lng: rider.LNG},
      time: rider.DPRTRT,
    }
  }


  const [mapOn, setMapOn] = useState(false)

  const deleteRider = (index) => {
    setRiders((orig) => {
      return [...orig.splice(0, index), ...orig.splice(index+1,orig.length)]
    })
  }

  // useEffect(() => {
  //   console.log(mapOn)
  // }, [mapOn])

  const display = (riderInfo, riderIndex) => {
    // console.log(riderInfo)
    return (
      <div key={riderIndex}>
      <div className="site-card-border-less-wrapper">
      <Card title={riderInfo !== '' ? 'Your Rider' : 'No Rider'} bordered={false} style={{ width: 500 }}>
      <div>
          <div>
          <p>Rider Name: {riderInfo.name}</p>
          <p>Scheduled Time: {riderInfo.time}</p>
          <p>Pick Up Location: <a onClick={() => setMapOn((prev) => {return !prev})}>{[riderInfo.locations.lat + ', ' + riderInfo.locations.lng]}</a></p>
          
          </div>
          <Button type='primary' danger onClick={() => deleteRider(riderIndex)}>Delete Schedule</Button></div>
      </Card>
      {mapOn && 
      <>
          <MapContainer center={[riderInfo.locations.lat, riderInfo.locations.lng]} zoom={20} scrollWheelZoom={true} style = {{height: '300px', width: '100%'}}>
              {/* <div style = {{height: '300px', width: '300px'}}></div> */}
              <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
              <MyMap setCurrLoc = {(_) => {console.log('hehe')}} startPin = {[riderInfo.locations.lat, riderInfo.locations.lng]}></MyMap>
          </MapContainer>
      </>
      }
    </div>
    </div>
    )
  }

  const didMountRef = useRef(false);

  useEffect( () => {
    const a = riders.map((obj) => {
      return getRiderInfo(obj)
    })
    const b = a.map((obj) => {
      return display(obj, a.indexOf(obj))
    })
    setCont((orig) => {
      return b
    })
  }, [])

  useEffect( didMountRef.current ? () => {
    setCont((orig) => [...orig].splice(1, orig.length))
  } : () => {
    didMountRef.current=true
  }, [riders])

  return (riders.length === 0) ? (<div>No Riders Yet</div>) : cont
}


const PeopleInfo = (props) => {

  // const [selfInfo, setSelfInfo] = useState(props.user)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mapOn, setMapOn] = useState(false)
  const [currLoc, setCurrLoc] = useState([])
  const [currDate, setCurrDate] = useState('')

  // useEffect(() => {
  //   setSelfInfo(props.user)
  // }, [])
  

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
            <DatePicker onChange={onChange} showTime={true} showSecond={false}/>
        </Space>
    </div>
)


  return ( 
  <div className="site-card-border-less-wrapper">
  <Card title="Your Info" bordered={false} style={{ width: 500 }}> 
  <div>
      <div>
      <p>Your Name: {props.user.name}</p>
      <p>Your Univeristy: {props.user.universityId}</p>
      <p>Your Pick Up Location: <a onClick={() => setMapOn((prev) => {return !prev})}>{currLoc.lat + ', ' + currLoc.lng}</a></p>
      <p>Your Capacity: {(props.user.Riders ? props.user.capacity - props.user.Riders.length : -1) + '/' + props.user.capacity}</p>
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
    // return new Promise((resolve, reject) => {
    //     resolve(
    //         {
    //             name: 'Sihang Li',
    //             universityId: 0,
    //             home: 'location',
    //             time: '8:00am',
    //             shared: true,
    //             Riders: ['john1', 'john2'],
    //             capacity: 3
    //         }
    //     )
    // })
    return axios.get('http://localhost:5000/test_person').then((res) => {
      return res.data
    }).then((res) => {
      console.log('2')
      console.log(res)
      return {
        name: res.NAME,
        universityId: 'UCSF',
        home: res['WAYPNTS'][0],
        time: res.DPRTRT,
        shared: true,
        Riders: res.PSSNGRS,
        capacity: res.DRVRCAP
      }
    })
}

useEffect(() => {
    getUserInfo(userId).then(ppl => {
        setUser((usr) => {
                return {...ppl}
            }
        )
    })
    setCurrKey(1)
},[])


  return (
    <Layout className="layout">
        <Header>
        <div className="logo" />
        <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={'1'}
            items = {[
                {key: 1, label : 'My Info'},
                {key: 2, label : 'My Riders'},
                {key: 3, label : 'My Route'}
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
          {
            {
              2: <Rider riders={user.Riders}></Rider>,
              1: <PeopleInfo user={user}></PeopleInfo>,
              3: <Route driver={user}></Route>
            }[currKey]
          }
        </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ??2018 Created by Ant UED</Footer>
    </Layout>
  )
}

export {Driver}