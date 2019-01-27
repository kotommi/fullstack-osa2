import React from "react";

const Header = ({ name }) => {
  return <h1>{name}</h1>;
};

const Content = ({ parts }) => {
  const getParts = () => {
    return parts.map(part => <Part key={part.id} part={part} />);
  };

  return <>{getParts()}</>;
};

const Part = ({ part }) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  );
};

const Total = ({ parts }) => {
  const getTotalEx = () => {
    return parts.reduce((acc, cur) => acc + cur.exercises, 0);
  };
  return <p>yhteensä {getTotalEx()} tehtävää</p>;
};

const Course = ({ course }) => {
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

export default Course;
