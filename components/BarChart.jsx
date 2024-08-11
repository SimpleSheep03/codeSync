import React, { useEffect } from 'react';
import Plotly from 'plotly.js-dist';

const BarChart = ({ divisions, ratingChange }) => {
  useEffect(() => {
    var trace1 = {
      x: divisions,
      y: ratingChange,
      name: 'SF Zoo',
      type: 'bar'
    };

    var data = [trace1];

    var layout = {
      title: 'Average Rating Change vs Contest Division',
      xaxis: {
        title: 'Contest Division',
        fixedrange: true,  // Disable zooming on x-axis
      },
      yaxis: {
        title: 'Average Rating Change',
        fixedrange: true,  // Disable zooming on y-axis
      },
    };

    const config = {
      responsive: true,  // Make the plot responsive
      displayModeBar: false,  // Hide the mode bar
    };

    Plotly.newPlot('myDiv2', data, layout, config);
  }, [divisions, ratingChange]);  // Added dependencies for useEffect

  return (
    <div>
      <div id="myDiv2"></div>
    </div>
  );
};

export default BarChart;
