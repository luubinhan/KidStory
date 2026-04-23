/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DiscoverPage from "./pages/DiscoverPage";
import BookDetailPage from "./pages/BookDetailPage";

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function App() {
  return (
    <Router basename={routerBasename}>
      <div className="min-h-screen bg-[#f5f5f5] font-sans text-slate-900">
        <Routes>
          <Route path="/" element={<DiscoverPage />} />
          <Route path="/book/:id" element={<BookDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

