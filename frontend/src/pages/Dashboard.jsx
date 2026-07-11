import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/core/Dashboard/SideBar";
import { useSelector } from "react-redux";
import Footer from "../components/core/Footer/Footer";
import { VscMenu } from "react-icons/vsc";

export default function Dashboard() {
  const { loading: authLoading } = useSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (authLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }
  return (
    <>
      <div className="relative flex min-h-[calc(100vh-3.5rem)]">
        {/* Toggle Button for Mobile */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden fixed bottom-6 right-6 z-50 bg-yellow-50 text-richblack-900 p-3 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200"
          aria-label="Toggle Sidebar"
        >
          <VscMenu size={24} />
        </button>

        {/* Sidebar */}
        <SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        {/* Backdrop for Mobile */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
          />
        )}

        <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
          <div className="mx-auto w-11/12 max-w-[1000px] py-10 flex flex-col h-screen">
            <Outlet />
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}
