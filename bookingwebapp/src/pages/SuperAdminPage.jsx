import { useState, useEffect } from "react";
import AccountNavigation from "./AccountNavigation";
import axios from "axios";
import { Link } from "react-router-dom";

export default function SuperAdminPage() {
    const [users, setUsers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [requests, setRequests] = useState([]);
    const [errors, setErrors] = useState({});
    const [requestDetails, setRequestDetails] = useState([]);


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

    useEffect(() => {
        axios.get('/adminList').then(({ data }) => {
            setRequests(data.requestList);
        }).catch(error => {
            console.error('Error fetching admin requests:', error);
        });
    }, []);

    useEffect(() => {
        axios.get('/adminList').then(async ({ data }) => {
            const requestList = data.requestList;
            const details = await Promise.all(requestList.map(async (id) => {
                try {
                    const response = await axios.get(`/getUser/${id}`);
                    return response.data;
                } catch (error) {
                    console.error(`Error fetching user details for ID ${id}:`, error);
                    return { id, name: 'Unknown', email: 'Unknown' };
                }
            }));
            setRequestDetails(details);
        }).catch(error => {
            console.error('Error fetching admin requests:', error);
        });
    }, []);
    

    const toggleRole = async (user) => {
        const newRole = user.role === 'admin' ? 'customer' : 'admin';
        const userData = {
            name: user.name,
            email: user.email,
            role: newRole,
        };

        try {
            await axios.put('/updateUser/' + user._id, userData);
            alert(`User successfully updated to ${newRole}`);
            // Update the state to reflect the role change
            const updatedUsers = users.map(it => 
                it._id === user._id ? { ...it, role: newRole } : it
            );
            setUsers(updatedUsers);
            // Separate updated users into customers and admins
            setCustomers(updatedUsers.filter(it => it.role === 'customer'));
            setAdmins(updatedUsers.filter(it => it.role === 'admin'));
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update the user');
        }
    };

    async function makeAdmin(id) {
        try {
            const response = await axios.get('/getUser/' + id);
            const { data } = response;

            const userData = {
                name: data.name,
                email: data.email,
                role: 'admin'
            };

            if (id) {
                await axios.put('/updateUser/' + id, userData);
                alert('User successfully made Admin');

                await axios.delete('/adminList/' + id);
            }

        } catch (error) {
            console.error('Error processing request:', error);
            alert('Failed to process request');
        }
    }

    async function notMakeAdmin(id) {
        try {
            await axios.delete('/adminList/' + id);
            alert('Denied request to make admin');
        } catch (error) {
            console.error('Error denying request:', error);
            alert('Failed to deny request');
        }
    }

    return (
        <div>

            <AccountNavigation />

            <div className="text-center mt-4">

              
                
                <div className="mt-8">

                    <div className="my-8">
                            <h2 className="text-xl font-bold mb-4">Requests</h2>
                            
                            {requestDetails.length > 0 ? (
                                requestDetails.map((user) => (
                                    <div
                                        key={user._id}
                                        className="flex items-center justify-between bg-gray-200 p-4 rounded-lg mb-2">
                                        <div>
                                            <h4 className="text-lg font-medium">
                                                Name: {user.name} <br />
                                                Email: {user.email} <br />
                                                UserId: {user._id}
                                            </h4>
                                        </div>
                                        <div>
                                            <button
                                                onClick={() => makeAdmin(user._id)}
                                                className="bg-green-500 text-white py-1 px-4 rounded-lg mr-2">
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => notMakeAdmin(user._id)}
                                                className="bg-red-500 text-white py-1 px-4 rounded-lg">
                                                Decline
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <span className="font-light">No active requests</span>
                            )}
                        </div>

                    <h2 className="text-xl font-bold mb-4">Users</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Customers</h3>
                            {customers.length > 0 && customers.map(it => (
                                <div
                                    key={it._id}
                                    className="block cursor-pointer bg-gray-200 p-4 rounded-lg mb-2">
                                    <h4 className="text-lg font-medium">
                                        Name: {it.name} <br />
                                        Mail: {it.email} <br />
                                        Role: {it.role}
                                    </h4>
                                    <button
                                        onClick={() => toggleRole(it)}
                                        className="bg-blue-500 text-white py-1 px-4 rounded-lg mt-2">
                                        Switch to {it.role === 'admin' ? 'Customer' : 'Admin'}
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-2">Admins</h3>
                            {admins.length > 0 && admins.map(it => (
                                <div
                                    key={it._id}
                                    className="block cursor-pointer bg-gray-200 p-4 rounded-lg mb-2">
                                    <h4 className="text-lg font-medium">
                                        Name: {it.name} <br />
                                        Mail: {it.email} <br />
                                        Role: {it.role}
                                    </h4>
                                    <button
                                        onClick={() => toggleRole(it)}
                                        className="bg-blue-500 text-white py-1 px-4 rounded-lg mt-2">
                                        Switch to {it.role === 'admin' ? 'Customer' : 'Admin'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
