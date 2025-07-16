import AdminSidebarPage from "../ui/admindashboard/adminsidebar";

export default function Layout({ children }: {children: React.ReactNode}){
    return (
     <div className="flex h-screen min-h-0 flex-col md:flex-row md:overflow-hidden">
  <div className="w-full md:w-64">
    <AdminSidebarPage />
  </div>
  <div className="flex-grow overflow-y-auto max-h-screen">
    {children}
  </div>
</div>

    );

}
