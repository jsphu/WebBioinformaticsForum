import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import TopicsList from "./components/TopicsList";
import NewsSection from "./components/NewsSection";
import TopicDetail from "./components/TopicDetail";
import MainPage from "./components/MainPage";
import Flow from "./customs/flow";
import "./App.css";

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <div className="main-content-frame">
                    <Routes>
                        <Route path="/forums" element={<TopicsList />} />
                        <Route
                            path="/tool"
                            element={
                                <div
                                    style={{
                                        padding: "20px",
                                        textAlign: "left",
                                    }}
                                >
                                    Bu sayfada araçlar hakkında bilgi yer
                                    alacak.
                                </div>
                            }
                        />
                        <Route
                            path="/articles"
                            element={
                                <div
                                    style={{
                                        padding: "20px",
                                        textAlign: "left",
                                    }}
                                >
                                    Makaleler burada listelenecek.
                                </div>
                            }
                        />
                        <Route path="/news" element={<NewsSection />} />
                        <Route path="/topic/:id" element={<TopicDetail />} />
                        <Route path="/pipeline-editor" element={<Flow />} />

                        {/* This is the home page route ("/") */}
                        <Route
                            path="/"
                            element={
                                <>
                                    <div className="flex justify-center w-full">
                                        <MainPage />
                                    </div>
                                </>
                            }
                        />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
