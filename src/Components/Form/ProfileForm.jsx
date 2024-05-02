import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const ProfileForm = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [occupation, setOccupation] = useState("");
  const [bio, setBio] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    const profileData = {
      name,
      age,
      occupation,
      bio
    };
    // Pass the profile data to the parent component
    onSubmit(profileData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formAge">
        <Form.Label>Age</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter your age"
          value={age}
          onChange={e => setAge(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formOccupation">
        <Form.Label>Occupation</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter your occupation"
          value={occupation}
          onChange={e => setOccupation(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formBio">
        <Form.Label>Bio</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Enter a short bio"
          value={bio}
          onChange={e => setBio(e.target.value)}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Save Profile
      </Button>
    </Form>
  );
};

export default ProfileForm;
