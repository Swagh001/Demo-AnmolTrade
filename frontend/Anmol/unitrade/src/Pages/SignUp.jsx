import React, { useState } from 'react';
import { useNavigate } from 'react-router';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState('');


    const navigate = useNavigate();

    const validatePassword = (password) => {
        const minLength = /.{8,}/;
        const uppercase = /[A-Z]/;
        const lowercase = /[a-z]/;
        const number = /\d/;
        const specialChar = /[!@#$%^&*(),.?":{}|<>]/;

        return minLength.test(password) &&
            uppercase.test(password) &&
            lowercase.test(password) &&
            number.test(password) &&
            specialChar.test(password);
    };

    const checkPassword = (e) =>{
      setPassword(e.target.value);
      if (!validatePassword(password)) {
        setErrors('Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.');
        return;
      }
      else{
        setErrors('');
      }
    }

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (!validatePassword(password)) {
          return;
        }
        const response = await fetch('https://unitrade-5vvy.onrender.com/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                phoneNo: phoneNo,
                name: name,
                password: password,
            }),
        });

        const data = await response.json();

        console.log(data)

        if (response.ok) {
            alert(data.message);
        } else {
            alert('SignUp failed: ' + data.message);
        }
        if(data.message==='User Account Created Successfully'){
          navigate('/login');
        }
    };

    return (
        <div>
            <form onSubmit={handleSignUp}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Phone Number:</label>
                    <input
                        type="text"
                        value={phoneNo}
                        onChange={(e) => setPhoneNo(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => 
                          checkPassword(e)
                        }
                        required
                    />
                </div>
                {errors && <p style={{color: 'red'}}>{errors}</p>}
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default SignUp;
