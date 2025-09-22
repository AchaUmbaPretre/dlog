import React from 'react'
import './charroiLocalisationDetail.scss'

const CharroiLocalisationDetail = ({id}) => {
  return (
    <>
        <div className="charroi_local_detail">
            <div className="charroi_top">
                <div className="charroi_top_left">
                    <h3 className="charroi_h3">Toyota Hilux 001</h3>
                    <span className="charroi_desc">Av, colonel Mondjiba, Kintambo</span>
                </div>
                <div className="charroi_top_right">
                    <h3 className="statut_h3">ONLINE</h3>
                    <span className="charroi_desc">Dernier signal :  il y a 35 sec</span>
                </div>
            </div>
            <div className="charroi_local">
                <div className="charroi_local_left">

                </div>
                <div className="charroi_local_right">

                </div>
            </div>
        </div>
    </>
  )
}

export default CharroiLocalisationDetail