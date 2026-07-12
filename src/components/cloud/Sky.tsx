import Cloud from './Cloud';
import styles from './cloud.module.css';
import cloud1 from '../../assets/cloud.webp';
import cloud2 from '../../assets/cloud2.webp';
import cloud3 from '../../assets/cloud3.webp';

const Sky = () => {
    return (
      <div className={styles['cloud-container']}>
        <Cloud src={cloud1} top="-10%" duration={7} delay={0} driftDistance="0" />
        <Cloud src={cloud2} top="0" duration={8} delay={1} driftDistance="-5px" />
        <Cloud src={cloud3} top="-20%" duration={9} delay={2} driftDistance="-25px" />
      </div>
    );
  };

export default Sky;