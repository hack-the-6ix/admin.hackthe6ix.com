import { useNavigate } from 'react-router';

export default function RoleSelect() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-100 dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md flex flex-col gap-6 items-center">
        <h1 className="text-3xl font-bold text-primary mb-4">
          Select Your Role
        </h1>
        <button
          className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-lg font-semibold w-64"
          onClick={() => navigate('/auth/login')}
        >
          Log in as Organizer
        </button>
        <button
          className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg text-lg font-semibold w-64"
          onClick={() => {
            '/auth/volunteer';
          }}
        >
          Log in as Volunteer
        </button>
      </div>
    </div>
  );
}
