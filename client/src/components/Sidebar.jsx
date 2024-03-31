import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import collapse from './assets/Collapse_icon.png';
import sidebar from './assets/Sidebar_icon.png';
import useUserStore from '../stores/userStore';
import './sidebar.css';

// Sidebar navigation component
// that provides navigation to search page
// and rerenders the page when user selects a module that they have added.
const Sidebar = (props) => {
  const [hidden, setHidden] = useState(true);
  const { logout } = useUserStore((state) => ({ logout: state.logout }));

  const hideSidebar = () => {
    setHidden((prev) => !prev);
  };

  const logoutHandler = (e) => {
    e.preventDefault();
    logout();
    setHidden(true);
  };

  return (
    <div className={`sideBarContainer ${hidden ? 'sidebarHidden' : ''}`}>
      <div
        onClick={hideSidebar}
        className={`${hidden ? 'iconHidden' : ''}`}
        style={{
          display: 'flex',
          justifyContent: 'end',
        }}
      >
        <img src={hidden ? sidebar : collapse} />
      </div>
      <div>
        <div className={`${hidden ? 'itemsHidden' : 'sideBarButton search'}`}>
          <Link to='/search'>
            <h5>Add a module</h5>
          </Link>
        </div>
      </div>
      {props.modules.length > 0 && (
        <div>
          <div className={`${hidden ? 'itemsHidden' : ''}`}>
            <h5 className='my-4'>Your modules</h5>
          </div>
          {props.modules.map((item) => {
            return (
              <div
                key={item.moduleCode}
                className={`navitems ${hidden ? 'itemsHidden' : ''}`}
                onClick={() => props.changemodule(item)}
              >
                <p>{item.moduleCode}</p>
              </div>
            );
          })}
        </div>
      )}
      <div>
        <button
          className={`${hidden ? 'itemsHidden' : 'sideBarButton logout'}`}
          onClick={logoutHandler}
        >
          <h5>Sign out</h5>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
