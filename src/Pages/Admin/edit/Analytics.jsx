import {Chart as ChartJS, defaults } from 'chart.js/auto';
import { Bar, Doughnut } from 'react-chartjs-2';
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import NavBar from './navBar/NavBar';
import styles from './styles/analyticsStyle.module.scss';
import sourceDataRating from '../../../data/sourceDataRating.json';
import sourceDataSex from '../../../data/sourceDataSex.json';
import sourceDataRole from '../../../data/sourceDataRole.json';

defaults.maintainAspectRatio = false;
defaults.responsive = true; 

export default function Analytics() {
    const location = useLocation();

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
                    <span className = { styles.txtTitle }>Feedback Analytics</span>
                </div>

                <span className = { `${ styles.txtTitle} ${ styles.chartHeader }` }>Data Charts</span>

                <div className = { styles.chartCont1 }>
                    <div className = { styles.stars }>
                        <span className = { `${styles.txtTitle} ${styles.chartTitle}` }>Star Feedback</span>
                        <div className = { styles.wrapper }>
                            <Doughnut 
                                data = {{
                                    labels: sourceDataRating.map((data) => data.label),
                                    datasets: [
                                        {
                                            label: "Count",
                                            data: sourceDataRating.map((data) => data.value),
                                            borderRadius: 5,
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
                                data = {{
                                    labels: sourceDataSex.map((data) => data.label),
                                    datasets: [
                                        {
                                            label: "",
                                            data: sourceDataSex.map((data) => data.value),
                                            backgroundColor: [
                                                "rgba(54,162,235, 1)",
                                                "rgba(255,99,132, 1)",
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
                                data = {{
                                    labels: sourceDataRole.map((data) => data.label),
                                    datasets: [
                                        {
                                            label: "",
                                            data: sourceDataRole.map((data) => data.value),
                                            backgroundColor: [
                                                "rgba(54,162,235, 1)",
                                                "rgba(255,99,132, 1)",
                                                "rgba(75,192,192, 1)",
                                                "rgba(255,159,64, 1)",
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
                                    <th>NAME</th>
                                    <th>RATING</th>
                                    <th>ROLE</th>
                                    <th>SEX</th>
                                    <th>COMMENT</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Lorenzo</td>
                                    <td>1 Stars</td>
                                    <td>Male</td>
                                    <td>Student</td>
                                    <td>Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment</td>
                                </tr>
                                <tr>
                                    <td>Millard</td>
                                    <td>4 Stars</td>
                                    <td>Male</td>
                                    <td>Student</td>
                                    <td>Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment</td>
                                </tr>
                                <tr>
                                    <td>Gene</td>
                                    <td>3 Stars</td>
                                    <td>Male</td>
                                    <td>Student</td>
                                    <td>Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment</td>
                                </tr>
                                <tr>
                                    <td>Big Smoke</td>
                                    <td>2 Stars</td>
                                    <td>Male</td>
                                    <td>Student</td>
                                    <td>Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment</td>
                                </tr>
                                <tr>
                                    <td>Isha</td>
                                    <td>5 Stars</td>
                                    <td>Male</td>
                                    <td>Student</td>
                                    <td>Comment Comment Comment Comment Comment Comment Comment Comment Comment Comment</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}