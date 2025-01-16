import React, { useState } from 'react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedAmount, setSelectedAmount] = useState<string>(1);

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
            Select a category and amount to review
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
              <option value="">I want to only grade...</option>
              <option value="math">Math</option>
              <option value="science">Science</option>
              <option value="english">English</option>
            </select>
            <select
              value={selectedAmount}
              onChange={(e) => {
                setSelectedAmount(e.target.value);
              }}
              className="w-20 border dark:border-white border-slate-300 rounded-md p-2 mb-4 focus:ring-primary focus:border-primary dark:bg-slate-500"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
          <button
            onClick={() => {
              alert('Review started!');
            }}
            disabled={!selectedCategory}
            className={`w-full py-2 px-4 text-white font-medium rounded-md ${
              selectedCategory ?
                'bg-primary hover:bg-primary-dark dark:bg-slate-800 dark:hover:bg-slate-700'
              : 'bg-slate-300 cursor-not-allowed dark:bg-slate-700'
            }`}
          >
            Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
