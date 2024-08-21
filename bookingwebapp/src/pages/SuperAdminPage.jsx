import { useState,useEffect } from "react";
import AccountNavigation from "./AccountNavigation";
import axios from "axios";
import {Link,Navigate, useParams} from "react-router-dom";


export default function SuperAdminPage(){
    const [users,setUsers] = useState([]);
    const [customers,setCustomers] = useState([]);
    const [admins,setAdmins] = useState([]);
    const [requests,setRequests] = useState([]);
    const [name,setName] = useState('');
    const [role,setRole] = useState('');
    const [email,setEmail] = useState('');
    useEffect(() => {
        axios.get('/getAllUsers').then(({ data }) => {
            setUsers(data);
    
            // Separate arrays to hold customers and admins
            const customersList = [];
            const adminsList = [];
    
            data.forEach((it) => {
                if (it.role === 'customer') {
                    customersList.push(it);
                } else if (it.role === 'admin') {
                    adminsList.push(it);
                }
            });
    
            // Update state with the filtered arrays
            setCustomers(customersList);
            setAdmins(adminsList);
        }).catch(error => {
            console.error('Error fetching users:', error);
        });
    }, []);
    useEffect(()=>{
        axios.get('/adminList').then(({data})=>{
            setRequests(data.requestList);
        })
    },[])

    async function makeAdmin(id){
        try {
            // Fetch user data
            const response = await axios.get('/getUser/' + id);
            const { data } = response;
            
            // Construct userData directly from the response
            const userData = {
                name: data.name,
                email: data.email,
                role: 'admin'
            };
    
            if (id) {
                // Update user
                try {
                    await axios.put('/updateUser/' + id, userData);
                    console.log('User successfully updated');
               
                    alert('User successfully made Admin');
                } catch (error) {
                    console.error('Error updating User:', error);
                    alert('Failed to update this User');
                }
            }
    
            // Delete from admin request list
            try {
                await axios.delete('/adminList/' + id);
                console.log('Admin request deleted successfully');
            } catch (error) {
                console.error('Error deleting admin request:', error);
                alert('Failed to delete admin request');
            }
    
        } catch (error) {
            console.error('Error fetching user:', error);
            alert('Failed to fetch user data');
        }

    }
    
    async function notMakeAdmin(id){
        await axios.delete('/adminList/'+id);
        alert('Aenied request to made admin');

    }

    

    return(
        <div>
            <AccountNavigation/>

            <div className="grid grid-cols-2 ">

                <div className="mt-4 mr-2">
                    <label>Customers</label>
                    {customers.length > 0 && customers.map(it => (
                            <Link
                                key={it._id}
                                to = {'/account/superAdmin/'+ it._id} 
                                className="flex cursor-pointer gap-4 bg-gray-200 p-4">       
                                <h2 className="text-xl">
                                    User: {it.name} <br /> 
                                    Role: {it.role}<br/>
                                    Id: {it._id}
                                </h2>
                            </Link>
                        ))}
                </div>

                <div className="mt-4 ml-2">
                <label>Admins</label>
                    {admins.length > 0 && admins.map(it => (
                            <Link
                                key={it._id}
                                to = {'/account/superAdmin/'+ it._id} 
                                className="flex cursor-pointer gap-4 bg-gray-200 p-4">       
                                <h2 className="text-xl">
                                    User: {it.name} <br /> 
                                    Role: {it.role}
                                </h2>
                            </Link>
                        ))}
                </div>

            </div>
            <div>
            <label>Requests</label>
            {requests.length > 0 && requests.map(it => (
                            <div
                                key={it}
                                className="flex cursor-pointer gap-4 bg-gray-200 p-4">       
                                <h2 className="text-xl">
                                    UserId: {it} <br /> 
                                </h2>
                                <button onClick={()=>{makeAdmin(it)}}> Accept request</button>
                                <button onClick={()=>{notMakeAdmin(it)}}> Decline request</button>
                            </div>
                        ))}
            </div>
        </div>
    )

}