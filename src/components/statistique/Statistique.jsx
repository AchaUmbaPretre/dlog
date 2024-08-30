import React from 'react'
import { UserOutlined,FileDoneOutlined } from '@ant-design/icons';
import './statistique.scss'
import StatChart from '../statChart/StatChart';

const Statistique = () => {
  return (
    <>
        <div className="statistique">
            <div className="statistique_rows">
                <div className="statistique_row">
                    <div className="statistique_row_left">
                        <div className="statistique_row_icon"  style={{background: 'rgba(0, 0, 255, 0.137)'}}>
                            <FileDoneOutlined style={{color: 'blue'}}/>
                        </div>
                    </div>
                    <hr style={{ background: 'rgba(0, 0, 255, 0.137)', width: '4px',height:'30px', border: 'none' }}/>
                    <div className="statistique_row_right">
                        <span className="row_title">Total</span>
                        <h2 className="statistique_h2">200</h2>
                        <span className="row_desc">Contrôle de base</span>
                    </div>
                </div>
                <div className="statistique_row">
                    <div className="statistique_row_left" >
                        <div className="statistique_row_icon" style={{background: 'rgba(53, 52, 52, 0.137)'}}>
                            <FileDoneOutlined style={{color: 'rgba(53, 52, 52, 0.719)'}}/>
                        </div>
                    </div>
                    <hr style={{ background: 'rgba(53, 52, 52, 0.137)', width: '4px',height:'30px', border: 'none' }}/>
                    <div className="statistique_row_right">
                        <span className="row_title">Total</span>
                        <h2 className="statistique_h2">200</h2>
                        <span className="row_desc">Tâche</span>
                    </div>
                </div>
                <div className="statistique_row">
                    <div className="statistique_row_left">
                        <div className="statistique_row_icon"  style={{background : '#f079182d'}}>
                            <UserOutlined style={{color: 'orange'}}/>
                        </div>
                    </div>
                    <hr style={{ backgroundColor: '#f4a261', width: '5px',height:'30px', border: 'none' }} />
                    <div className="statistique_row_right">
                        <span className="row_title">Total</span>
                        <h2 className="statistique_h2">200</h2>
                        <span className="row_desc">Client</span>
                    </div>
                </div>
                <div className="statistique_row">
                    <div className="statistique_row_left">
                        <div className="statistique_row_icon"  style={{background : 'rgba(255, 0, 0, 0.164)'}}>
                            <UserOutlined style={{color: 'red'}}/>
                        </div>
                    </div>
                    <hr style={{ backgroundColor: 'rgba(255, 0, 0, 0.164)', width: '5px',height:'30px', border: 'none' }} />
                    <div className="statistique_row_right">
                        <span className="row_title">Total</span>
                        <h2 className="statistique_h2">200</h2>
                        <span className="row_desc">Fournisseur</span>
                    </div>
                </div>
            </div>
            <div className="statistique_bottom">
                <div className="statistique_bottom_rows">
                    <StatChart/>
                </div>
            </div>
        </div>
    </>
  )
}

export default Statistique