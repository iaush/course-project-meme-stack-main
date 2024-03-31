import 'bootstrap/dist/css/bootstrap.min.css';
import nusmoderator from 'nusmoderator';
import { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Search from './components/Search/Search';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Room from './pages/Room';
import Logout from './pages/Logout';
import Signup from './pages/Signup';
import ProtectedRoute from './routes/ProtectedRoute';
import {
  retrieveModuleData,
  retrieveModules,
} from './services/retrieveModules';
import useUserStore from './stores/userStore';

function App() {
  const [nusModsData, setNusModsData] = useState(null);
  const [yourModules, setYourModules] = useState([]);
  const { getClient, fetchUserModules, modules } = useUserStore((store) => ({
    getClient: store.getClient,
    fetchUserModules: store.fetchUserModules,
    modules: store.modules,
  }));

  // get latest acad year, e.g. 2022-2023
  const currentDate = new Date();

  // use nusmoderator package to get latest acad year from current date.
  // https://www.npmjs.com/package/nusmoderator
  const latestAcadYearInfo =
    nusmoderator.academicCalendar.getAcadYear(currentDate);

  // Format returned acad year '22/23' into '2022-2023' format
  // for nus mods api.
  const latestAcadYearString = latestAcadYearInfo?.year ?? '';
  let latestAcadYears = latestAcadYearString.split('/');
  // Get current century, e.g. 20 from current date
  let currentCentury = currentDate
    .getFullYear()
    .toString()
    .split('')
    .slice(0, 2)
    .join('');
  const latestAcadYear =
    currentCentury +
    latestAcadYears[0] +
    '-' +
    currentCentury +
    latestAcadYears[1];

  useEffect(() => {
    async function retrieveNUSModules() {
      const modules = await retrieveModules(latestAcadYear);
      setNusModsData(modules);
    }
    retrieveNUSModules();
    reloadModules();
    return;
  }, []);

  const reloadModules = () => {
    fetchUserModules().then((resp) => {
      setYourModules(resp);
    });
  };

  // Call back function to add module.
  // This also adds module to 'your modules' in sidebar.
  const addModuleHandler = useCallback(
    async (courseCode) => {
      // Fetch full module details from nus mods
      const moduleData = await retrieveModuleData(latestAcadYear, courseCode);
      // yourModules.push(moduleData);
      //
      const { sem: semesterString } =
        nusmoderator.academicCalendar.getAcadWeekInfo(currentDate);
      // Get semester number
      let matches = semesterString.match(/Semester (\d)/);
      let semester;
      if (matches) {
        semester = parseInt(matches[1]);
        moduleData['semester'] = semester;
      }
      moduleData['weeks'] = [...Array(13).keys()].reduce((acc, val) => {
        return { ...acc, [val]: [] };
      }, {});
      console.log(moduleData);
      // Stores added module in db
      // and reloads page.
      let client = getClient();
      await client
        .post('/api/v1/module/', moduleData)
        .then(() => reloadModules());
    },
    [yourModules]
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <Dashboard modules={yourModules} />
            </ProtectedRoute>
          }
        />
        <Route
          path='/search'
          element={
            <ProtectedRoute>
              <Search
                moduleData={nusModsData}
                addModuleHandler={addModuleHandler}
                yourModules={yourModules}
                latestAcadYear={latestAcadYear}
              />
            </ProtectedRoute>
          }
        />
        <Route path='/login' element={<Auth reloadModules={reloadModules} />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/module/:moduleId/room/:roomId' element={<Room />} />
        <Route path='/logout' element={<Logout redirect='/login' />} />
        <Route path='*' element={<p>404 not found</p>} status={404} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
