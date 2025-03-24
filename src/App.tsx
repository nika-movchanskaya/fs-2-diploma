import './App.css';
import { Routes, Route } from 'react-router-dom';
import { InformationPage } from './pages/InformationPage';
import { IndexContent } from './pages/IndexContent';
import { SessionContent } from './pages/SessionContent';
import { PaymentContent } from './pages/PaymentContent';
import { TicketContent } from './pages/TicketContent';
import { AdminPage } from './pages/admin/AdminPage';
import { MainContent } from './pages/admin/MainContent';
import { LoginContent } from './pages/admin/LoginContent';
import PrivateRoute from './routes/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

function App() {

  let backendServer = '';
  let websiteUrl;

  if (process.env.NODE_ENV === 'development') {
    backendServer = 'http://localhost:8000';
    websiteUrl = 'http://localhost:3000';
  }
  else {
  }

  return (
    <AuthProvider>
      <Routes>
        <Route path='/' element={
          <InformationPage>
            <IndexContent
              backendServer={backendServer} 
            />
          </InformationPage>
        }/>
        <Route path='/session/:id' element={
          <InformationPage>
            <SessionContent
              backendServer={backendServer}
            />
          </InformationPage>
        }/>
        <Route path='/payment' element={
          <InformationPage>
            <PaymentContent/>
          </InformationPage>
        }/>
        <Route path='/ticket' element={
          <InformationPage>
            <TicketContent/>
          </InformationPage>
        }/>
        <Route path='/login' element={
          <AdminPage>
            <LoginContent
              backendServer={backendServer}
            />
          </AdminPage>
        }/>
        <Route
          path="/admin/index" element={
            <PrivateRoute>
              <AdminPage>
                <MainContent
                  backendServer={backendServer}
                />
              </AdminPage>
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
