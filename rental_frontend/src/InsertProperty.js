import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Validation from './SignupValidation';


function InsertProperty() {
    const [values, setValues] = useState({
        title: '',
        description: '',
        address: '',
        postcode: '',
        email: '',
        image1: null,  
      
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
        const { name, files } = e.target;
        setValues(prev => ({ ...prev, [name]: files[0] }));
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
            if (values.image1) formData.append('image', values.image1);


            formData.append('price', values.price);
            formData.append('contact', values.contact);

            axios.post('http://localhost:8081/insert', formData)

                .then(res => {
                    console.log(res);
                    navigate('/Home');
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
    <input type="text" name="title" placeholder="Title"  onChange={handleInput}/>
    <input type="text" name="description" placeholder="Description" onChange={handleInput}/>
    <input type="text" name="address" placeholder="Address" onChange={handleInput}/>
    <input type="text" name="postcode" placeholder="Postcode" onChange={handleInput} />
    <input type="email" name="email" placeholder="Email" onChange={handleInput}/>
    <input type="file" name="image1" multiple onChange={handleFileInput}/>
    <input type="text" name="contact" placeholder="Contact" onChange={handleInput}/>
    <input type="text" name="price" placeholder="Price" onChange={handleInput}/>
    <button type="submit">Submit</button>
</form>

    </div>
</div>
  )
}

export default InsertProperty