import React, { useState } from "react";
import { FaFileUpload, FaBars } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import {
  BsFillEnvelopeArrowUpFill,
  BsFillEnvelopeArrowDownFill,
} from "react-icons/bs";
import { NavLink } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  const toggleContact = () => setIsContactOpen(!isContactOpen);

  const menuItem = [
  
    {
      path: "/AdminDashboard" ,
      name: "Tableau de bord",
      icon: <RxDashboard />,
    },
    {
      path: "/Settings",
      name: "Paramètres",
      icon: <IoSettingsOutline />,
    },
    {
      path: "/EnregistrerUnCourrier",
      name: "Enregistrer Un Courrier",
      icon: <FaFileUpload />,
    },
    {
      path: "/CourriersDepart",
      name: "Courriers Depart",
      icon: <BsFillEnvelopeArrowUpFill />,
    },
    {
      path: "/CourriersArrives",
      name: "Courriers Arrives",
      icon: <BsFillEnvelopeArrowDownFill />,
    },
    {
      name: "Contact",
      icon: isContactOpen ? <FiChevronDown /> : <FiChevronRight />,
      subItems: [
        {
          path: "/AjouterUser",
          name: "Ajouter User",
        },
        {
          path: "/ListeContacts",
          name: "Liste Contacts",
        },
      ],
    },
  ];

  return (
    <div className="flex">
      <div
        className={`bg-[#00AEEF] text-white h-screen transition-all duration-500 ${
          isOpen ? "w-90" : "w-20"
        }`}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            {isOpen && (
              <h1 className="text-2xl font-bold ml-2">EcourrierBMT</h1>
            )}
          </div>
          <FaBars onClick={toggle} className="text-2xl cursor-pointer" />
        </div>
        {menuItem.map((item, index) => (
          <div key={index}>
            <NavLink
              to={item.path || "#"}
              onClick={item.subItems ? toggleContact : undefined}
              className={({ isActive }) =>
                `flex items-cente text-red px-3 py-2 gap-2 hover:bg-white hover:text-black transition-all duration-500 ${
                  isActive ? "bg-white text-black rounded-lg shadow-md" : ""
                }`
              }
            >
              <div className="text-lg">{item.icon}</div>
              {isOpen && <div>{item.name}</div>}
            </NavLink>

            {/* Render sub-items if any */}
            {isOpen && item.subItems && isContactOpen && (
              <div className="ml-8">
                {item.subItems.map((subItem, subIndex) => (
                  <NavLink
                  to={subItem.path}
                  key={subIndex}
                  className={({ isActive }) =>
                    `flex items-center text-red-950 x-3 py-2 gap-2 hover:bg-white hover:text-black transition-all duration-500 ${
                      isActive ? " text-black rounded-lg shadow-md" : ""
                    }`
                  }
                >
                  {subItem.name}
                </NavLink>
                
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <main className="w-full p-4">{children}</main>
    </div>
  );
};

export default Sidebar;
