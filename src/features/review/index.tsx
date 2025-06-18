/* eslint-disable @typescript-eslint/no-misused-promises */
import { useLocation, useNavigate } from 'react-router';
import {
  User,
  getCandidate,
  gradeCandidate,
  editObject,
  getUser,
  getDownloadURL,
} from '@/utils/ht6-api';
import {
  maxPerCategory,
  categoryNames,
  ratingScale,
  ratingColors,
  APINames,
  rateNames,
  categoryQuestions,
  categories,
} from '@/utils/const';
import { useState, useEffect } from 'react';
import QuestionBox from '@/components/questionBox';
import FullProfile from './fullProfile';
import Profile from './profile';
import AlertPopup from '@/components/alert-popup';
import HelpPower from './helpPower';

interface ReviewPageState {
  candidate: User;
  category: string;
  resumeLink: string;
}

const ReviewPage = () => {
  const location = useLocation();
  const { candidate, category, resumeLink } = location.state as ReviewPageState;
  const [toggleProfile, setToggleProfile] = useState<boolean>(false);
  const [showName, setShowName] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');
  const navigation = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertMessage, setShowAlertMessage] = useState('');

  const [powerMode, setPowerMode] = useState(false);
  const [powerModeCategory, setPowerModeCategory] = useState<string>('');
  const [powerModeCatIndex, setPowerModeCatIndex] = useState<number>(0);
  const [showPowerHelp, setShowPowerHelp] = useState(false);

  const parsedCategory = category;

  //console.log(candidate);

  // GETTERS AND SETTERS ------------------------------------------------------------
  // getGrade function to get the saved grade for the current category of the candidate given from the current user
  const getGrade = (category: string) => {
    const apiCategory =
      category ? rateNames[category as keyof typeof rateNames] : undefined;
    const score =
      category &&
      candidate.internal.applicationScores?.[
        apiCategory as keyof typeof candidate.internal.applicationScores
      ]?.score;
    return typeof score === 'number' ? score - 1 : -5;
  };

  // getResponse function gets the applicant's response for the current category/question
  const getResponse = (category: string): string => {
    if (category === 'creativeResponseEssay') {
      return (
        candidate.hackerApplication?.creativeResponseEssay ??
        'No response provided'
      );
    } else if (category === 'whyHT6Essay') {
      return candidate.hackerApplication?.whyHT6Essay ?? 'No response provided';
    } else if (category === 'oneSentenceEssay') {
      return (
        candidate.hackerApplication?.oneSentenceEssay ?? 'No response provided'
      );
    } else if (category === 'portfolioLink') {
      let links = '';
      if (candidate.hackerApplication?.linkedinLink) {
        links += `LinkedIn Link\n${candidate.hackerApplication.linkedinLink}`;
      }
      if (candidate.hackerApplication?.githubLink) {
        if (links !== '') links += '\n';
        links += `GitHub Link\n${candidate.hackerApplication.githubLink}`;
      }

      if (candidate.hackerApplication?.portfolioLink) {
        if (links !== '') links += '\n';
        links += `Portfolio Link\n${candidate.hackerApplication.portfolioLink}`;
      }

      if (candidate.hackerApplication?.resumeFileName) {
        if (links !== '') links += '\n';
        links += `Resume Link\n${resumeLink}`;
      }
      return links || 'No Links Provided';
    }
    return '';
  };

  // maxScore is the max score for the current category of the candidate given from the current user
  const maxScore: Record<string, number> = {
    creativeResponseEssay: maxPerCategory.creativeResponseEssay,
    whyHT6Essay: maxPerCategory.whyHT6Essay,
    oneSentenceEssay: maxPerCategory.oneSentenceEssay,
    portfolioLink: maxPerCategory.portfolioLink,
  };

  // selectedRating is the rating for the current category of the candidate given from the current user
  const [selectedRating, setSelectedRating] = useState<Record<string, number>>(
    () => ({
      creativeResponseEssay: getGrade('creativeResponseEssay'),
      whyHT6Essay: getGrade('whyHT6Essay'),
      oneSentenceEssay: getGrade('oneSentenceEssay'),
      portfolioLink: getGrade('portfolioLink'),
    }),
  );
  useEffect(() => {
    setSelectedRating({
      [parsedCategory]: getGrade(parsedCategory),
    });
  }, [candidate, parsedCategory]);

  // submittedCategories is the categories help indicate which categories have been submitted at the moment
  const [submittedCategories, setSubmittedCategories] = useState<
    Record<string, boolean>
  >({});

  // SIMPLE FUNCTIONS --------------------------------------------------------------
  const showProfile = () => {
    setToggleProfile(!toggleProfile);
  };

  const showNameFunction = () => {
    setShowName(!showName);
  };

  const powerModeAction = () => {
    setPowerMode(!powerMode);
    if (category === '') {
      setPowerModeCategory('creativeResponseEssay');
    } else {
      setPowerModeCategory(category);
      setPowerModeCatIndex(0);
    }
  };

  const handleRatingClick = (category: string, rating: number) => {
    setSelectedRating((prev) => ({
      ...prev,
      [category]: rating,
    }));
  };

  // THREE MAIN ACTION FUNCTIONS: SUBMIT SCORES, SUBMIT NOTES, GET NEXT CANDIDATE --------------------------
  const submitScores = async (category?: string) => {
    try {
      const scores: Record<string, number> = {};
      if (category) {
        const apiCategory = rateNames[category as keyof typeof rateNames];
        scores[apiCategory] = selectedRating[category];
        await gradeCandidate(candidate._id, scores);
        setSubmittedCategories((prev) => ({
          ...prev,
          [category]: true,
        }));
      } else {
        Object.entries(rateNames).forEach(([cat, rateName]) => {
          if (selectedRating[cat] >= 0) scores[rateName] = selectedRating[cat];
          else scores[rateName] = 0;
        });
        await gradeCandidate(candidate._id, scores);
        setSubmittedCategories(
          categories.reduce<Record<string, boolean>>((acc, key) => {
            if (selectedRating[key] >= 0) acc[key] = true;
            else acc[key] = false;
            return acc;
          }, {}),
        );
      }

      const updated = await getUser(1, 2, 'asc', '', '', {
        _id: candidate._id,
      });
      Object.assign(candidate, updated.message[0]);

      setShowAlertMessage('Review submitted successfully!');
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 1500);
    } catch (error) {
      console.error('Error submitting scores:', error);
      alert('Error submitting review. Please try again.');
    }
  };

  const submitNotes = async () => {
    try {
      await editObject(
        'user',
        {
          _id: candidate._id,
        },
        {
          internal: {
            notes: notes || '',
          },
        },
      );
      alert('Notes submitted successfully!');
    } catch (error: unknown) {
      alert(
        error instanceof Error ? error.message : 'An unknown error occurred',
      );
    }
  };

  const getNextApp = async () => {
    try {
      let result;
      let attempts = 0;

      do {
        const apiCategory =
          parsedCategory ?
            APINames[parsedCategory as keyof typeof APINames]
          : undefined;
        result = await getCandidate(true, apiCategory);
        attempts++;
      } while (result.message._id === candidate._id && attempts < 5);
      const downloadURL = await getDownloadURL(
        'resumes',
        result.message.hackerApplication?.resumeFileName ?? 'null',
      );

      if (result.message._id && result.message._id !== candidate._id) {
        void navigation('/review', {
          state: {
            candidate: result.message,
            category: parsedCategory,
            resumeLink: downloadURL.message,
          },
        });
        setToggleProfile(false);
        setShowName(false);
        setNotes('');
        setShowAlert(false);
        setSelectedRating(
          categories.reduce<Record<string, number>>((acc, key) => {
            acc[key] = getGrade(key);
            return acc;
          }, {}),
        );
        setSubmittedCategories(
          categories.reduce<Record<string, boolean>>((acc, key) => {
            acc[key] = false;
            return acc;
          }, {}),
        );
        document.querySelector('#top')?.scrollIntoView({ behavior: 'smooth' });
        setShowAlertMessage('Next applicant loaded :]');
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 2000);
      } else {
        alert('No new applicants available or repeated candidate.');
      }
    } catch (error: unknown) {
      alert(
        error instanceof Error ? error.message : 'An unknown error occurred',
      );
    }
  };

  // POWER MODE TOGGLES ------------------------------------------------------------
  useEffect(() => {
    if (!powerMode) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleRatingClick(powerModeCategory, Number(e.key));
      } else if (e.key === 'a' || e.key === 'A') {
        if (category === '') {
          submitScores().catch(() => {
            console.error('Error submitting scores');
            alert('Error submitting review. Please try again.');
          });
        } else {
          submitScores(powerModeCategory).catch(() => {
            console.error('Error submitting scores');
            alert('Error submitting review. Please try again.');
          });
        }
      } else if (e.key === 'Escape') {
        setPowerMode(false);
      } else if ((e.key === 's' || e.key === 'S') && category === '') {
        const nextIndex = (powerModeCatIndex + 1) % categories.length;
        const nextCategory = categories[nextIndex];

        setPowerModeCatIndex(nextIndex);
        setPowerModeCategory(nextCategory);
        document
          .querySelector(`#rate-${nextCategory}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if ((e.key === 'w' || e.key === 'W') && category === '') {
        const nextIndex =
          (powerModeCatIndex - 1 + categories.length) % categories.length;
        const nextCategory = categories[nextIndex];

        setPowerModeCatIndex(nextIndex);
        setPowerModeCategory(nextCategory);
        document
          .querySelector(`#rate-${nextCategory}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (e.key === 'd' || e.key === 'D') {
        getNextApp().catch(() => {
          console.error('Error getting next applicant');
          alert('Error getting next applicant. Please try again.');
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [powerMode, category, powerModeCatIndex, powerModeCategory, submitScores]);

  // COMPONENTS --------------------------------------------------------------------

  // categorySection is a function that returns a div with a QuestionBox component (with user answer)
  // and a Box component (with rating choices) for the current category
  const categorySection = (category: string, bgColor?: string) => {
    return (
      <div>
        {category !== 'portfolioLink' ?
          <QuestionBox
            className={`mb-8 ${bgColor ?? 'bg-primary dark:bg-slate-700'}`}
            title={categoryNames[category as keyof typeof categoryNames]}
            label={
              categoryQuestions[category as keyof typeof categoryQuestions]
            }
            wordCount={getResponse(category).split(' ').length}
          >
            {getResponse(category)}
          </QuestionBox>
        : <QuestionBox
            className={`mb-8 ${bgColor ?? 'bg-primary dark:bg-slate-700'}`}
            title={categoryNames[category as keyof typeof categoryNames]}
            label={
              categoryQuestions[category as keyof typeof categoryQuestions]
            }
            wordCount={getResponse(category).split(' ').length}
            items={getResponse(category)
              .split('\n')
              .filter((_, index) => index % 2 === 0)}
            links={getResponse(category)
              .split('\n')
              .filter((_, index) => index % 2 === 1)}
          >
            Click on the above texts to view this applicants linkedin, github,
            and portfolio
          </QuestionBox>
        }
        <div
          className={`${
            bgColor ?? 'bg-primary dark:bg-slate-700'
          } text-white p-4 mt-4 text-center rounded-2xl`}
          style={{
            border:
              powerMode && powerModeCategory == category ?
                '4px solid #FFFF00'
              : 'none',
            outlineOffset: 5,
          }}
          id={`rate-${category}`}
        >
          <h2 className="text-2xl font-bold mb-2">
            Rate {rateNames[category as keyof typeof rateNames]} response
          </h2>
          <div
            className={`grid grid-cols-1 sm:grid-cols-3 gap-4 justify-center`}
            style={{
              gridTemplateColumns: `repeat(${(maxScore[category] + 1).toString()}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: maxScore[category] + 1 }, (_, i) => (
              <div
                key={i}
                onClick={() => {
                  handleRatingClick(category, i);
                }}
                className={`text-4xl cursor-pointer rounded-lg pt-4 pb-4 
                ${
                  selectedRating[category] === i ?
                    'dark:bg-primary-dark text-black font-bold'
                  : 'bg-primary-light dark:bg-slate-600 hover:bg-primary-dark hover:dark:bg-slate-800'
                }`}
                style={{
                  backgroundColor:
                    selectedRating[category] === i ?
                      ratingColors[i]
                    : undefined,
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
            onClick={() => submitScores(category)}
            className={`mt-4 p-2 pl-4 pr-4 rounded-2xl text-white
                    ${
                      submittedCategories[category] ?
                        'bg-green-600 dark:bg-green-700'
                      : 'bg-amber-500 hover:bg-amber-600 dark:hover:bg-primary dark:bg-primary-dark'
                    }`}
          >
            Submit
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 m-3" id="top">
      {showAlert && <AlertPopup message={showAlertMessage} />}
      {showPowerHelp && (
        <HelpPower
          onClose={() => {
            setShowPowerHelp(false);
          }}
        />
      )}
      <div className="m-4 text-left">
        <h1 className="text-5xl font-bold text-primary">Review Candidate</h1>
        <p className="text-xl font-bold text-slate-500">
          {parsedCategory !== '' ?
            <>
              Give this question a score from 0 to{' '}
              <span>{maxScore[parsedCategory] + 1}</span>
            </>
          : <> Score each questions</>}
        </p>
      </div>
      <button
        onClick={powerModeAction}
        className="ml-4 mr-1 p-2 pl-4 pr-4 bg-amber-500 rounded-2xl text-white hover:bg-amber-600 dark:hover:bg-primary dark:bg-primary-dark"
      >
        {powerMode ? 'Power Mode Off' : 'Power Mode On'}
      </button>
      <button
        onClick={() => {
          setShowPowerHelp(true);
        }}
        className="z-50 w-5 text-[0.7rem] font-bold aspect-square text-amber-500 border-2 border-amber-500 rounded-full items-center justify-center hover:border-amber-600 hover:text-amber-600"
        style={{ position: 'relative', top: '-14px' }}
      >
        i
      </button>
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
          <FullProfile candidate={candidate} resumeLink={resumeLink} />
        : <Profile candidate={candidate} />
      : null}

      <div className="p-4">
        {parsedCategory !== '' ?
          <div>{categorySection(parsedCategory)}</div>
        : <div className="gap-10 flex flex-col">
            {categorySection('creativeResponseEssay')}
            {categorySection('whyHT6Essay', 'bg-sky-700 dark:bg-sky-900')}
            {categorySection('oneSentenceEssay')}
            {categorySection('portfolioLink', 'bg-sky-700 dark:bg-sky-900')}
          </div>
        }

        <div
          className={`bg-primary dark:bg-slate-700 text-white p-4 mt-8 mb-8 text-center rounded-2xl`}
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
          <button
            onClick={() => void submitNotes()}
            className="mt-4 p-2 pl-4 pr-4 bg-amber-500 rounded-2xl text-white hover:bg-amber-600 dark:hover:bg-primary dark:bg-primary-dark"
          >
            Submit
          </button>
          {candidate.internal.notes !== '' ?
            <div>
              <h2 className="mt-5 text-2xl font-bold mb-2">Past Notes</h2>{' '}
              <p className="font-bold text-black dark:text-slate-400 bg-primary-light dark:bg-slate-800 p-2 pl-4 pr-4 rounded-xl">
                {candidate.internal.notes}
              </p>
            </div>
          : null}
        </div>
        <div className="flex justify-end gap-3">
          {category === '' && (
            <button
              onClick={() => void submitScores()}
              className="mt-4 p-2 pl-4 pr-4 bg-amber-500 rounded-2xl text-white hover:bg-amber-600 dark:hover:bg-primary dark:bg-primary-dark"
            >
              Submit All Scores
            </button>
          )}
          <button
            onClick={() => void getNextApp()}
            className="mt-4 p-2 pl-4 pr-4 bg-amber-500 rounded-2xl text-white hover:bg-amber-600 dark:hover:bg-primary dark:bg-primary-dark"
          >
            View Next Applicant
          </button>
        </div>
      </div>
    </div>
  );
};
export default ReviewPage;
