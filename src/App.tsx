/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DiscoverPage from "./pages/DiscoverPage";
import BookDetailPage from "./pages/BookDetailPage";
import GamesPage from "./pages/GamesPage";
import GameTopicPage from "./pages/GameTopicPage";
import CoursePage from "./pages/CoursePage";
import CourseUnitPage from "./pages/CourseUnitPage";
import CourseUnitPracticePage from "./pages/CourseUnitPracticePage";
import DictionaryPage from "./pages/DictionaryPage";

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function App() {
  return (
    <Router basename={routerBasename}>
      <div className="min-h-screen bg-[#f5f5f5] font-sans text-slate-900">
        <Routes>
          <Route path="/" element={<DiscoverPage />} />
          <Route path="/course" element={<CoursePage />} />
          <Route path="/course/:unitId" element={<CourseUnitPage />} />
          <Route path="/course/:unitId/practice/:activityId" element={<CourseUnitPracticePage />} />
          <Route path="/dictionary" element={<DictionaryPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/:topicId" element={<GameTopicPage />} />
          <Route path="/book/:id" element={<BookDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

