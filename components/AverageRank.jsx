import React, { useEffect } from 'react';
import Plotly from 'plotly.js-dist';

const BarChart = ({ divisions, avgRank }) => {
  useEffect(() => {
    var trace1 = {
      x: divisions,
      y: avgRank,
      name: 'Division vs Rating Change',
      type: 'bar',
      showlegend : false,
      hovertemplate: '(%{x}, %{y}<extra></extra>)'
    };

    // Invisible scatter plot for zooming
    var trace2 = {
      x: divisions,
      y: avgRank,
      type: 'scatter',
      mode: 'lines',
      line: { width: 0 }, // Make the line invisible
      hoverinfo: 'skip', // Disable hover info
      showlegend: false,
    };

    var data = [trace1, trace2];

    const minavgRank = Math.min(...avgRank);
    const maxavgRank = Math.max(...avgRank);
    const minIndex = avgRank.indexOf(minavgRank);
    const maxIndex = avgRank.indexOf(maxavgRank);

    var layout = {
      title: 'Contest Division vs Avg. Rank',
      xaxis: {
        title: 'Contest Division',
        type: 'category',
        fixedrange: true, // Disable zooming on x-axis
      },
      yaxis: {
        title: 'Average Rank',
        fixedrange: true, // Disable zooming on y-axis
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
          ax: -50,
          ay: -50,
        },
        {
          x: divisions[maxIndex],
          y: maxavgRank,
          xref: 'x',
          yref: 'y',
          text: `Worst: ${maxavgRank}`,
          showarrow: true,
          arrowhead: 7,
          ax: -50,
          ay: -50,
        },
      ],
    };

    const config = {
      responsive: true,
      displayModeBar: false, // Show the mode bar to allow zooming
    };

    Plotly.newPlot('myDiv4', data, layout, config);
  }, [divisions, avgRank]);

  return (
    <div>
      <div id="myDiv4"></div>
      <p className='px-5 text-center mt-5'>
        This bar chart visualizes the average rank (in rated contests) achieved across different divisions averaged over the last 20 contests.
      </p>
    </div>
  );
};

export default BarChart;
