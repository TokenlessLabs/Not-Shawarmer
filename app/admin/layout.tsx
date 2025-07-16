import AdminSidebarPage from "./ui/dashboard/admindashboard/adminsidebar";
import Footer from "../ui/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen min-h-0 flex-col md:flex-row md:overflow-hidden">
      <div className="w-full md:w-64">
        <AdminSidebarPage />
      </div>
      <div className="flex-grow overflow-y-auto max-h-screen">
        <div className="min-h-screen">{children}</div>
        <Footer />
      </div>
    </div>
  );
}
