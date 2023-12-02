import React, { useState } from 'react';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);

import Spinner from './Spinner';

const showSuccessToast = (message) => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
    width: '32rem'
  });

  Toast.fire({
    icon: 'success',
    title: message
  });
};

function OnboardingVendors() {
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [user, setUser] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('')

  const [isLoading, setIsLoading] = useState(false);
  // /signup-vendor

  function handleCancel() {
    setIsLoading(true)
    setTimeout(function() {
      setEmail('')
      setFullname('')
      setUsername('')
      setPassword('')
      setPasswordConfirm('');
      setIsLoading(false)
    }, 2000);
  }

  function validate(e) {
    e.preventDefault();
    if (fullname !== "" && username !== "" && email !== "" && password !== "" && passwordConfirm !== "") {
      handleCreateVendors(e);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all fields!',
      });
    }
  }

  async function handleCreateVendors(e) {
    try {
      setIsLoading(true);

      Swal.fire({
        title: 'Loading',
        text: 'Please wait...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      
      const res = await fetch('https://api-gifta.cyclic.app/api/users/signup-vendor', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username: username.split(' ').join('_'),
          fullName: fullname,
          password,
          passwordConfirm
        })
      });

      // Close loading alert after receiving the response
      Swal.close();

      if(!res.ok) {
        throw new Error('Something went wrong!');
      };

      const data = await res.json();
      if(data.status !== 'success') {
        throw new Error(data.message);
      }

      setUser(data.data.user);
      setSuccess(data.message);
      showSuccessToast(data.message);

    } catch(err) {
      setError(err.message)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'Something went wrong!',
        confirmButtonText: 'OK',
      });
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <div className="dashboard_container" style={{position: 'relative'}}>

			<div className="dashboard_top">
				<span className="heading__text">Create a new vendor.</span>
      </div>


      <div className='onboard_box'>
        {/* {isLoading && <div style={customStyle}><Spinner /></div>} */}
        <form className="form" onSubmit={validate}>
          <div className="form__item">
            <label htmlFor="fullname" className="form__label">Full Name</label>
            <input value={fullname} onChange={(e) => setFullname(e.target.value)} type="text" id="fullname" placeholder="Enter Fullname" className="form__input" />
          </div>
          <div className="form__item">
            <label htmlFor="username" className="form__label">Store Name</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" id="username" placeholder="Enter Store Name" className="form__input" />
          </div>
          <div className="form__item">
            <label htmlFor="email" className="form__label">Email Address</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" id="email" placeholder="Enter Email" className="form__input" />
          </div>
          <div className="form__item">
            <label htmlFor="password" className="form__label">Password (min 8 characters)</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" id="password" placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;" className="form__input" />
          </div>
          <div className="form__item">
            <label htmlFor="password-confirm" className="form__label">Repeat Password</label>
            <input value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} type="password" id="password-confirm" placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;" className="form__input" />
          </div>

          <div className="form__item form__actions">
            <button className="form__button form__cancel" type='button' onClick={handleCancel}>Cancel</button>
            <button className="form__button form__submit" type='submit'>Create Vendor</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default OnboardingVendors;
