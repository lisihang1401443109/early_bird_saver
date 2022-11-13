import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"

const People = () => {

    const userId = useParams()
    const [user, setUser] = useState([])

    const getUserInfo = (id) => {
        return new Promise((resolve, reject) => {
            resolve(
                {
                    name: 'Sihang Li',
                    universityId: 0,
                    home: 'location',
                    time: '8:00am',
                    shared: false
                }
            )
        })
    }

    useEffect(() => {
        setUser(
            getUserInfo(userId)
        )
    }, [])
    
    return (
        <div>
            This is People
        </div>
    )
}

export {People}