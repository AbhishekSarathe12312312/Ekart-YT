import React from 'react'
import { useSelector } from 'react-redux'


const All = () => {
    const {user} = useSelector((store)=>store.user)
  return (
    <div className='p-4 text-white text-2xl'>
        <h1>Users Information</h1>
        <img src={user.profilePic} alt="" />
        <p>{user.firstName}</p>
        <p>{user.lastName}</p>
        <p>{user.email}</p>
        <p>{user.phoneNo}</p>
        <p>{user.city}</p>
        <p>{user.zipCode}</p>
        <p>{user.role}</p>
        <p>{user.address}</p>
        <p>{user.createdAt}</p>
        <p>{user.updatedAt}</p>
    </div>

  )
}

export default All