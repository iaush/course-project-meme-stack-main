import { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './search.css';

// Search result card component
export default function SearchResultCard(props) {
  const moduleName = props.title;
  const moduleCode = props.moduleCode;
  const moduleSemesters = props.semesters;
  const moduleSemestersString = moduleSemesters.join(', ');
  const [moduleAdded, setModuleAdded] = useState(props.moduleAdded ?? false);
  const navigate = useNavigate();

  // Call back function that saves module and reloads page.
  const addModuleHandler = (e) => {
    e.preventDefault();
    props.addModuleHandler(moduleCode);
    setModuleAdded(true);
  };

  // Navigate function to rerender page with selected module
  // if user selects Go to module.
  const redirectModuleHandler = (e) => {
    e.preventDefault();
    navigate('/', { state: props.moduleCode, replace: true });
  };

  return (
    <Card className='mb-3 px-3'>
      <Card.Body className='mt-2'>
        <Card.Title>{moduleCode}</Card.Title>
        <Card.Text className='my-2'>{moduleName}</Card.Text>
        <Card.Text className='mb-2'>{`Semesters : ${moduleSemestersString}`}</Card.Text>
      </Card.Body>
      {moduleAdded && (
        <Button
          className='mb-3 mx-3  search-results-btn-added'
          onClick={redirectModuleHandler}
        >
          Go to module
        </Button>
      )}
      {!moduleAdded && (
        <Button
          className='mb-3 mx-3 search-results-btn'
          onClick={addModuleHandler}
        >
          Add module
        </Button>
      )}
    </Card>
  );
}
