import { useEffect, useState } from 'react';
import { Container, Form, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import collapse from '../assets/Collapse_icon.png';
import './search.css';
import SearchResults from './SearchResults';

// Search component for user to search for and add an NUS module
export default function Search(props) {
  const [searchResults, setSearchResults] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const nusModsModuleList = props.moduleData;

  useEffect(() => {
    // search handler uses a timeout to prevent multiple
    // calls to the api when user types a new letter
    // https://stackoverflow.com/questions/42217121/how-to-start-search-only-when-user-stops-typing
    const handleSearchQuery = setTimeout(() => {
      if (searchQuery != '') {
        const filteredList = [];
        const addedModuleCodes = props.yourModules.map(
          (module) => module.moduleCode
        );
        for (const module of nusModsModuleList) {
          // To enable search by both module code and module title,
          // searches for search query in both module title and module code
          // Converts search query and module title and code to lower case
          // in the event where there is a case mismatch.
          if (
            module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            module.moduleCode.toLowerCase().includes(searchQuery.toLowerCase())
          ) {
            // Check if module is in your modules
            // as this will affect the button shown
            if (addedModuleCodes.includes(module.moduleCode)) {
              module['moduleAdded'] = true;
            }
            filteredList.push(module);
          }
        }
        setSearchResults(filteredList);
        setIsLoading(false);
      } else {
        setSearchResults([]);
        setIsLoading(false);
      }
    }, 2000);

    return () => clearTimeout(handleSearchQuery);
  }, [searchQuery]);

  return (
    <div>
      <div style={{ position: 'fixed', marginTop: 20, marginLeft: 20 }}>
        <Link to='/'>
          <img src={collapse} />
        </Link>
      </div>
      <Container className='search-container'>
        <h3
          style={{ textAlign: 'center', padding: '4% 0px' }}
        >{`Academic Year ${props.latestAcadYear}`}</h3>
        <Form>
          <Form.Group className='mb-4'>
            <Form.Control
              className='form-control-lg search-bar-field'
              type='text'
              placeholder='Search for a module by module name or code'
              onChange={(e) => {
                setIsLoading(true);
                setSearchQuery(e.target.value);
              }}
            />
          </Form.Group>
        </Form>
        {isLoading && (
          <Container className='d-flex flex-column align-items-center'>
            <Spinner animation='border' role='status'>
              <span className='visually-hidden'>Loading...</span>
            </Spinner>
          </Container>
        )}
        {!isLoading && searchResults != null && (
          <SearchResults
            filteredModules={searchResults}
            addModuleHandler={props.addModuleHandler}
          />
        )}
      </Container>
    </div>
  );
}
