
export default function Unauthorized() {
  return (
    <div className="h-screen flex items-center justify-center flex-col">
      <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
      <p className="text-gray-600">You don’t have permission to view this page.</p>
    </div>
  );
}
