// components/Loader.jsx
import { RocketOutlined } from '@ant-design/icons';

const Loader = () => (
  <div className="loading-container">
    <div className="premium-loader">
      <RocketOutlined className="loader-icon" />
      <div className="loader-text">Chargement de votre flotte...</div>
      <div className="loader-progress">
        <div className="loader-progress-bar"></div>
      </div>
    </div>
  </div>
);

export default Loader;