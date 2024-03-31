import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useRef } from 'react';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Sessions rating bar chart that
// displays the average sessions score for each week.
// Uses ChartJs library for the bar chart.
export default function SessionRatingBar2(props) {
  const weeksSessionData = props.weeksSessionData;

  const averageScores = {};
  for (let i = 0; i < 14; i++) {
    averageScores[i] = 0;
  }
  for (const [weekNo, sessions] of Object.entries(weeksSessionData)) {
    let sessionTotalScore = 0;
    // Computes the average score for each week
    // by adding the total session ratings
    // and dividing by the number of sessions that week
    for (const sessionData of sessions) {
      const sessionOverallScoresData = sessionData.overallScores
        ? sessionData.overallScores
        : [];
      const sessionOverallScores = sessionOverallScoresData.map(
        (data) => data.score
      );
      const sessionOverallScore = sessionOverallScores.reduce(
        (a, b) => a + b,
        0
      );
      if (sessionOverallScore > 0) {
        sessionTotalScore += sessionOverallScore / sessionOverallScores.length;
      }
    }
    const sessionAverageScore = sessionTotalScore / sessions.length;
    if (Object.keys(averageScores).includes(weekNo)) {
      averageScores[weekNo] = sessionAverageScore;
    } else {
      averageScores[weekNo] = sessionAverageScore;
    }
  }
  const labels = Object.keys(averageScores).map((key) => {
    if (key.length <= 2) {
      return `Week ${key}`;
    } else {
      return key + ` Week`;
    }
  });
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Average rating',
        data: Object.values(averageScores),
        backgroundColor: 'teal',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Average rating by week',
      },
      legend: {
        labels: {
          font: {
            family: 'Quicksand',
            size: 16,
          },
        },
      },
    },
  };
  const chartRef = useRef();

  return (
    <Bar
      options={options}
      data={data}
      ref={chartRef}
      onClick={(event) => {
        if (chartRef.current) {
          const chart = ChartJS.getChart(chartRef.current);
          const points = chart.getElementsAtEventForMode(
            event,
            'nearest',
            { intersect: true },
            true
          );
          if (points.length > 0) {
            if (points[0].index > 13) {
              // slicing string to return just the week name
              // e.g. Reading Week => Reading
              const label = labels[points[0].index].slice(0, -5);
              props.setWeekHandler(label);
            } else {
              props.setWeekHandler(points[0].index);
            }
          }
        }
      }}
    />
  );
}
