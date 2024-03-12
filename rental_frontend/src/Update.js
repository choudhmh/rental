import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function Update() {

    const navigate = useNavigate();
    const { id } = useParams();
  
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [postcode, setPostcode] = useState("");
    const [image, setImage] = useState(null);
    const [email, setEmail] = useState("");
    const [price, setPrice] = useState("");
    const [contact, setContact] = useState("");
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("address", address);
        formData.append("postcode", postcode);
        if (image) {
          formData.append("image", image);
        }
        formData.append("email", email);
        formData.append("price", price);
        formData.append("contact", contact);
    
        axios
          .put(`http://localhost:8081/update/${id}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            console.log(response.data);
            navigate("/Display");
          })
          .catch((error) => {
            console.error("Error updating record:", error);
          });
      };

      useEffect(() => {
        axios
          .get(`http://localhost:8081/getrecord/${id}`)
          .then((res) => {
            if (res.data.success && res.data.data.length > 0) {
              const propInfo = res.data.data[0];
              setTitle(propInfo.title || ""); // Set default value if propInfo.title is undefined
              setDescription(propInfo.description || "");
              setAddress(propInfo.address || "");
              setPostcode(propInfo.postcode || "");
              // Ensure the image URL or file object is properly set
              setImage(propInfo.image || null);
    
              setEmail(propInfo.email || "");
              setPrice(propInfo.price || "");
              setContact(propInfo.contact || "");
            } else {
              console.log("No user data found or success is false");
            }
          })
          .catch((err) => {
            console.error("Fetching user data failed:", err);
            // Optionally, you can set default values or show an error message here
          });
          
      }, [id]);
    

      const handleFileChange = (e) => {
        // Set the image state to the selected file object
        setImage(e.target.files[0] || null);
      };

  return (
    <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
    <div className="bg-white p-3 rounded w-25">
      <form action="" onSubmit={handleSubmit}>
        <h2> Update</h2>
        <div className="mb-3">
          <label htmlFor="name">
            <strong>Title</strong>
          </label>
          <input
            type="text"
            className="form-control rounded-0"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && (
            <span className="text-danger"> {errors.title}</span>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="email">
            <strong>Property Description</strong>
          </label>
          <input
            type="text"
            className="form-control rounded-0"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && (
            <span className="text-danger"> {errors.description}</span>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="Address">
            <strong>Property Address</strong>
          </label>
          <input
            type="text"
            className="form-control rounded-0"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          {errors.address && (
            <span className="text-danger"> {errors.address}</span>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="postcode">
            <strong>Property Postcode</strong>
          </label>
          <input
            type="text"
            className="form-control rounded-0"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
          />
          {errors.postcode && (
            <span className="text-danger"> {errors.postcode}</span>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="image">
            <strong>Property Image</strong>
          </label>
          <input
            type="file"
            className="form-control rounded-0"
            onChange={handleFileChange}
          />
          {errors.image && (
            <span className="text-danger">{errors.image}</span>
          )}
        </div>
        {image && (
          <div>
            <strong>Selected Image:</strong> {image.name}
          </div>
        )}

<div className="mb-3">
          <label htmlFor="Email">
            <strong>Email</strong>
          </label>
          <input
            type="email"
            className="form-control rounded-0"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <span className="text-danger"> {errors.email}</span>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="Price">
            <strong>Rental Cost</strong>
          </label>
          <input
            type="text"
            className="form-control rounded-0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          {errors.price && (
            <span className="text-danger"> {errors.price}</span>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="Contact">
            <strong>Property Contact</strong>
          </label>
          <input
            type="text"
            className="form-control rounded-0"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
          {errors.contact && (
            <span className="text-danger"> {errors.contact}</span>
          )}
        </div>

        <button type="submit" className="btn btn-success w-100">
          <strong>Update Account</strong>
        </button>
      </form>
    </div>
  </div>
  )
}

export default Update