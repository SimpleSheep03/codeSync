import React, { useEffect } from 'react';
import Plotly from 'plotly.js-dist';

const BarChart = ({ divisions, avgRank }) => {
  useEffect(() => {
    var trace1 = {
      x: divisions,
      y: avgRank,
      name: 'Division vs Rating Change',
      type: 'bar',
    };

    var data = [trace1];

    // Find the min and max avgRank values
    const minavgRank = Math.min(...avgRank);
    const maxavgRank = Math.max(...avgRank);
    const minIndex = avgRank.indexOf(minavgRank);
    const maxIndex = avgRank.indexOf(maxavgRank);

    var layout = {
      title: 'Contest Division vs Avg. Rank',
      xaxis: {
        title: 'Contest Division',
        type: 'category', // Set x-axis type to category
        fixedrange: true,  // Disable zooming on x-axis
      },
      yaxis: {
        title: 'Average Rank',
        fixedrange: true,  // Disable zooming on y-axis
      },
      annotations: [
        {
          x: divisions[minIndex],
          y: minavgRank,
          xref: 'x',
          yref: 'y',
          text: `Best: ${minavgRank}`,
          showarrow: true,
          arrowhead: 7,
          ax: -50, // Adjusted to tilt the line
          ay: -50, // Adjusted to tilt the line
        },
        {
          x: divisions[maxIndex],
          y: maxavgRank,
          xref: 'x',
          yref: 'y',
          text: `Worst: ${maxavgRank}`,
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

    Plotly.newPlot('myDiv4', data, layout, config);
  }, [divisions, avgRank]);  // Added dependencies for useEffect

  return (
    <div>
      <div id="myDiv4"></div>
      <p className='px-5 text-center mt-5'>
        This bar chart visualizes the average rank achieved across different divisions averaged over the last 30 contests.
      </p>

    </div>
  );
};

export default BarChart;
