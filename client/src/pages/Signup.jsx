import React, { useState } from 'react'

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from '../components/Button';
import './Auth.css';
import { useNavigate } from 'react-router-dom';
import Client from '../services/client';
import swal from 'sweetalert'
import { LinkContainer } from 'react-router-bootstrap';

const Signup =()=>{

    const navigate = useNavigate();
    
    const [formData,setformData] = useState({
        email : '',
        password : '',
        re_enter_password: ''
    })

    const handlechange=(event)=>{
        setformData(prev=>({
            ...prev,
            [event.target.name] : event.target.value
        }))
    }

    const handleSubmit=(event)=>{
        console.log('test')
        event.preventDefault()
        // fetch('http://localhost:3001/api/v1/auth/register', 
        // {
        // method: "POST",
        // body: JSON.stringify({username: formData.email, password: formData.password})
        // }).then(e=>{console.log(e)
        //     navigate('/login')})
        // .catch(err=>console.log(err))
        let client = new Client();
        client.post('/api/v1/auth/register', {username: formData.email, password: formData.password})
            .then(e=>{
                if (e.status == 200){
                    swal({
                        title: "Success",
                        text: "Account created",
                        icon: "success",
                        }).then(
                    navigate('/login'))
                } else {
                    swal({
                        title: "Error",
                        text: "An error has ocurred",
                        icon: "warning",
                        dangerMode: true,
                        })
                }
                })
            .catch(err=>swal({
                title: "Error",
                text: "An error has ocurred",
                icon: "warning",
                dangerMode: true,
                }))
        
    }

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
        <h2>Signup</h2>
        <Form >
            <Form.Group className='mb-3' controlId='formBasicEmail'>
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                placeholder='Enter Email'
                name='email'
                onChange={handlechange}
                value={formData.email}
                />
            </Form.Group>

            <Form.Group className='mb-3' controlId='formBasicEmail'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                placeholder='Enter Password'
                name='password'
                type='password'
                onChange={handlechange}
                value={formData.password}
                />
            </Form.Group>

            

            <Form.Group className='mb-3' controlId='formBasicEmail'>
                <Form.Label>Re-enter Password</Form.Label>
                <Form.Control
                placeholder='Re-enter Password'
                name='re_enter_password'
                type='password'
                onChange={handlechange}
                value={formData.re_enter_password}
                />
                {(formData.password !== formData.re_enter_password) && 
                <span className='text-danger'
                >Password fields are not the same</span>}
            </Form.Group>
            
            <Button
                variant='primary'
                type='button'
                label='Sign up'
                className={['w-100']}
                onClick={handleSubmit}
            />
            
            <LinkContainer className='pe-auto' to='/login'>
                <button className='btn btn-secondary w-100 mt-2'>Back</button>
            </LinkContainer>
        </Form>
        
        </Row>
    </Col>

    )
}

export default Signup