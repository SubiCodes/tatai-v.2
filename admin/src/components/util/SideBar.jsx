import { Box, ChevronDown, ChartArea, Menu, NotebookPen, User, Wrench, X, LogOut, Settings, MessageSquareMore, CloudAlert, Brain } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import tataiTextLogo from '../../assets/images/tataionly.png';

import { toast } from "sonner";

const Sidebar = ({ isOpen, setIsOpen }) => {
    const [activeDropdown, setActiveDropdown] = useState('');
    const [activePage, setActivePage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const dialogRef = useRef(null);

    const navItems = [
        {
            title: 'Dashboard',
            icon: ChartArea,
            link: '/dashboard'
        },
        {
            title: 'Users',
            icon: User,
            link: '/users'
        },
        {
            title: 'Guides',
            icon: NotebookPen,
            link: '/guides'
        },
        {
            title: 'Feedbacks',
            icon: MessageSquareMore,
            link: '/feedbacks'
        },
        {
            title: 'Reports',
            icon: CloudAlert,
            link: '/reports'
        },
        {
            title: 'Settings',
            icon: Settings,
            link: '/settings'
        },
        // {
        //   title: 'Settings',
        //   icon: Wrench,
        //   hasDropdown: true,
        //   dropdownItems: [
        //     { title: 'Preferences', link: '/settings/preferences' },
        //     { title: 'Security', link: '/settings/security' },
        //     { title: 'Notifications', link: '/settings/notifications' }
        //   ]
        // },
        {
            title: 'Logout',
            icon: LogOut,
            link: '/login'
        },
    ];

    useEffect(() => {
        const currentPath = location.pathname;

        // Check for /add-guide route and keep the 'Guides' active
        if (currentPath === '/add-guide' || currentPath === '/edit-guide') {
            setActivePage('Guides');
            return;
        }

        // Check main navigation items
        const mainNavItem = navItems.find(item => item.link === currentPath);
        if (mainNavItem) {
            setActivePage(mainNavItem.title);
            return;
        }

        // Check dropdown items
        for (const item of navItems) {
            if (item.hasDropdown && item.dropdownItems) {
                const dropdownItem = item.dropdownItems.find(subItem => subItem.link === currentPath);
                if (dropdownItem) {
                    setActivePage(dropdownItem.title);
                    setActiveDropdown(item.title);
                    return;
                }
            }
        }
    }, [location.pathname]);

    const closeModal = () => {
        dialogRef.current.close();
    };

    const logOut = async () => {
        try {
            await axios.post(
                `${import.meta.env.VITE_URI}/api/v1/authAdmin/cookie`, // Replace with your actual backend logout route
                {},
                { withCredentials: true }
            );
            toast.custom((t) => (
                <div
                    className="bg-success text-white px-4 py-3 rounded shadow-md flex justify-between items-center"
                    onClick={() => toast.dismiss(t)}
                >
                    <div>
                        <p className="font-semibold">Successful sign out!</p>
                    </div>
                    <button
                        className="ml-6 text-gray-200 rounded cursor-pointer"
                        onClick={() => {
                            toast.dismiss(t)
                        }}
                    >
                        <X />
                    </button>
                </div>
            ))
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error.response?.data?.message || error.message);
        }
    };

    const handleNavigation = async (link) => {
        if (link === '/login') {
            dialogRef.current.showModal();
        } else if (link) {
            navigate(link);
        }
    };

    return (
        <div
            className={`bg-white text-black transition-all duration-300 ease-in-out text-sm border-2 rounded-md border-[rgba(0,0,0,0.08)]
        ${isOpen ? 'w-64' : 'w-16'}`}
        >
            <div className={`p-4 flex items-center ${isOpen ? 'justify-between' : 'justify-center'} w-full flex items-center `}>
                <div className={`font-bold overflow-hidden transition-all duration-300 text-lg text-nowrap text-[#3B40E8] w-full flex items-center justify-center
          ${isOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
                    <img src={tataiTextLogo} alt="Tatai Logo" className={`h-auto max-w-full ${isOpen ? 'opacity-100' : 'opacity-0 w-0'}`} />
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="hover:bg-[#F3F5F7] p-2 rounded-lg hover:cursor-pointer"
                >
                    {isOpen ? <X size={20} strokeWidth={1.5} className='hover:cursor-pointer' /> : <Menu size={20} strokeWidth={1.5} className='hover:cursor-pointer' />}
                </button>
            </div>
            <nav className="mt-6">
                {navItems.map((item) => {
                    const isActive = activePage === item.title ||
                        (item.hasDropdown && item.dropdownItems?.some(subItem => activePage === subItem.title));

                    return (
                        <div key={item.title}>
                            <div
                                className={`px-4 py-3 hover:bg-[#F3F5F7] cursor-pointer flex items-center justify-between
                  ${isActive ? 'bg-[#F3F5F7]' : ''}`}
                                onClick={() => {
                                    if (item.hasDropdown && isOpen) {
                                        setActiveDropdown(activeDropdown === item.title ? '' : item.title);
                                    } else if (item.link) {
                                        handleNavigation(item.link);
                                    }
                                }}
                            >
                                <div className="flex items-center">
                                    <item.icon
                                        size={18}
                                        strokeWidth={1.5}
                                        color={isActive ? '#3B40E8' : '#000'}
                                    />
                                    <span className={`ml-4 whitespace-nowrap overflow-hidden transition-all duration-300
                    ${isOpen ? 'w-32 opacity-100' : 'w-0 opacity-0'}
                    ${isActive ? 'text-[#3B40E8] font-medium' : ''}`}
                                    >
                                        {item.title}
                                    </span>
                                </div>
                                {item.hasDropdown && isOpen && (
                                    <ChevronDown
                                        size={16}
                                        strokeWidth={1.5}
                                        className={`transition-transform duration-200 
                      ${activeDropdown === item.title ? 'rotate-180' : ''}`}
                                    />
                                )}
                            </div>

                            {item.hasDropdown && isOpen && activeDropdown === item.title && (
                                <div className="bg-[#f5f5f5] overflow-hidden transition-all duration-200">
                                    {item.dropdownItems.map((dropdownItem) => {
                                        const isDropdownItemActive = activePage === dropdownItem.title;

                                        return (
                                            <div
                                                key={dropdownItem.title}
                                                className={`px-11 py-2 hover:bg-[#f1f1f1] cursor-pointer text-sm
                          ${isDropdownItemActive ? 'bg-[#f1f1f1]' : ''}`}
                                                onClick={() => handleNavigation(dropdownItem.link)}
                                            >
                                                <span className={isDropdownItemActive ? 'text-[#3B40E8] font-medium' : ''}>
                                                    {dropdownItem.title}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>
            <dialog
                ref={dialogRef}
                className="p-6 w-96 rounded-lg bg-white shadow-lg backdrop:bg-black/50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
                <h2 className="text-xl font-semibold mb-4">Logout?</h2>
                <p className="mb-4 text-gray-600">Are you sure you want to logout?</p>
                <div className="w-full flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary hover:cursor-pointer transition duration-400">
                        Close
                    </button>
                    <button onClick={logOut} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-400 hover:cursor-pointer transition duration-400">
                        Logout
                    </button>
                </div>
            </dialog>
        </div>
    );
};

export default Sidebar;