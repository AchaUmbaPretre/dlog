import './securite.scss'
import userIcon from './../../../assets/user.png';
import securiteIcon from './../../../assets/securite.png';
import BottomNav from './bottomNav/BottomNav';
import {
PoweroffOutlined
} from '@ant-design/icons';

const Securite = () => {
  return (
    <>
        <div className="securite">
            <div className="securite_wrapper">
                <div className="securite_top">
                    <div className="securite-row-img">
                        <img src={userIcon} alt="" className="securite-img" />
                        <div className="securite-row-text">
                            <span className="text_span">John</span>
                            <span className="text_span_sub">Securité</span>
                        </div>
                    </div>
                    <div className="securite-disconneted">
                        <PoweroffOutlined className='securite_icon' />
                    </div>
                </div>
                <h2 className="title-h2">👋 Bienvenue sur notre application</h2>
                <div className="securite_center_rows">
                    <img src={securiteIcon} alt="" className='img_sec' />
                </div>
                <h2 className="title-sous-h2">⚙️ Nos Options :</h2>

                <div className="securite-menus-rows">
                    <div className="securite_menu-row">
                        aaaaaaa
                    </div>
                    <div className="securite_menu-row">
                        aaaaa
                    </div>
                </div>


            </div>
            <BottomNav/>
        </div>
    </>
  )
}

export default Securite