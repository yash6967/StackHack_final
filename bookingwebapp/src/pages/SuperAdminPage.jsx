import { useState, useEffect } from "react";
import AccountNavigation from "./AccountNavigation";
import axios from "axios";
import { Link } from "react-router-dom";

export default function SuperAdminPage() {
    const [users, setUsers] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [requests, setRequests] = useState([]);

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
                console.log('User successfully updated');
                alert('User successfully made Admin');

                await axios.delete('/adminList/' + id);
                console.log('Admin request deleted successfully');
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

                {/* Add New User */}
                <Link
                    className="inline-flex gap-1 items-center bg-gray-100 rounded py-2 px-5 mb-4"
                    to={'/account/superAdmin/new'}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    Add New User
                </Link>
                
                <div className="mt-8">

                    <div className="my-8">
                        <h2 className="text-xl font-bold mb-4">Requests</h2>
                        
                        {requests.length > 0 ? (
                            requests.map(it => (
                                <div
                                    key={it}
                                    className="flex items-center justify-between bg-gray-200 p-4 rounded-lg mb-2">
                                    <h4 className="text-lg font-medium">
                                        UserId: {it}
                                    </h4>
                                    <div>
                                        <button
                                            onClick={() => makeAdmin(it)}
                                            className="bg-green-500 text-white py-1 px-4 rounded-lg mr-2">
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => notMakeAdmin(it)}
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
                                <Link
                                    key={it._id}
                                    to={'/account/superAdmin/' + it._id}
                                    className="block cursor-pointer bg-gray-200 p-4 rounded-lg mb-2">
                                    <h4 className="text-lg font-medium">
                                        Name: {it.name} <br />
                                        Mail: {it.email} <br />
                                        Role: {it.role}
                                    </h4>
                                </Link>
                            ))}
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-2">Admins</h3>
                            {admins.length > 0 && admins.map(it => (
                                <Link
                                    key={it._id}
                                    to={'/account/superAdmin/' + it._id}
                                    className="block cursor-pointer bg-gray-200 p-4 rounded-lg mb-2">
                                    <h4 className="text-lg font-medium">
                                        Name: {it.name} <br />
                                        Mail: {it.email} <br />
                                        Role: {it.role}
                                    </h4>
                                </Link>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
