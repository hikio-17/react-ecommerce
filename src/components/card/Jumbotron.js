import React from "react";
import Typewriter from "typewriter-effect";

const Jumbotron = ({ teks }) => {
  return (
    <Typewriter
      options={{
        strings: teks,
        autoStart: true,
        loop: true,
      }}
    />
  );
};

export default Jumbotron;
