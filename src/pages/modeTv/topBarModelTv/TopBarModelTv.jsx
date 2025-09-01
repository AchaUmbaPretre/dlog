import { useNavigate } from 'react-router-dom'
import './topBarModelTv.scss'

const TopBarModelTv = () => {
    const navigate = useNavigate();

  return (
    <>
        <div className="topBar_model">
            <div className="topbar_model_wrapper">
                <div className="topbar_model_left" onClick={() => navigate('/')} role="button" tabIndex={0}>
                    <span className="logo"><div className="logo-d">D</div>LOG</span>
                </div>

                <div className="topbar_model_center">
                    <h2 className="topbar_model_h2">Tableau de bord</h2>
                </div>

                <div className="topbar_model_right">
                    LLLLL
                </div>
            </div>
        </div>
    </>
  )
}

export default TopBarModelTv