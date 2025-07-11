import React, { useState, useEffect } from 'react';
import {
  generateOTP,
  getAllOTPs,
  expireOTP,
  OTP,
  getExternalUsers,
  ExternalUser,
} from '@/utils/ht6-api';
import Button from '@/components/button';
import AlertPopup from '@/components/alert-popup';
import { FaUsers, FaKey } from 'react-icons/fa';

export default function Volunteers() {
  const [otps, setOtps] = useState<OTP[]>([]);
  const [volunteers, setVolunteers] = useState<ExternalUser[]>([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState<ExternalUser[]>(
    [],
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingVolunteers, setIsLoadingVolunteers] = useState(false);
  const [generatingOTPFor, setGeneratingOTPFor] = useState<string | null>(null);

  const showAlertMessage = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const loadOTPs = async () => {
    try {
      const response = await getAllOTPs();
      setOtps(response.message.otps);
    } catch (error) {
      console.error('Failed to load OTPs:', error);
    }
  };

  const loadVolunteers = async () => {
    setIsLoadingVolunteers(true);
    try {
      const response = await getExternalUsers();
      const volunteerUsers = response.message.filter((user: ExternalUser) =>
        user.discord?.additionalRoles?.includes('volunteer'),
      );
      setVolunteers(volunteerUsers);
      setFilteredVolunteers(volunteerUsers);
    } catch (error) {
      console.error('Failed to load volunteers:', error);
      showAlertMessage('Failed to load volunteers');
    } finally {
      setIsLoadingVolunteers(false);
    }
  };

  useEffect(() => {
    loadOTPs();
    loadVolunteers();
  }, []);

  useEffect(() => {
    const filtered = volunteers.filter((volunteer) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (volunteer.firstName &&
          volunteer.firstName.toLowerCase().includes(searchLower)) ||
        (volunteer.lastName &&
          volunteer.lastName.toLowerCase().includes(searchLower)) ||
        (volunteer.email &&
          volunteer.email.toLowerCase().includes(searchLower)) ||
        (volunteer.discord?.username &&
          volunteer.discord.username.toLowerCase().includes(searchLower))
      );
    });
    setFilteredVolunteers(filtered);
  }, [searchTerm, volunteers]);

  const handleGenerateOTPForVolunteer = async (volunteer: ExternalUser) => {
    if (!volunteer.email) {
      showAlertMessage('Volunteer does not have an email address');
      return;
    }

    setGeneratingOTPFor(volunteer._id);
    try {
      const response = await generateOTP(volunteer.email);
      showAlertMessage(
        `OTP generated for ${volunteer.firstName} ${volunteer.lastName}: ${response.message.code}`,
      );
      await loadOTPs();
    } catch (error) {
      showAlertMessage('Failed to generate OTP');
    } finally {
      setGeneratingOTPFor(null);
    }
  };

  const handleExpireOTP = async (otpId: string) => {
    try {
      await expireOTP(otpId);
      showAlertMessage('OTP expired successfully');
      await loadOTPs();
    } catch (error) {
      showAlertMessage('Failed to expire OTP');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (otp: OTP) => {
    if (otp.used) return 'text-green-600';
    if (new Date(otp.expiration) < new Date()) return 'text-red-600';
    return 'text-blue-600';
  };

  const getStatusText = (otp: OTP) => {
    if (otp.used) return 'Used';
    if (new Date(otp.expiration) < new Date()) return 'Expired';
    return 'Active';
  };

  return (
    <div className="p-6">
      <div className="">
        <h1 className="text-3xl font-bold text-primary mb-6">
          Volunteer Management
        </h1>

        <div className="bg-white dark:bg-slate-800 rounded-t-lg p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Search Volunteers</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {filteredVolunteers.length} of {volunteers.length} volunteers
            </div>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or Discord username..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-slate-700 dark:text-white"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-b-lg shadow-md mb-8">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Volunteers</h2>
        </div>
        <div className="overflow-x-auto">
          {isLoadingVolunteers ?
            <div className="px-6 py-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Loading volunteers...
              </p>
            </div>
          : <>
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Discord
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Check-in Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Notes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredVolunteers?.map(
                    (volunteer) =>
                      volunteer && (
                        <tr
                          key={volunteer._id}
                          className="hover:bg-gray-50 dark:hover:bg-slate-700"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {volunteer.firstName || ''}{' '}
                                  {volunteer.lastName || ''}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {volunteer.email || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                volunteer.status?.checkedIn ?
                                  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                              }`}
                            >
                              {volunteer.status?.checkedIn ?
                                'Checked In'
                              : 'Not Checked In'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {volunteer.discord?.username || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {volunteer.checkInTime ?
                              new Date(volunteer.checkInTime).toLocaleString()
                            : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {volunteer.notes || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Button
                              onClick={() =>
                                handleGenerateOTPForVolunteer(volunteer)
                              }
                              disabled={
                                generatingOTPFor === volunteer._id ||
                                !volunteer.email
                              }
                              className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                              {generatingOTPFor === volunteer._id ?
                                'Generating...'
                              : 'Generate OTP'}
                            </Button>
                          </td>
                        </tr>
                      ),
                  )}
                </tbody>
              </table>
              {(!filteredVolunteers || filteredVolunteers.length === 0) && (
                <div className="px-6 py-12 text-center">
                  <div className="text-gray-400 dark:text-gray-500 mb-2">
                    <FaUsers className="mx-auto h-12 w-12" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                    {searchTerm ? 'No Volunteers Found' : 'No Volunteers Found'}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchTerm ?
                      'Try adjusting your search terms'
                    : 'No volunteers have been registered yet'}
                  </p>
                </div>
              )}
            </>
          }
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">OTP History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Expires
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Issued By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Used By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Used At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
              {otps.map((otp) => (
                <tr
                  key={otp.id}
                  className="hover:bg-gray-50 dark:hover:bg-slate-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                    {otp.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {otp.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`text-sm font-medium ${getStatusColor(otp)}`}
                    >
                      {getStatusText(otp)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatDate(otp.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatDate(otp.expiration)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {otp.issuedBy || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {otp.usedName || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {otp.usedAt ? formatDate(otp.usedAt) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {!otp.used && new Date(otp.expiration) > new Date() && (
                      <Button
                        onClick={() => handleExpireOTP(otp.id)}
                        className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700"
                      >
                        Expire
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {otps.length === 0 && (
            <div className="px-6 py-12 text-center">
              <div className="text-gray-400 dark:text-gray-500 mb-2">
                <FaKey className="mx-auto h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                No OTPs Generated
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Generate an OTP for a volunteer to get started
              </p>
            </div>
          )}
        </div>
      </div>

      {showAlert && <AlertPopup message={alertMessage} />}
    </div>
  );
}
