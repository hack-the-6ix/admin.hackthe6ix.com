import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import PageLoader from '../../components/page-loader';

interface CheckIns {
  hackerCheckIn: boolean;
  lunchOne: boolean;
  dinnerOne: boolean;
  eventOne: boolean;
  snackOne: boolean;
  lunchTwo: boolean;
  dinnerTwo: boolean;
}

interface Participant {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    checkInTime?: number;
    checkIns: CheckIns;
  }
}


export default function ParticipantDetail() {
  const { nfcId } = useParams();
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiBaseURL = "http://localhost:3000";

  const updateCheckInField = async (nfcId: string, checkInEvent: string, value: boolean) => {
    const response = await fetch(`${apiBaseURL}/nfc/updateCheckInsFromNFC`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nfcId,
        checkInEvent,
        value,
      }),
    });
  
    if (!response.ok) {
      throw new Error('Failed to update check-in status');
    }
  
    return response.json();
  };

  useEffect(() => {
    const fetchParticipant = async () => {
      try {
        const response = await fetch(`${apiBaseURL}/nfc/getUser/${nfcId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Participant not found');
        }

        const data = await response.json();
        console.log(data);
        setParticipant(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load participant data');
      } finally {
        setLoading(false);
      }
    };

    void fetchParticipant();
  }, [nfcId]);

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="container flex items-center justify-center h-dvh mx-auto px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-prose w-full">
          <p className="text-red-700 text-center">{error}</p>
        </div>
      </div>
    );
  }

  if (!participant) {
    return (
      <div className="container flex items-center justify-center h-dvh mx-auto px-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-prose w-full">
          <p className="text-yellow-700 text-center">No participant found with this NFC ID</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container flex items-center justify-center h-dvh mx-auto px-4">
      <div className="bg-white shadow-sm border border-slate-200 rounded-lg p-6 max-w-prose w-full">
        <h1 className="text-2xl font-bold mb-4">
          {participant.user.firstName} {participant.user.lastName}
        </h1>
        {participant.user.email && (
          <p className="text-gray-600 mb-2">{participant.user.email}</p>
        )}
        <div className="text-sm text-gray-500 mb-6">
          ID: {participant.user._id}
          {participant.user.checkInTime && (
            <div>Check-in Time: {new Date(participant.user.checkInTime).toLocaleString()}</div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Check-in Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {participant.user.checkIns && Object.entries(participant.user.checkIns).map(([event, checked]) => (
              <div key={event} className="flex items-center justify-between p-3 border rounded">
                <span className="capitalize">{event.replace(/([A-Z])/g, ' $1').trim()}</span>
                <button
                  onClick={async () => {
                    try {
                      await updateCheckInField(nfcId!, event, !checked);
                      setParticipant(prev => prev ? {
                        ...prev,
                        user: {
                          ...prev.user,
                          checkIns: {
                            ...prev.user.checkIns,
                            [event]: !checked
                          }
                        }
                      } : null);
                    } catch (err) {
                      setError('Failed to update check-in status');
                    }
                  }}
                  className={`px-4 py-2 rounded ${
                    checked 
                      ? 'bg-green-500 text-white hover:bg-green-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } transition-colors`}
                >
                  {checked ? 'Checked' : 'Not Checked'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 