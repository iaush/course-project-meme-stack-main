import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ScoreDistribution = (props) => {
  //define the axis labels for chart
  let dataobj = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  //loop through the scores and add to correct key in object to get total number of instance per score
  props.score.forEach((element) => {
    if (dataobj.hasOwnProperty(String(element.score))) {
      dataobj[String(element.score)] += 1;
    } else {
      dataobj[String(element.score)] = 1;
    }
  });

  // define chart parameters
  let data = {
    labels: Object.keys(dataobj),
    datasets: [
      {
        label: 'Topic Understanding Rating',
        backgroundColor: 'rgba(5, 139, 242, 1)',
        borderColor: 'rgb(5, 139, 242)',
        borderWidth: 1,
        data: Object.values(dataobj),
      },
    ],
  };
  let options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Bar Chart',
      },
    },
  };

  return (
    <div>
      <Bar redraw={false} data={data} options={options} />
    </div>
  );
};

export default ScoreDistribution;
