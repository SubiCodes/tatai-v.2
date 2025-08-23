import React, { useEffect, useState } from 'react'
import { SquareUser, FolderClock, BookText, AlertTriangle } from 'lucide-react'
import { DotLoader } from 'react-spinners'
import AreaChartCurved from '../charts/AreaChartCurved.jsx';
import PieChartLegend from '../charts/PieChartLegend.jsx';
import CommentCard from '../cards/CommentCard.jsx';
import GuideCard from '../cards/GuideCard.jsx';
import ViewGuide from '../dialogs/ViewGuide.jsx';
import useGuideStore from '../../../store/guide.store.jsx';
import useFeedbackStore from '../../../store/feedback.store.jsx';
import { Link, useNavigate } from 'react-router-dom';

const areaData = [
  { month: "January", reports: 186 },
  { month: "February", reports: 305 },
  { month: "March", reports: 237 },
  { month: "April", reports: 73 },
  { month: "May", reports: 209 },
  { month: "June", reports: 214 },
]

const pieData = [
  { type: "repair", total: 275, fill: "#4B9CD3" },
  { type: "tool", total: 200, fill: "#007FFF" },
  { type: "diy", total: 187, fill: "#1877F2" },
]

const totalGuides = pieData.reduce((sum, item) => sum + item.guides, 0)

function Dashboard() {

  const navigate = useNavigate();

  const { fetchingGuides, fetchGuides, guides } = useGuideStore()
  const firstThreeGuides = guides
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 3);

  const { latestFeedback, fetchingLatesFeedback, fetchLatestFeedback } = useFeedbackStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [guideToOpen, setGuideToOpen] = useState(null);

  const openDialog = (guide) => {
    setGuideToOpen(guide);
    setIsDialogOpen(true);
  };
  const closeDialog = () => setIsDialogOpen(false);

  useEffect(() => {
    fetchGuides();
    fetchLatestFeedback();
  }, []);

  return (
    <div className='w-full h-full flex flex-col gap-8 p-6 md:-p-12 overflow-auto'>

      {fetchingGuides ? (
        <div className='w-full h-full flex flex-col gap-4 items-center justify-center'>
          <DotLoader size={32} />
          <h1>Loading...</h1>
        </div>
      ) : (
        <>
          {/* Three Box Header */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Total Users */}
            <div className="w-full rounded-2xl bg-gradient-to-r from-[#006FFD] to-[#3399FF] h-48 lg:h-56 flex flex-col p-6 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1" onClick={() => navigate("/users")}>
              <h1 className="text-white text-xl font-semibold">Total Users</h1>
              <div className="flex flex-1 items-center justify-center flex-row gap-4">
                <SquareUser size={42} className="text-white" />
                <h1 className="text-white text-5xl font-bold">24</h1>
              </div>
            </div>

            {/* All Guides */}
            <div className="w-full rounded-2xl bg-gradient-to-r from-[#006FFD] to-[#4DA6FF] h-48 lg:h-56 flex flex-col p-6 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1" onClick={() => navigate("/guides")}>
              <h1 className="text-white text-xl font-semibold">All Guides</h1>
              <div className="flex flex-1 items-center justify-center flex-row gap-4">
                <BookText size={42} className="text-white" />
                <h1 className="text-white text-5xl font-bold">16</h1>
              </div>
            </div>

            {/* Pending Guides */}
            <div className="w-full rounded-2xl bg-gradient-to-r from-[#006FFD] to-[#66B2FF] h-48 lg:h-56 flex flex-col p-6 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1" onClick={() => navigate("/guides")}>
              <h1 className="text-white text-xl font-semibold">Pending Guides</h1>
              <div className="flex flex-1 items-center justify-center flex-row gap-4">
                <FolderClock size={42} className="text-white" />
                <h1 className="text-white text-5xl font-bold">8</h1>
              </div>
            </div>

            {/* Unreviewed Reports */}
            <div className="w-full rounded-2xl bg-gradient-to-r from-[#006FFD] to-[#80BFFF] h-48 lg:h-56 flex flex-col p-6 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1" onClick={() => navigate("/reports")}>
              <h1 className="text-white text-xl font-semibold">Unreviewed Reports</h1>
              <div className="flex flex-1 items-center justify-center flex-row gap-4">
                <AlertTriangle size={42} className="text-white" />
                <h1 className="text-white text-5xl font-bold">5</h1>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className='w-full grid grid-cols-1 lg:grid-cols-3 gap-4'>
            <div className='w-full rounded-lg h-80 lg:h-110 shadow-lg flex flex-col col-span-2 gap-4 items-center justify-center p-6 bg-white'>
              <div className='w-full flex items-center justify-between'>
                <h1 className='text-gray-700 text-2xl font-bold'>Total Reports</h1>
                <select
                  className='px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  defaultValue={new Date().getFullYear()}
                  onChange={(e) => {
                    // Handle year selection here
                    console.log('Selected year:', e.target.value);
                  }}
                >
                  {Array.from({ length: new Date().getFullYear() - 2024 }, (_, i) => 2025 + i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <AreaChartCurved data={areaData} />
            </div>

            <div className='w-full rounded-lg h-80 lg:h-110 shadow-lg flex flex-col gap-4 items-center justify-center p-6 bg-white'>
              <h1 className='text-gray-700 text-2xl font-bold'>Live Guides</h1>
              <PieChartLegend data={pieData} totalGuides={totalGuides} />
            </div>
          </div>

          {/* Recent Comments and Guides */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Commnents */}
            <div className="lg:col-span-1 w-full min-h-110 p-4 flex flex-col gap-4 bg-white shadow-lg rounded-lg">
              <h1 className='text-gray-700 text-2xl font-bold'>Recent Comment</h1>
              {fetchingLatesFeedback ? ('Fetching latest feedback...') : (
                <div className='flex flex-1'>
                  <CommentCard feedback={latestFeedback} fromLatestFeedback={true} />
                </div>
              )}
              <div className='w-full flex items-center justify-center border-t border-gray-400 h-10'>
                <Link className='hover:underline hover:text-blue-600 cursor-pointer' to='/feedbacks'>
                  View All
                </Link>
              </div>
            </div>
            {/* Guides */}
            <div className="lg:col-span-2 w-full min-h-110 p-4 flex flex-col gap-4 bg-white shadow-lg rounded-lg">
              <h1 className='text-gray-700 text-2xl font-bold'>Recent Guides</h1>

              {/* Dynamic grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
                {firstThreeGuides?.map((guide, index) => (
                  <GuideCard
                    key={guide._id || index}
                    guide={guide}
                    onClick={() => openDialog(guide)}
                  />
                ))}
              </div>
              <div className='w-full flex items-center justify-center border-t border-gray-400 h-10'>
                <Link className='hover:underline hover:text-blue-600 cursor-pointer' to='/guides'>
                  View All
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
      <ViewGuide
        isOpen={isDialogOpen}
        onClose={closeDialog}
        guide={guideToOpen}
      />
    </div>
  )
}

export default Dashboard