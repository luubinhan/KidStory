/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProgressProvider } from "./contexts/UserProgressContext";
import { CourseFeedbackFab } from "./components/course";
import DiscoverPage from "./pages/DiscoverPage";
import BookDetailPage from "./pages/BookDetailPage";
import GamesPage from "./pages/GamesPage";
import GameTopicPage from "./pages/GameTopicPage";
import CoursePage from "./pages/CoursePage";
import CourseHowToPlayPage from "./pages/CourseHowToPlayPage";
import CourseUnitPage from "./pages/CourseUnitPage";
import CourseUnitPracticePage from "./pages/CourseUnitPracticePage";
import DictionaryPage from "./pages/DictionaryPage";
import AssetsPage from "./pages/AssetsPage";
import SettingsPage from "./pages/SettingsPage";
import GamesV2Page from "./pages/GamesV2Page";
import DoreamonShopPage from "./pages/DoreamonShopPage";
import FishingGamePage from "./pages/FishingGamePage";

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function App() {
  return (
    <Router basename={routerBasename}>
      <UserProgressProvider>
        <div className="min-h-screen bg-[#f5f5f5] font-sans text-slate-900">
          <Routes>
            <Route path="/" element={<DiscoverPage />} />
            <Route path="/course" element={<CoursePage />} />
            <Route path="/course/:unitId" element={<CourseUnitPage />} />
            <Route path="/course/:unitId/practice/:activityId" element={<CourseUnitPracticePage />} />
            <Route path="/how-to-play" element={<CourseHowToPlayPage />} />
            <Route path="/dictionary" element={<DictionaryPage />} />
            <Route path="/assets" element={<AssetsPage />} />
            <Route path="/doreamon-shop" element={<DoreamonShopPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/achievements" element={<Navigate to="/assets" replace />} />
            <Route path="/shop" element={<Navigate to="/assets" replace />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/games-v2" element={<GamesV2Page />} />
            <Route path="/games-v2/fishing" element={<FishingGamePage />} />
            <Route path="/games/:topicId" element={<GameTopicPage />} />
            <Route path="/book/:id" element={<BookDetailPage />} />
          </Routes>
          <CourseFeedbackFab />
        </div>
      </UserProgressProvider>
    </Router>
  );
}

