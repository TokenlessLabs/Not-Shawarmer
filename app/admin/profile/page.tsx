import ProfileClient from "../../user/ui/profile/profile-client";

export default async function AdminProfilePage() {
  return (
    <main className="min-h-screen p-10">
      <h1 className="text-4xl font-bold mb-12 text-theme-dark-blue">
        Your Profile
      </h1>
      <ProfileClient />
    </main>
  );
}
