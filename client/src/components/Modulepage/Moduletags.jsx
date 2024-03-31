import { Container } from 'react-bootstrap';
const Moduletag = (props) => {
  const width = props.tag.length * 20;

  return (
    <Container
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
        padding: '5px 10px',
        borderRadius: '10px',
        backgroundColor: props.color,
        fontSize: '16px',
        fontWeight: '700',
        color: 'white',
        margin: '20px 0',
      }}
    >
      {props.tag}
    </Container>
  );
};

export default Moduletag;
