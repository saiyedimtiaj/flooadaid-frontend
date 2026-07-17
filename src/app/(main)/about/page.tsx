import React from "react";
import AboutHero from "./_ui/about-hero";
import AboutMission from "./_ui/about-mission";
import AboutProblem from "./_ui/about-problem";
import AboutSolution from "./_ui/about-solution";

const page = () => {
  return (
    <div>
      <AboutHero />
      <AboutMission />
      <AboutProblem />
      <AboutSolution />
    </div>
  );
};

export default page;
