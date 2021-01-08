import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { firebaseApp } from "./firebase";
import { useFormFields } from "./libs/hooksLib";
import { Link } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const [fields, handleFieldChange] = useFormFields({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    confirmationCode: "",
    sex: "",
    date: "",
  });

  function validateForm() {
    console.log(fields.sex, fields.name, fields.surname, fields.date);
    return (
      fields.email.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    firebaseApp
      .auth()
      .createUserWithEmailAndPassword(fields.email, fields.password)
      .then((user) => {
        fetch("https://dateishapi.herokuapp.com/api/registerUser", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: fields.name,
            surname: fields.surname,
            sex: fields.sex,
            uID: user.user.uid,
            date: fields.date,
          }),
        }).then(() => {
          window.location.href = "/";
        });
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage, errorCode);
      });
  }

  return (
    <div className="Register">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name" size="lg">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="name"
            onChange={handleFieldChange}
            value={fields.name}
          />
        </Form.Group>
        <Form.Group controlId="surname" size="lg">
          <Form.Label>Surname</Form.Label>
          <Form.Control
            type="surname"
            onChange={handleFieldChange}
            value={fields.surname}
          />
        </Form.Group>
        <Form.Group controlId="sex">
          <Form.Label className="mr-sm-2">Sex</Form.Label>
          <Form.Control
            as="select"
            onChange={handleFieldChange}
            value={fields.sex}
          >
            <option value="0">Choose...</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="email" size="lg">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="password" size="lg">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="confirmPassword" size="lg">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            onChange={handleFieldChange}
            value={fields.confirmPassword}
          />
        </Form.Group>
        <Form.Group controlId="date">
          <Form.Label>Select Date</Form.Label>
          <Form.Control
            type="date"
            name="dob"
            placeholder="Date of Birth"
            onChange={handleFieldChange}
            value={fields.date}
          />
        </Form.Group>
        <Button block size="lg" type="submit" disabled={!validateForm()}>
          Register
        </Button>
        <div>
          <p>
            Already have an account? <Link to="/">Login here</Link>
          </p>
        </div>
      </Form>
    </div>
  );
}
