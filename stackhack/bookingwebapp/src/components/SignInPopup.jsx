// SignInPopup.js
import React, { useState } from 'react';

const SignInPopup = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handlePopupOpen = () => {
        setIsPopupOpen(true);
    };

    const handlePopupClose = () => {
        setIsPopupOpen(false);
        setRole('');
        setEmail('');
        setPassword('');
    };

    const handleRoleSelect = (role) => {
        setRole(role);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') setEmail(value);
        if (name === 'password') setPassword(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic based on role here
        console.log('Role:', role);
        console.log('Email:', email);
        console.log('Password:', password);
        handlePopupClose();
    };

    return (
        <div>
            <button
                onClick={handlePopupOpen}
                className="bg-blue-500 text-white p-2 rounded-md"
            >
                Sign In
            </button>

            {isPopupOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-md w-1/3 relative">
                        <button
                            onClick={handlePopupClose}
                            className="absolute top-2 right-2 p-1 bg-gray-200 rounded-full"
                        >
                            <span className="text-xl">x</span>
                        </button>
                        {!role ? (
                            <>
                                <h2 className="text-xl mb-4">Select Your Role</h2>
                                <button
                                    onClick={() => handleRoleSelect('user')}
                                    className="bg-blue-500 text-white p-2 rounded-md w-full mb-2"
                                >
                                    User
                                </button>
                                <button
                                    onClick={() => handleRoleSelect('admin')}
                                    className="bg-green-500 text-white p-2 rounded-md w-full"
                                >
                                    Admin
                                </button>
                            </>
                        ) : (
                            <div>
                                <button
                                    onClick={() => setRole('')}
                                    className="bg-gray-300 text-black p-2 rounded-md mb-4"
                                >
                                    Back
                                </button>
                                <form onSubmit={handleSubmit}>
                                    <h2 className="text-xl mb-4">Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}</h2>
                                    <input
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={handleInputChange}
                                        className="p-2 border rounded-md w-full mb-4"
                                        placeholder="Email"
                                        required
                                    />
                                    <input
                                        type="password"
                                        name="password"
                                        value={password}
                                        onChange={handleInputChange}
                                        className="p-2 border rounded-md w-full mb-4"
                                        placeholder="Password"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white p-2 rounded-md"
                                    >
                                        Sign In
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SignInPopup;
