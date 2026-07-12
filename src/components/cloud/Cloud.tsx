// Cloud.tsx
import React from 'react';
import styles from './cloud.module.css';
import cloud1 from '../../assets/cloud.webp';
import cloud2 from '../../assets/cloud2.webp';
import cloud3 from '../../assets/cloud3.webp';

interface CloudProps {
  src: string;
  top: string;
  duration: number;
  delay: number;
  /** How far the cloud drifts (CSS length). Defaults to 45vw. */
  driftDistance?: string;
}

const Cloud: React.FC<CloudProps> = ({
  src,
  top,
  duration,
  delay,
  driftDistance = '45vw',
}) => {
  const style = {
    top,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
    '--drift-distance': driftDistance,
  } as React.CSSProperties;

  return <>
  <img src={cloud1} className={styles.cloudStatic}  alt="cloud" />
  <img src={cloud2} className={styles.cloudStatic2} alt="cloud" />
  <img src={cloud3} className={styles.cloudStatic3} alt="cloud" />
  <img src={src} className={styles.cloud} style={style} alt="cloud" />
  </> ;
};

export default Cloud;