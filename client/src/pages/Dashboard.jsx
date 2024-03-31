import React, { useEffect, useState } from 'react';
import { Container, Row, Spinner } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import Modulelandingpage from '../components/Modulepage/Modulelandingpage';
import ModuleOption from '../components/ModuleOption';
import Sidebar from '../components/Sidebar';
import './dashboard.css';
import useUserStore from '../stores/userStore';

// Dashboard component
// that includes both the sidebar
// and module landing page
// that displays the weekly and session information for each module.
function Dashboard(props) {
  const { getClient } = useUserStore((store) => ({
    getClient: store.getClient,
  }));
  const location = useLocation();
  const redirectedModuleCodeState = location?.state ?? null;

  const [userModules, setUserModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [weeksSessionData, setWeeksSessionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Change module handler
  // Retrieves module information for selected module from db.
  // and populates states.
  const changemodule = async (newModule) => {
    setIsLoading(true);
    setWeeksSessionData(null);
    setSelectedModule(null);
    let client = getClient();
    let moduleId = newModule.id;
    const weeksDataQuery = await client.post(
      `api/v1/module/${moduleId}/weeksData`
    );
    const weeks = weeksDataQuery.data.data;
    setWeeksSessionData(weeks);
    setSelectedModule(newModule);
    setIsLoading(false);
  };

  useEffect(() => {
    const yourModules = props.modules;
    setUserModules(yourModules);
    // Triggered when user has navigated to a selected module
    // that they have added from the search results
    if (redirectedModuleCodeState != null) {
      const selectedModuleOption = yourModules.filter((module) => {
        return module.moduleCode == redirectedModuleCodeState;
      });
      if (selectedModuleOption.length > 0) {
        setSelectedModule(selectedModuleOption[0]);
      }
    }
  }, [props.modules, selectedModule, weeksSessionData]);

  return (
    <div>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          paddingLeft: '0',
        }}
      >
        <Sidebar modules={userModules} changemodule={changemodule} />
        {userModules.length == 0 && (
          <Container className='d-flex flex-column align-items-center mt-4 dashboard-container'>
            <h3 style={{ textAlign: 'center' }}>
              You haven't added any modules
            </h3>
            <Link to='/search' className='link-btn mt-4'>
              Add modules
            </Link>
          </Container>
        )}
        {userModules.length > 0 && !selectedModule && !isLoading && (
          <Container className='d-flex flex-column mt-4 align-items-center dashboard-container'>
            <h3 className='my-4'>Your modules</h3>
            <Row className='mt-4 justify-content-center'>
              {userModules.map((module) => {
                return (
                  <ModuleOption
                    key={module.moduleCode}
                    module={module}
                    changemodule={changemodule}
                  ></ModuleOption>
                );
              })}
            </Row>
          </Container>
        )}
        {selectedModule && !isLoading && (
          <Modulelandingpage
            module={selectedModule}
            weeksSessionData={weeksSessionData}
          />
        )}
        {isLoading && (
          <Container className='d-flex flex-column mt-4 align-items-center dashboard-container'>
            <Spinner animation='border'></Spinner>
          </Container>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
