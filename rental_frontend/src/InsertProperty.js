import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function InsertProperty() {
    const [values, setValues] = useState({
        title: '',
        description: '',
        address: '',
        postcode: '',
        email: '',
        image1: null,  
        image2: null, 
        image3: null, 
        price: '',
        contact: ''
    });

    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const handleInput = (e) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));
    };

    const handleFileInput = (e) => {
        setValues(prev => ({ ...prev, image1: e.target.files[0], image2: e.target.files[0], image3: e.target.files[0] }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = Validation(values);
        setErrors(validationErrors);

        if (!Object.values(validationErrors).some(error => error)) {
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('description', values.description);
            formData.append('address', values.address);
            formData.append('postcode', values.postcode);
            formData.append('email', values.email);
            formData.append('image1', values.image1);
            formData.append('image2', values.image2);
            formData.append('image3', values.image3);
            formData.append('price', values.price);
            formData.append('contact', values.contact);

            axios.post('http://localhost:8001/signup', formData)
                .then(res => {
                    console.log(res);
                    navigate('/login');
                })
                .catch(err => {
                    console.log(err);
                    // You could setErrors here to show backend validation errors
                });
        }
    };

  return (
    <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
    <div className='bg-white p-3 rounded w-25'>
        <form onSubmit={handleSubmit}>
            <h2>Add Property</h2>
            {/* Name field */}
            <div className='mb-3'>
                <label htmlFor='title'><strong>Title</strong></label>
                <input type='text' placeholder='Enter Name' onChange={handleInput} className='form-control rounded-0' name='name' value={values.name}/>
                {errors.name && <span className='text-danger'>{errors.name}</span>}
            </div>
            {/* Email field */}
            <div className='mb-3'>
                <label htmlFor='desc'><strong>Description</strong></label>
                <input type='text' placeholder='Enter Email' onChange={handleInput} className='form-control rounded-0' name='email' value={values.email}/>
               
            </div>
            {/* Password field */}
            <div className='mb-3'>
                <label htmlFor='text'><strong>Address</strong></label>
                <input type='text' placeholder='Enter Password' onChange={handleInput} className='form-control rounded-0' name='password' value={values.password}/>
                {errors.password && <span className='text-danger'>{errors.password}</span>}
            </div>
            {/* Image upload field */}
            <div className='mb-3'>
                <label htmlFor='image'><strong>Profile Image</strong></label>
                <input type='file' accept='image/*' onChange={handleFileInput} className='form-control rounded-0' name='image'/>
                {errors.image && <span className='text-danger'>{errors.image}</span>}
            </div>
            {/* Submit button */}
            <button type='submit' className='btn btn-success w-100'><strong>Sign Up</strong></button>
            {/* Link to Login */}
            <Link to="/login" className='btn btn-default border w-100 mt-2'>Log In</Link>
        </form>
    </div>
</div>
  )
}

export default InsertProperty