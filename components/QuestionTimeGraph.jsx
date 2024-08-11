import React, { useEffect } from 'react';
import Plotly from 'plotly.js-dist';

const BarChart = ({ questionIndex, timeTaken }) => {
  useEffect(() => {
    var trace1 = {
      x: questionIndex,
      y: timeTaken,
      name: 'Question Rating vs Time Taken',
      type: 'bar'
    };

    var data = [trace1];

    var layout = {
      title: 'Question Rating vs Avg. Time Taken',
      xaxis: {
        title: 'Question Rating',
        type: 'category', // Set x-axis type to category
        fixedrange: true,  // Disable zooming on x-axis
      },
      yaxis: {
        title: 'Average Time Taken (Minutes)',
        fixedrange: true, // Disable zooming on y-axis
      },
    };

    const config = {
      responsive: true, // Make the plot responsive
      displayModeBar: false, // Hide the mode bar
    };

    Plotly.newPlot('myDiv3', data, layout, config);
  }, [questionIndex, timeTaken]);

  return (
    <div>
      <div id="myDiv3"></div>
    </div>
  );
};

export default BarChart;
