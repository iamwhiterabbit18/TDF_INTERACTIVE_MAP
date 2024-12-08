import {Chart as ChartJS, defaults } from 'chart.js/auto';
import { Bar, Doughnut } from 'react-chartjs-2';
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';

import NavBar from './navBar/NavBar';
import styles from './styles/analyticsStyle.module.scss';
import sourceDataRating from '../../../data/sourceDataRating.json';
import sourceDataSex from '../../../data/sourceDataSex.json';
import sourceDataRole from '../../../data/sourceDataRole.json';

defaults.maintainAspectRatio = false;
defaults.responsive = true; 

export default function Analytics() {
    const location = useLocation();
    const [starFeedback, setStarFeedback] = useState([]);
    const [sexDistribution, setSexDistribution] = useState([]);
    const [roleDistribution, setRoleDistribution] = useState([]);
    const [guestLogs, setGuestLogs] = useState([]);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/guest/analytics'); // Adjust the endpoint if necessary
                const data = await response.json();
                console.log("Fetched Data:", data)
                // Set state for the charts
                setStarFeedback(data.ratings);
                setSexDistribution(data.sexes);
                setRoleDistribution(data.roles);
            } catch (error) {
                console.error('Error fetching analytics:', error);
            }
        };
    
        fetchAnalytics();
    }, []);

    useEffect(() => {
        const fetchGuestLogs = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/guest/guestLogs'); // Adjust the endpoint if necessary
                const data = await response.json();
                setGuestLogs(data);
            } catch (error) {
                console.error('Error fetching guest logs:', error);
            }
        };
    
        fetchGuestLogs();
    }, []);
    


    useEffect(() => {
        const rootDiv = document.getElementById("root");
    
        // Add or remove className based on current page
    
        if (location.pathname === "/analytics") {
          rootDiv.classList.add(styles.rootDiv);
        } else {
          rootDiv.classList.remove(styles.rootDiv);
        }
      }, [location])

    return (
        <>
            <NavBar />

            <div className = { styles.analyticsContainer }>
                <div className={styles.header}>
                    <span className = { styles.txtTitle }>Analytics</span>
                </div>

                <span className = { `${ styles.txtTitle} ${ styles.chartHeader }` }>Data Charts</span>

                <div className = { styles.chartCont1 }>
                    <div className = { styles.stars }>
                        <span className = { `${styles.txtTitle} ${styles.chartTitle}` }>Star Feedback</span>
                        <div className = { styles.wrapper }>
                        <Doughnut
                                data={{
                                    labels: starFeedback.map((item) => item.label),
                                    datasets: [
                                        {
                                            label: 'Count',
                                            data: starFeedback.map((item) => item.value),
                                            borderRadius: 5,
                                            backgroundColor: [
                                                'rgba(255, 99, 132, 0.8)',
                                                'rgba(54, 162, 235, 0.8)',
                                                'rgba(255, 206, 86, 0.8)',
                                                'rgba(75, 192, 192, 0.8)',
                                                'rgba(153, 102, 255, 0.8)',
                                            ],
                                        },
                                    ],
                                }}
                            />
                        </div>
                    </div>                      
                </div>

                <div className = { styles.chartCont2 }>
                    <div className = { styles.sex }>
                        <span className = {`${styles.txtTitle} ${styles.chartTitle}`}>Respondents' Sex</span>
                        <div className = { styles.wrapper }>
                        <Bar
                                data={{
                                    labels: sexDistribution.map((item) => item.label),
                                    datasets: [
                                        {
                                            label: 'Count',
                                            data: sexDistribution.map((item) => item.value),

                                            backgroundColor: [
                                                'rgba(54,162,235, 1)',
                                                'rgba(255,99,132, 1)',
                                                'rgba(153, 102, 255, 1)',
                                            ],
                                            borderRadius: 5,
                                        },
                                    ],
                                }}

                                options={{
                                    plugins: {
                                        legend: {
                                            display: false, // Hides the legend
                                        },
                                    },
                                    scales: {
                                        x: {
                                            ticks: {
                                                display: true, // show x-axis labels
                                            },
                                        },
                                        y: {
                                            ticks: {
                                                display: true, // show y-axis labels
                                            },
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                    <div className = { styles.role }>
                        <span className = {`${styles.txtTitle} ${styles.chartTitle}`}>Respondents' Role</span>
                        <div className = { styles.wrapper }>
                        <Bar
                                data={{
                                    labels: roleDistribution.map((item) => item.label),
                                    datasets: [
                                        {
                                            label: 'Count',
                                            data: roleDistribution.map((item) => item.value),
                                            
                                            backgroundColor: [
                                                'rgba(54,162,235, 1)',
                                                'rgba(255,99,132, 1)',
                                                'rgba(75,192,192, 1)',
                                                'rgba(255,159,64, 1)',
                                            ],
                                            borderRadius: 5,
                                        },
                                    ],
                                }}

                                options={{
                                    plugins: {
                                        legend: {
                                            display: false, // Hides the legend
                                        },
                                    },
                                    scales: {
                                        x: {
                                            ticks: {
                                                display: true, // show x-axis labels
                                            },
                                        },
                                        y: {
                                            ticks: {
                                                display: true, // show y-axis labels
                                            },
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className = { styles.feedbackList}>
                    <span className = { `${ styles.txtTitle} ${ styles.feedbackHeader }` }>Feedback List</span>
                    <div className = { styles.tblWrapper }>
                    <table>
                        <thead>
                            <tr>
                                <th>GUEST ID</th>
                                <th>RATING</th>
                                <th>SEX</th>
                                <th>ROLE</th>
                                <th>DATE&TIME</th>
                                <th>COMMENT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {guestLogs.map((log, index) => (
                                <tr key={index}>
                                    <td>{log.guestId}</td>
                                    <td>{log.feedback?.rating ? `${log.feedback.rating} Stars` : 'No Rating'}</td>
                                    <td>{log.sexAtBirth}</td>
                                    <td>{log.role}</td>
                                    <td>{moment(log.feedback?.feedbackDate).format('MMM D, YYYY , h:mm A')}</td>
                                    <td>{log.feedback?.comment || 'No Comment'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    </div>
                </div>
            </div>
        </>
    )
}