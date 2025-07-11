import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import PageLoader from '../../components/page-loader';
import { User } from '@/utils/ht6-api';

interface Participant {
  user: User & {
    checkIns: {
      event: {
        name: string;
        start: string; // "2025-07-18T21:00:00.000Z"
        end: string;
      };
      checkIns: string[]; // ISO string
    }[];
  }
}


export default function ParticipantDetail() {
  const { nfcId } = useParams();
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime] = useState(new Date());

  const apiBaseURL = import.meta.env.VITE_API_HOST;

  const getEventStatus = (start: string, end: string) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    
    if (currentTime < startTime) return 'upcoming';
    if (currentTime >= startTime && currentTime <= endTime) return 'ongoing';
    return 'ended';
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const checkInFromNFC = async (nfcId: string, checkInEvent: string) => {
    const response = await fetch(`${apiBaseURL}/nfc/checkInFromNFC`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nfcId,
        checkInEvent,
      }),
    });
  
    if (!response.ok) {
      throw new Error('Failed to update check-in status');
    }
  
    return response.json();
  };

  const removeLastCheckIn = async (nfcId: string, checkInEvent: string) => {
    const response = await fetch(`${apiBaseURL}/nfc/removeLastCheckIn`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nfcId,
        checkInEvent,
      }),
    });
  
    if (!response.ok) {
      throw new Error('Failed to remove last check-in');
    }
  
    return response.json();
  };

  // checkIns?: {
  //   event: {
  //     name: string;
  //     start: string; // "2025-07-18T21:00:00.000Z"
  //     end: string;
  //   };
  //   checkIns: string[]; // ISO string
  // }[];

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

  useEffect(() => {
    // replace with actual check later
    const isVolunteer = true;
    if (!isVolunteer) {
      if (participant?.user.hackerApplication?.linkedinLink) {
        window.location.href = participant.user.hackerApplication.linkedinLink;
      } else {
        window.location.href = 'https://hackthe6ix.com';
      }
    } 
  }, [nfcId, participant]);



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
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="bg-white shadow-sm border border-slate-200 rounded-lg p-6 max-w-prose w-full mx-auto">
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
            {participant.user.checkIns && participant.user.checkIns
              .sort((a, b) => new Date(a.event.start).getTime() - new Date(b.event.start).getTime())
              .map((checkIn) => {

              const hasCheckedIn = checkIn.checkIns.length > 0;

              return (
              <div key={checkIn.event.name} className="p-3 border rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="capitalize font-medium">{checkIn.event.name.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <div className="flex gap-2">
                    {hasCheckedIn && (
                      <button
                        onClick={async () => {
                          try {
                            await removeLastCheckIn(nfcId!, checkIn.event.name);
                            setParticipant(prev => prev ? {
                              ...prev,
                              user: {
                                ...prev.user,
                                checkIns: prev.user.checkIns.map(ci => 
                                  ci.event.name === checkIn.event.name 
                                    ? { ...ci, checkIns: ci.checkIns.slice(0, -1) }
                                    : ci
                                )
                              }
                            } : null);
                          } catch (err) {
                            setError('Failed to remove last check-in');
                          }
                        }}
                        className="px-3 py-2 rounded text-sm bg-red-500 text-white hover:bg-red-600 transition-colors"
                      >
                        Remove Last
                      </button>
                    )}
                    <button
                      onClick={async () => {
                        try {
                          // returns ISO string
                          const newCheckIn: string = await checkInFromNFC(nfcId!, checkIn.event.name);
                          setParticipant(prev => prev ? {
                            ...prev,
                            user: {
                              ...prev.user,
                              checkIns: [
                                ...prev.user.checkIns,
                                {
                                  event: checkIn.event,
                                  checkIns: [...checkIn.checkIns, newCheckIn]
                                }
                              ]
                            }
                          } : null);
                        } catch (err) {
                          setError('Failed to update check-in status');
                        }
                      }}
                      className={`px-4 py-2 rounded text-sm ${
                        checkIn.checkIns.length > 0 
                          ? 'bg-green-500 text-white hover:bg-green-600' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      } transition-colors`}
                    >
                      {hasCheckedIn ? `Checked In (${checkIn.checkIns.length})` : 'Not Checked In'}
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-500 flex gap-4">
                  <span className={`px-2 py-1 rounded ${getEventStatus(checkIn.event.start, checkIn.event.end) === 'ended' ? 'bg-red-100 text-red-700' : getEventStatus(checkIn.event.start, checkIn.event.end) === 'ongoing' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    Start: {formatTime(checkIn.event.start)}
                  </span>
                  <span className={`px-2 py-1 rounded ${getEventStatus(checkIn.event.start, checkIn.event.end) === 'ended' ? 'bg-red-100 text-red-700' : getEventStatus(checkIn.event.start, checkIn.event.end) === 'ongoing' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    End: {formatTime(checkIn.event.end)}
                  </span>
                </div>
                {hasCheckedIn && (
                  <div className="text-xs text-gray-500 mt-2">
                    Most Recent: {formatTime(checkIn.checkIns[checkIn.checkIns.length - 1])}
                  </div>
                )}
              </div>
            )})}
          </div>
        </div>
      </div>
    </div>
  );
} 