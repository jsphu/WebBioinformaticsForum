import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ToolPage from './components/tools/ToolPage';
import TopicsList from './components/topics/TopicsList';
import TopicDetail from './components/topics/TopicDetail';
import NewsSection from './components/news/NewsSection';
import SignIn from './components/forms/SignIn';
import SignUp from './components/forms/SignUp';
import Flow from './components/editor/Editor';
import { UserProvider } from './hooks/UserContext';
import './App.css';

function App() {
  return (
    <UserProvider>
      <Router>
        <div style={{ minHeight: "100vh", display: 'flex' }}>
          <Layout>
            <div className="main-content-frame">
              <div className="main-content">
                <Routes>
                  <Route path="/forums" element={<TopicsList />} />
                  <Route path="/news" element={<NewsSection />} />
                  <Route path="/tool" element={<ToolPage />} />
                  <Route path="/topic/:id" element={<TopicDetail />} />
                  <Route path="/sign-in" element={<SignIn />} />
                  <Route path="/sign-up" element={<SignUp />} />
                  <Route path="/pipeline-editor" element={<Flow />} />
                  <Route path="/pipeline-editor/:id" element={<Flow />} />
                  <Route path="/" element={<><TopicsList /><NewsSection /></>} />
                </Routes>
              </div>
            </div>
          </Layout>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
