import Sidebar from "./ui/sidebar";
import Footer from "./ui/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen min-h-0 flex-col md:flex-row md:overflow-hidden">
      <aside className="md:w-64 w-full shrink-0">
        <Sidebar />
      </aside>

      <main className="flex-1 overflow-y-auto max-h-screen">
        <div className="min-h-screen">{children}</div>
        <Footer />
      </main>
    </div>
  );
}
