import { Line } from 'react-chartjs-2'

export default function MonthlyChart({figuresArray, label}){
    const data = {
        labels: "Montly Routes",
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [{
            label: label,
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,1)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: figuresArray
        }]
    }
    return(
        <Line data={data} />
    )
}