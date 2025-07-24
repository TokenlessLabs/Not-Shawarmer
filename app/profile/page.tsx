import ProfileClient from "../user/ui/profile/profile-client";
import { getUserData } from "../user/lib/data";

export default async function ProfilePage() {
  const user = await getUserData();
  if (!user) return <div>Error</div>;
  return (
    <main className="min-h-screen p-10">
      <h1 className="text-4xl font-bold mb-12 text-theme-dark-blue">
        Your Profile
      </h1>
      <ProfileClient user={user} />
    </main>
  );
}
