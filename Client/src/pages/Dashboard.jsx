import React, { useState } from 'react';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import FilterButton from '../components/DropdownFilter';
import Datepicker from '../components/Datepicker';
import DashboardCard01 from '../partials/dashboard/DashboardCard01';
import DashboardCard02 from '../partials/dashboard/DashboardCard02';
import DashboardCard03 from '../partials/dashboard/DashboardCard03';
import DashboardCard04 from '../partials/dashboard/DashboardCard04';
// import DashboardCard05 from '../partials/dashboard/DashboardCard05';
// import DashboardCard06 from '../partials/dashboard/DashboardCard06';
// import DashboardCard07 from '../partials/dashboard/DashboardCard07';
import DashboardCard08 from '../partials/dashboard/DashboardCard08';
import DashboardCard09 from '../partials/dashboard/DashboardCard09';
import DashboardCard10 from '../partials/dashboard/DashboardCard10';
import DashboardCard11 from '../partials/dashboard/DashboardCard11';
// import DashboardCard12 from '../partials/dashboard/DashboardCard12';
// import DashboardCard13 from '../partials/dashboard/DashboardCard13';
import Banner from '../partials/Banner';
import { Outlet } from 'react-router-dom';

function Dashboard() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{backgroundColor:'#f3f4f6'}}>

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div>

            {/* Dashboard actions */}
            <div className="sm:flex sm:justify-between sm:items-center">

              {/* Left: Title */}
              {/* <div>
                <h1 className=" fs-2 text-xl md:text-xl text-gray-800 dark:text-gray-100 font-bold mb-2">Dashboard</h1>
              </div> */}


              {/* Right: Actions */}
              {/* <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2"> */}
                {/* Filter button */}
                {/* <FilterButton align="right" /> */}
                {/* Datepicker built with React Day Picker */}
                {/* <Datepicker align="right" /> */}
                {/* Add view button */}
                {/* <button className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"> */}
                  {/* <svg className="fill-current shrink-0 xs:hidden" width="16" height="16" viewBox="0 0 16 16"> */}
                    {/* <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" /> */}
                  {/* </svg> */}
                  {/* <span className="max-xs:sr-only">Add View</span> */}
                {/* </button>                 */}
              {/* </div> */}

            </div>


            {/* Cards */}
            <div>
            {location.pathname === '/e-commerce-project' && (
              <div>
              <div  className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
                <h1 className=" fs-2 text-xl md:text-xl text-gray-800 dark:text-gray-100 font-bold">Dashboard</h1>
              </div>
              <div className="grid grid-cols-12 gap-3 ms-5 me-5">
              <DashboardCard01 />
              <DashboardCard02 />
              <DashboardCard03 />
              <DashboardCard04 />
              <DashboardCard08 />
              <DashboardCard09 />  
              <DashboardCard10 />
              <DashboardCard11 />
              </div>
              </div>
             
)}
            </div>

          </div>
        </main>
        <Outlet/>
        <Banner />

      </div>
    </div>
  );
}

export default Dashboard;