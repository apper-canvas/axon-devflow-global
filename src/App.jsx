import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import Header from '@/components/organisms/Header';
import Sidebar from '@/components/organisms/Sidebar';
import BoardView from '@/components/pages/BoardView';
import SprintView from '@/components/pages/SprintView';
import TeamView from '@/components/pages/TeamView';
import AnalyticsView from '@/components/pages/AnalyticsView';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="h-[calc(100vh-4rem)] p-6"
            >
              <Routes>
                <Route path="/" element={<BoardView />} />
                <Route path="/board" element={<BoardView />} />
                <Route path="/sprints" element={<SprintView />} />
                <Route path="/team" element={<TeamView />} />
                <Route path="/analytics" element={<AnalyticsView />} />
              </Routes>
            </motion.div>
          </main>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  );
}

export default App;