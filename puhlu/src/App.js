import React, { useState, useEffect } from "react";
import contactService from "./services/contacts";

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

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  const error = {
    color: message.includes("valitettavasti") ? "red" : "green",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  };

  return <div style={error}>{message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [errorMessage, setErrorMessage] = useState("testivirhe");

  const personHook = () => {
    contactService.getAll().then(persons => {
      setPersons(persons);
    });
  };
  // fetch persons from json
  useEffect(personHook, []);

  const personsToShow =
    filter.length === 0
      ? persons
      : persons.filter(person => {
          return person.name
            .toLowerCase()
            .includes(filter.trim().toLowerCase());
        });

  const addContact = event => {
    event.preventDefault();
    const contactObject = {
      name: newName,
      number: newNumber
    };
    const found = persons.find(person => {
      return person.name === contactObject.name;
    });
    if (found !== undefined) {
      const changedContact = { ...found, number: newNumber };
      editContact(changedContact);
      return;
    }
    contactService.create(contactObject).then(newPerson => {
      setPersons(persons.concat(newPerson));
      setErrorMessage(`Lisättiin ${newPerson.name}`);
    });
    setNewName("");
    setNewNumber("");
  };

  const editContact = contactObject => {
    const ans = window.confirm(
      `${
        contactObject.name
      } on jo luettelossa, korvataanko vanha numero uudella?`
    );
    if (!ans) {
      return;
    }
    contactService.update(contactObject.id, contactObject).then(() => {
      setPersons(
        persons.map(person => {
          return contactObject.id === person.id ? contactObject : person;
        })
      );
      setErrorMessage(`Muokattiin ${contactObject.name}`);
    });
  };

  const removeContact = (id, name) => {
    const ans = window.confirm(`poistetaanko ${name}`);
    if (!ans) {
      return;
    }
    contactService
      .remove(id)
      .then(() => {
        setPersons(
          persons.filter(p => {
            return p.id !== id;
          })
        );
        setErrorMessage(`Poistettiin ${name}`);
      })
      .catch(error => {
        setPersons(
          persons.filter(p => {
            return p.id !== id;
          })
        );
        setErrorMessage(`${name} oli jo valitettavasti poistettu`);
      });
  };

  const getContacts = () => {
    return personsToShow.map(person => {
      return (
        <li key={person.id}>
          {person.name} {person.number}
          <button onClick={() => removeContact(person.id, person.name)}>
            poista
          </button>
        </li>
      );
    });
  };

  return (
    <div>
      <h2>Puhelinluettelo</h2>
      <Notification message={errorMessage} />
      <Filter
        filter={filter}
        handleFilter={event => setFilter(event.target.value)}
      />
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleName={event => setNewName(event.target.value)}
        handleNumber={event => setNewNumber(event.target.value)}
        addContact={addContact}
      />
      <PersonList getContacts={getContacts} />
    </div>
  );
};

export default App;
