import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NewsList from './views/components/NewsList';
import NewsDetail from './views/components/NewsDetail';
import { SocketProvider } from './views/provider/SocketContext';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { EnableLikeProvider } from './views/provider/EnableLikeContext';

const App: React.FC = () => {
  return (
    <EnableLikeProvider>
      <SocketProvider url={'127.0.0.1:1337'}>
        <GoogleReCaptchaProvider reCaptchaKey={"6LfGjU4qAAAAAHok935n7WttryEtorwvmR-NWFuR"}>

          <Router>
            <Routes>
              <Route path="/" element={<NewsList />} />
              <Route path="/news/:id" element={<NewsDetail />} />
            </Routes>
          </Router>
        </GoogleReCaptchaProvider>
      </SocketProvider>
    </EnableLikeProvider>
  );
};

export default App;
