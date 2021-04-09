import React from "react";

const Blurb = () => (
  <div className="grid-in-blurb flex items-center justify-center md:pr-6">
    <div>
      <h2 className="pb-4 text-2xl font-bold">Am I losing weight?</h2>
      <div className="pb-4">TrendWeight can help answer that question by analyzing your day to day weight changes</div>
      <div className="pb-4">
        <b>Step 1</b>: Weigh yourself every day.
        <br />
        <b>Step 2</b>: There is no Step 2!
      </div>
      <div className="pb-4">
        <span className="italic">Losing weight is hard</span>. Don't beat yourself just because your weight is higher
        today than it was yesterday.
      </div>
      <div>
        Our weight fluxuates—it just does. That's completely normal. TrendWeight is a tool that helps you focus on your
        weight <i>trend</i> over time instead of day to day changes.
      </div>
    </div>
  </div>
);

export default Blurb;
