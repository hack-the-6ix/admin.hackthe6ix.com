import { useLocation } from 'react-router-dom';
import { User } from '@/utils/ht6-api';
import {
  maxPerCategory,
  categoryNames,
  ratingScale,
  ratingColors,
} from '@/utils/const';
import { useState } from 'react';
import QuestionBox from '@/components/questionBox';
import FullProfile from './fullProfile';
import Profile from './profile';
import { gradeCandidate } from '@/utils/ht6-api';
import { useNavigate } from 'react-router-dom';

interface ReviewPageState {
  candidate: User;
  category: string;
}

const ReviewPage = () => {
  const location = useLocation();
  const { candidate, category } = location.state as ReviewPageState;
  const [toggleProfile, setToggleProfile] = useState<boolean>(false);
  const [showName, setShowName] = useState<boolean>(false);
  const [selectedRating, setSelectedRating] = useState<number>(3);
  const [notes, setNotes] = useState<string>('');
  const navigation = useNavigate();

  console.log(candidate);
  const getCategory = (): string | undefined => {
    const result = Object.entries(candidate.internal.applicationScores).find(
      ([, data]) => data.score === -1,
    );
    let unreviewedCategory = result ? result[0] : 'project';
    if (unreviewedCategory === 'portfolio') {
      unreviewedCategory = 'portfolioLink';
    }
    if (unreviewedCategory === 'whyHT6') {
      unreviewedCategory = 'whyHT6Essay';
    }
    if (unreviewedCategory === 'creativeResponse') {
      unreviewedCategory = 'creativeResponseEssay';
    }
    return category == '' ? unreviewedCategory : category;
  };

  const parsedCategory = getCategory();
  const maxScore: number =
    parsedCategory ?
      maxPerCategory[parsedCategory as keyof typeof maxPerCategory]
    : 4;

  const getResponse = (): string => {
    if (parsedCategory === 'creativeResponseEssay') {
      return (
        candidate.hackerApplication?.creativeResponseEssay ??
        'No response provided'
      );
    } else if (parsedCategory === 'whyHT6Essay') {
      return candidate.hackerApplication?.whyHT6Essay ?? 'No response provided';
    } else if (parsedCategory === 'project') {
      let links = '';
      if (candidate.hackerApplication?.linkedinLink) {
        links += `LinkedIn Link: ${candidate.hackerApplication.linkedinLink} `;
      }
      if (candidate.hackerApplication?.githubLink) {
        links += `GitHub Link: ${candidate.hackerApplication.githubLink}`;
      }
      return links || 'No Links Provided';
    }

    return candidate.hackerApplication?.portfolioLink ?
        `Portfolio Link: ${candidate.hackerApplication.portfolioLink}`
      : 'No Portfolio Link Provided';
  };

  const showProfile = () => {
    setToggleProfile(!toggleProfile);
  };

  const submitScores = async () => {
    try {
      await gradeCandidate(candidate._id, selectedRating.toString());
      alert('Review submitted successfully!');
      setToggleProfile(false);
      setShowName(false);
      setSelectedRating(3);
      setNotes('');
      void navigation('/apps');
    } catch (error) {
      console.error('Error submitting scores:', error);
      alert('Error submitting review. Please try again.');
    }
  };

  const showNameFunction = () => {
    setShowName(!showName);
  };

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
  };

  return (
    <div className="p-4 m-3">
      <div className="m-4 text-left">
        <h1 className="text-5xl font-bold text-primary">Review Candidate</h1>
        <p className="text-xl font-bold text-slate-500">
          Give this question a score from 0 to <span>{maxScore}</span>
        </p>
      </div>
      <button
        onClick={showProfile}
        className="m-4 p-2 pl-4 pr-4 bg-amber-500 rounded-2xl text-white hover:bg-amber-600 dark:hover:bg-primary dark:bg-primary-dark"
      >
        {toggleProfile ? 'Hide Profile' : 'Show Profile'}
      </button>
      {toggleProfile ?
        <button
          onClick={showNameFunction}
          className="m-4 p-2 pl-4 pr-4 bg-amber-500 rounded-2xl text-white hover:bg-amber-600 dark:hover:bg-primary dark:bg-primary-dark"
        >
          {showName ? 'Hide Name' : 'Show Name'}
        </button>
      : null}
      {toggleProfile ?
        showName ?
          <FullProfile candidate={candidate} />
        : <Profile candidate={candidate} />
      : null}
      <div className="p-4">
        <QuestionBox
          className="mb-8"
          title={categoryNames[parsedCategory]}
          wordCount={getResponse().split(' ').length}
        >
          {getResponse()}
        </QuestionBox>
        <div
          className={`bg-primary dark:bg-slate-700 text-white p-4 mt-4 mb-8 text-center rounded-2xl`}
        >
          <h2 className="text-2xl font-bold mb-2">Add Notes (Optional)</h2>
          <textarea
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
            }}
            placeholder="Write your notes here..."
            className="w-full h-24 p-4 rounded-xl bg-primary-light text-black dark:text-white dark:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-dark dark:focus:ring-slate-800 placeholder:text-slate-600 dark:placeholder:text-slate-400"
          />
        </div>
        <div
          className={`bg-primary dark:bg-slate-700 text-white p-4 mt-4 text-center rounded-2xl`}
        >
          <h2 className="text-2xl font-bold mb-2">Rate this response</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {Array.from({ length: maxScore + 1 }, (_, i) => (
              <div
                key={i}
                onClick={() => {
                  handleRatingClick(i);
                }}
                className={`text-4xl cursor-pointer rounded-lg pt-4 pb-4 
                ${
                  selectedRating === i ?
                    'dark:bg-primary-dark text-black font-bold'
                  : 'bg-primary-light dark:bg-slate-600 hover:bg-primary-dark hover:dark:bg-slate-800'
                }`}
                style={{
                  backgroundColor:
                    selectedRating === i ? ratingColors[i] : undefined,
                }}
              >
                <div className="text-4xl">{ratingScale[i]}</div>
                <div className="text-sm mt-2 text-black dark:text-white">
                  {i}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={submitScores}
            className="mt-4 p-2 pl-4 pr-4 bg-amber-500 rounded-2xl text-white hover:bg-amber-600 dark:hover:bg-primary dark:bg-primary-dark"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
