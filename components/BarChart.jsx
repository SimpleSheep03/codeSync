import React, { useEffect } from 'react';
import Plotly from 'plotly.js-dist';

const BarChart = ({ divisions, ratingChange }) => {
  useEffect(() => {
    var trace1 = {
      x: divisions,
      y: ratingChange,
      name: 'Division vs Rating Change',
      type: 'bar',
    };

    var data = [trace1];

    // Find the min and max ratingChange values
    const minRatingChange = Math.min(...ratingChange);
    const maxRatingChange = Math.max(...ratingChange);
    const minIndex = ratingChange.indexOf(minRatingChange);
    const maxIndex = ratingChange.indexOf(maxRatingChange);

    var layout = {
      title: 'Contest Division vs Avg. Rating Change',
      xaxis: {
        title: 'Contest Division',
        type: 'category', // Set x-axis type to category
        fixedrange: true,  // Disable zooming on x-axis
      },
      yaxis: {
        title: 'Average Rating Change',
        fixedrange: true,  // Disable zooming on y-axis
      },
      annotations: [
        {
          x: divisions[minIndex],
          y: minRatingChange,
          xref: 'x',
          yref: 'y',
          text: `Min: ${minRatingChange}`,
          showarrow: true,
          arrowhead: 7,
          ax: -50, // Adjusted to tilt the line
          ay: -50, // Adjusted to tilt the line
        },
        {
          x: divisions[maxIndex],
          y: maxRatingChange,
          xref: 'x',
          yref: 'y',
          text: `Max: ${maxRatingChange}`,
          showarrow: true,
          arrowhead: 7,
          ax: -50, // Adjusted to tilt the line
          ay: -50, // Adjusted to tilt the line
        },
      ],
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
