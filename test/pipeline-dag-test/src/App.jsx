import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import PipelineList from './components/PipelineList';
import TopicsList from './components/TopicsList';
import NewsSection from './components/NewsSection';
import TopicDetail from './components/TopicDetail';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Flow from './customs/flow';
import { UserContext } from './hooks/UserContext';
import { getUser, getAccessToken } from './hooks/user.actions';
import './App.css';

function App() {
  const [user, setUser] = useState(getUser());
  const [accessToken, setAccessToken] = useState(getAccessToken());

  return (
    <UserContext.Provider value={{user, setUser, accessToken, setAccessToken}}>
      <Router>
        <div style={{ minHeight: "100vh", display: 'flex' }}>
          <Layout>
            <div className="main-content-frame">
              <div className="main-content">
                <Routes>
                  <Route path="/forums" element={<TopicsList />} />
                  <Route path="/news" element={<NewsSection />} />
                  <Route path="/tool" element={<PipelineList />} />
                  <Route path="/topic/:id" element={<TopicDetail />} />
                  <Route path="/sign-in" element={<SignIn />} />
                  <Route path="/sign-up" element={<SignUp />} />
                  <Route path="/pipeline-editor" element={<Flow />} />
                  <Route path="/pipeline-editor/:id" element={<Flow />} />
                  <Route path="/pipelines" element={<PipelineList />} />
                  <Route path="/" element={<><TopicsList /><NewsSection /></>} />
                </Routes>
              </div>
            </div>
          </Layout>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
