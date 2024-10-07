import React from 'react';
import NavIcons from '../../../assets/icon/nav/NavIcons';
import styles from './Navigation.module.scss';
const Navigation = ({ openModal }) => {
  return (
    <nav>
      <button onClick={() => openModal('events')}>
        <img src={NavIcons.event} alt="events" />
      </button>
      <hr />
      <button onClick={() => openModal('aboutUs')}>
        <img src={NavIcons.aboutus} alt="about us" />
      </button>
      <hr />
      <button onClick={() => openModal('contact')}>
      <img src={NavIcons.contact} alt="about us" />
      </button>
      <hr />
      <button onClick={() => openModal('rateExperience')}>
      <img src={NavIcons.rate} alt="about us" />
      </button>
    </nav>
  );
};

export default Navigation;
