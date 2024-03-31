import { Button, Card, Col } from 'react-bootstrap';

export default function ModuleOption(props) {
  const module = props.module;

  const moduleChangeHandler = (e) => {
    e.preventDefault();
    props.changemodule(module);
  };
  return (
    <Col
      key={module.moduleCode}
      sm={12}
      md={8}
      lg={12}
      className='d-flex align-items-center justify-content-center mx-2'
    >
      <Button className='mb-4 module-options-btn' onClick={moduleChangeHandler}>
        <Card.Title>{module.moduleCode}</Card.Title>
        <Card.Text>{module.title}</Card.Text>
      </Button>
    </Col>
  );
}
