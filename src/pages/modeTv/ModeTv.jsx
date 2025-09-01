import './modeTv.scss'
import ModeTvCardPonct from './modeTvCardPonct/ModeTvCardPonct';
import ModeTvService from './modeTvService/ModeTvService';
import TopBarModelTv from './topBarModelTv/TopBarModelTv'
import { InfoCircleFilled, InfoCircleOutlined } from '@ant-design/icons';

const ModeTv = () => {
  return (
    <>
        <div className="mode_tv">
           <TopBarModelTv/>
           <div className="model_tv_wrapper">
                <div className="model_tv_left">
                    <div className="model_tv_anomalie">
                        <div className="anomalie_left">
                            <h3 className="anomalie_h3">Anomalies du jour</h3>
                            <div className="anomalie_wrapper">
                            <div className="anomalie_card danger">
                                <InfoCircleFilled className="anomalie_icon" />
                                <span className="anomalie_desc">Départs sans validation 2</span>
                                <span className="anomalie_badge">!</span>
                            </div>
                            <div className="anomalie_card warning">
                                <InfoCircleOutlined className="anomalie_icon" />
                                <span className="anomalie_desc">Retours en retard 1</span>
                                <span className="anomalie_badge">!</span>
                            </div>
                            </div>
                        </div>
                        <div className="anomalie_right">
                            <button className="anomalie_btn">Voir tout</button>
                        </div>
                    </div>

                    <ModeTvCardPonct/>
                    <ModeTvService/>

                </div>
                <div className="model_tv_right">
                bbbbb
                </div>
            </div>

        </div>
    </>
  )
}

export default ModeTv