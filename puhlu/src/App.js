import React, { useState, useEffect } from "react";
import Axios from "axios";

const Filter = ({ filter, handleFilter }) => {
  return (
    <div>
      rajaa näytettäviä <input value={filter} onChange={handleFilter} />
    </div>
  );
};

const PersonForm = props => {
  return (
    <form onSubmit={props.addContact}>
      <h3>lisää uusi</h3>
      <div>
        nimi: <input value={props.newName} onChange={props.handleName} />
      </div>
      <div>
        numero: <input value={props.newNumber} onChange={props.handleNumber} />
      </div>
      <div>
        <button type="submit">lisää</button>
      </div>
    </form>
  );
};

const PersonList = ({ getContacts }) => {
  return (
    <div>
      <h2>Numerot</h2>
      <ul>{getContacts()}</ul>
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  const personHook = () => {
    Axios.get("http://localhost:3001/persons").then(response => {
      const persons = response.data;
      setPersons(persons);
    });
  };
  // fetch persons from json
  useEffect(personHook, []);

  const personsToShow =
    filter.length === 0
      ? persons
      : persons.filter(person =>
          person.name.toLowerCase().includes(filter.trim().toLowerCase())
        );

  const addContact = event => {
    event.preventDefault();
    const contactObject = {
      name: newName,
      number: newNumber
    };
    if (persons.map(person => person.name).indexOf(newName) !== -1) {
      window.alert(newName + " on jo luettelossa");
      return;
    }
    setPersons(persons.concat(contactObject));
    setNewName("");
    setNewNumber("");
  };

  const getContacts = () => {
    return personsToShow.map(person => (
      <li key={person.name}>
        {person.name} {person.number}
      </li>
    ));
  };

  const handleName = event => {
    setNewName(event.target.value);
  };

  const handleNumber = event => {
    setNewNumber(event.target.value);
  };

  const handleFilter = event => {
    setFilter(event.target.value);
  };

  return (
    <div>
      <h2>Puhelinluettelo</h2>
      <Filter filter={filter} handleFilter={handleFilter} />
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleName={handleName}
        handleNumber={handleNumber}
        addContact={addContact}
      />
      <PersonList getContacts={getContacts} />
    </div>
  );
};

export default App;
