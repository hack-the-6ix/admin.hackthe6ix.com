import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { categoryNames, APINames } from '@/utils/const';
import { getCandidate } from '@/utils/ht6-api';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const navigation = useNavigate();

  const submit = async () => {
    try {
      const processedCategory: string | undefined =
        selectedCategory === '' ? undefined : (
          APINames[selectedCategory as keyof typeof APINames]
        );

      const result = await getCandidate(true, processedCategory);

      if (result.message._id) {
        void navigation('/review', {
          state: { candidate: result.message, category: selectedCategory },
        });
      } else {
        alert('Error, request failed');
      }
    } catch (error) {
      alert(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative dark:bg-slate-600">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-500 hover:text-slate-900 text-lg dark:text-white dark:hover:text-slate-900"
        >
          ×
        </button>
        <h2 className="text-lg font-bold text-slate-900 mb-2 dark:text-white">
          Begin Review
        </h2>
        <div>
          <p className="text-sm text-slate-800 mb-3  dark:text-white">
            Select a category
          </p>
          <div className="flex items-center space-x-4">
            <select
              id="review-category"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
              }}
              className="flex-1 w-full border border-slate-300 dark:border-white rounded-md p-2 mb-4 focus:ring-primary focus:border-primary dark:bg-slate-500"
            >
              <option value="">No Preference</option>
              {Object.keys(categoryNames).map((key) => (
                <option value={key} key={key}>
                  {categoryNames[key as keyof typeof categoryNames]}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => {
              void submit();
            }}
            className="w-full py-2 px-4 text-white font-medium rounded-md bg-primary hover:bg-primary-dark dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
