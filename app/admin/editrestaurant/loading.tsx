export default function RestaurantSkeleton() {
    return (
        <main className="min-h-screen p-10">
            <h1 className="text-4xl font-bold mb-12 text-blue-900">Restaurant Profile</h1>

            <div className="bg-theme-light-blue shadow rounded-lg p-6 space-y-6 animate-pulse">
                {/* Name */}
                <div>
                    <label className="text-xl font-semibold text-blue-900 mb-1 block">
                        Restaurant Name
                    </label>
                    <div className="h-4 bg-gray-300 rounded w-1/8" />
                </div>

                {/* Address */}
                <div>
                    <label className="text-xl font-semibold text-blue-900 mb-1 block">Address</label>
                    <div className="h-4 bg-gray-300 rounded w-1/4" />

                </div>

                {/* About */}
                <div>
                    <label className="text-xl font-semibold text-blue-900 mb-1 block">About Us</label>
                    <div className="h-4 w-200 bg-gray-300 rounded" />
                </div>

                {/* Contact */}
                <div>
                    <label className="text-xl font-semibold text-blue-900 mb-1 block">Contact Number</label>
                    <div className="h-4 bg-gray-300 rounded w-1/8" />
                </div>

                {/* Delivery Fee */}
                <div>
                    <label className="text-xl font-semibold text-blue-900 mb-1 block">
                        Delivery Fee (Rs)
                    </label>
                    <div className="h-4 bg-gray-300 rounded w-15" />
                </div>

                {/* Operating Hours */}
                <div>
                    <label className="text-xl font-semibold text-blue-900 mb-1 block">Operating Hours</label>
                    <div className="flex gap-4">
                        <div className="h-4 bg-gray-300 rounded w-24" />
                        <div className="h-4 bg-gray-300 rounded w-24" />
                    </div>
                </div>

                {/* Button */}
                <div className="flex justify-end pt-4">
                    <div className="h-7 w-15 bg-gray-300 rounded" />
                </div>
            </div>
        </main>
    );
}
