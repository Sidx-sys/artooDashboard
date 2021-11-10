import React from 'react'
import { Chart } from 'react-charts'

const LineChart = ({leftScan, middleScan, rightScan}) => {
    let lineData = [{'label': "Left Sensor", 'data': leftScan}, {'label': "Middle Sensor", 'data': middleScan}, {'label' : "Right Sensor", 'data': rightScan}]
    
    const axes = React.useMemo(
        () => [
          { primary: true, type: 'linear', position: 'bottom' },
          { type: 'linear', position: 'left' }
        ],
        []
      )

    return (
        <div
          style={{
            width: '1200px',
            height: '600px',
            marginLeft: '170px',
            marginTop: '10px',
          }}
        >
          <Chart data={lineData} axes={axes} tooltip/>
        </div>
      )
}

export default LineChart;