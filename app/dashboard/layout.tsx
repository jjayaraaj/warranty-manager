import React from 'react'
import { AppSidebar } from "@/components/app-sidebar"


import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import Header from './_components/Header'

const DashboardLayout = ({children}: {children: React.ReactNode}) => {
  return (

    <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <Header />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div>{children}</div>
      </div>
    </SidebarInset>
  </SidebarProvider>

    
  )
}

export default DashboardLayout