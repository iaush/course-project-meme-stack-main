import React, { useState, useEffect } from 'react';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Button from '../components/Button';
import { useForm } from 'react-hook-form';
import './Auth.css';
import { useLocation, useNavigate } from 'react-router-dom';
import useUserStore from '../stores/userStore';
import { LinkContainer } from 'react-router-bootstrap'

export default function Auth(props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  /**
   * @typedef { import('../stores/userStore').UserSlice }
   * @returns { UserSlice }
   */
  const { token, login, checkValidToken, setToken, getAndSetUser, logout } =
    useUserStore(store => ({
      user: store.user,
      token: store.token,
      login: store.login,
      checkValidToken: store.checkValidToken,
      setToken: store.setToken,
      getAndSetUser: store.getAndSetUser,
      logout: store.logout
    }));

  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token)
      return logout;
    
    let valid = checkValidToken(token);
    if (valid) {
      setToken(token);
    } else {
      return logout;
    }

    getAndSetUser()
    props.reloadModules();
    navigate(location?.state?.from || '/', { replace: true });
  }, [token]);

  const onSubmit = async (data) => {
    let user;
    try {
      user = await login(data.email, data.password);
      props.reloadModules();
    } catch (err) {
      console.log(err)
      setError(err.response.data.message);
      return;
    }

    return navigate(location?.state?.from?.pathname || '/', {
      replace: true,
    });
  };

  return (
    <Col className={'vh-100'} id='auth-background'>
      <Row
        className={[
          'shadow',
          'p-3',
          'mb-5',
          'rounded',
          'col-lg-4',
          'align-middle',
          'position-absolute',
          'top-50',
          'start-50',
          'translate-middle',
          'bg-white',
        ]}
      >
        <h2>Login</h2>
        <Form onSubmit={handleSubmit(onSubmit)}>

          <Form.Group className='mb-3' controlId='formBasicEmail'>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter email'
              {...register('email', { required: true })}
            />
            {errors.email && (
              <span className='text-danger'>This field is required</span>
            )}
          </Form.Group>

          <Form.Group className='mb-3' controlId='formBasicPassword'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Password'
              {...register('password', { required: true })}
            />
            {errors.password && (
              <span className='text-danger'>This field is required</span>
            )}
          </Form.Group>

          {location?.state?.message && (
            <Alert variant='info'>{location?.state?.message}</Alert>
          )}

          {error && <Alert variant='danger'>{error}</Alert>}
          <Button
            variant='primary'
            type='submit'
            label='Submit'
            className={['w-100']}
          />
        </Form>
        <LinkContainer
          to='/signup'
          style={{
            margin: '10px 0px 10px 0px',
            textAlign: 'right',
            cursor: 'pointer'
          }}>
          <p> Dont have an account? Sign up here</p>
        </LinkContainer>
      </Row>
    </Col>
  );
}
