export default function VolunteerDashboard() {
  const volunteerName =
    localStorage.getItem('HT6_volunteer_name') || 'Volunteer';
  const volunteerEmail = localStorage.getItem('HT6_volunteer_email') || '';

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-4">
          Welcome, {volunteerName}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          You have successfully logged in using your OTP. You can now scan
          hackers' NFC tags to check them in for events.
        </p>
        {volunteerEmail && (
          <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Email:</span> {volunteerEmail}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
