import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/shared/Navbar'
import Home from './components/Home'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Jobs from './components/Jobs'
import Browse from './components/Browse'
import Profile from './components/Profile'
import JobDescription from './components/JobDescription'
import Companies from './components/companies/Companies'
import CreateCompany from './components/companies/CreateCompany'
import CompanySetup from './components/companies/CompanySetup'
import AdminJobs from './components/companies/AdminJobs'
import PostJob from './components/companies/PostJob'
import Applicants from './components/companies/Applicants'
import ProtectedRoute from './components/shared/protectedRoute'
import JobEditPage from './components/companies/JobEdit'
import UserProtectedRoute from './components/shared/UserProtectedRoute'

const appRouter = createBrowserRouter([
  {
    path:'/',
    element:<Home/>
  },
  {
    path:'/login',
    element:<Login/>
  },
  {
    path:'/signup',
    element:<Signup/>
  },
  {
    path:'/jobs',
    element:<UserProtectedRoute><Jobs/></UserProtectedRoute>
  },
  {
    path:'/description/:id',
    element:<JobDescription/>
  },
  {
    path:'/browse',
    element:<UserProtectedRoute><Browse/></UserProtectedRoute>
  },
  {
    path:'/profile',
    element:<Profile/>
  },
  {
    path:'/admin/companies',
    element:<ProtectedRoute><Companies/></ProtectedRoute>
  },
  {
    path:'/admin/companies/create',
    element:<ProtectedRoute><CreateCompany/></ProtectedRoute>
  },
  {
    path:'/admin/companies/:id',
    element:<ProtectedRoute><CompanySetup/></ProtectedRoute>
  },
  {
    path:'/admin/jobs',
    element:<ProtectedRoute><AdminJobs/></ProtectedRoute>
  },
  {
    path:'/admin/jobs/create',
    element:<ProtectedRoute><PostJob/></ProtectedRoute>
  },
  {
    path:'/admin/jobs/:id/applicants',
    element:<ProtectedRoute><Applicants/></ProtectedRoute>
  },
  {
    path:'/admin/jobs/:id/edit',
    element:<ProtectedRoute><JobEditPage/></ProtectedRoute>
  }
])

function App() {
  

  return (
    <>
      <RouterProvider router={appRouter}/>
    </>
  )
}

export default App
