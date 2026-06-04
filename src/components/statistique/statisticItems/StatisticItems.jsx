import React from 'react'
import { FileSyncOutlined, FileDoneOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from 'antd';
import CountUp from 'react-countup';


const StatisticItems = ({ loading, role, stats }) => {
    const navigate = useNavigate();

  return (
    <>
        {loading ? (
            <>
                <Skeleton active paragraph={{ rows: 1 }} />
                <Skeleton active paragraph={{ rows: 1 }} />
                <Skeleton active paragraph={{ rows: 1 }} />
                <Skeleton active paragraph={{ rows: 1 }} />
            </>
        ) : (
                    <>
                    {
                        role === 'Admin' &&
                        <div className="statistique_row static_bleu" style={{ borderColor: '#3A5FCD' }} onClick={() => navigate('/controle')}>
                            <div className="statistique_row_left">
                                <div className="statistique_row_icon" style={{ backgroundColor: '#3A5FCD1A' }}>
                                    <FileDoneOutlined style={{ color: '#3A5FCD' }} />
                                </div>
                            </div>
                            <hr style={{ backgroundColor: '#3A5FCD', width: '4px', height: '30px', border: 'none' }} />
                            <div className="statistique_row_right">
                                <span className="row_title">Total</span>
                                <h2 className="statistique_h2"><CountUp end={stats.controle} /></h2>
                                <span className="row_desc">Ctrl de base</span>
                            </div>
                        </div>
                    }
                        <div className="statistique_row static_gris" style={{ borderColor: '#707070' }} onClick={() => navigate('/tache')}>
                            <div className="statistique_row_left">
                                <div className="statistique_row_icon" style={{ backgroundColor: '#7070701A' }}>
                                    <FileSyncOutlined style={{ color: '#707070' }} />
                                </div>
                            </div>
                            <hr style={{ backgroundColor: '#707070', width: '4px', height: '30px', border: 'none' }} />
                            <div className="statistique_row_right">
                                <span className="row_title">Total</span>
                                <h2 className="statistique_h2"><CountUp end={stats.tache} /></h2>
                                <span className="row_desc">Tâche</span>
                            </div>
                        </div>
                        <div className="statistique_row static_orange" style={{ borderColor: '#FF8C42' }} onClick={() => navigate('/client')}>
                            <div className="statistique_row_left">
                                <div className="statistique_row_icon" style={{ backgroundColor: '#FF8C421A' }}>
                                    <TeamOutlined style={{ color: '#FF8C42' }} />
                                </div>
                            </div>
                            <hr style={{ backgroundColor: '#FF8C42', width: '5px', height: '30px', border: 'none' }} />
                            <div className="statistique_row_right">
                                <span className="row_title">Total</span>
                                <h2 className="statistique_h2"><CountUp end={stats.client} /></h2>
                                <span className="row_desc">Client</span>
                            </div>
                        </div>
                        <div className="statistique_row static_cyan" style={{ borderColor: '#2BA4C6' }} onClick={() => navigate('/fournisseur')}>
                            <div className="statistique_row_left">
                                <div className="statistique_row_icon" style={{ backgroundColor: '#2BA4C61A' }}>
                                    <TeamOutlined style={{ color: '#2BA4C6' }} />
                                </div>
                            </div>
                            <hr style={{ backgroundColor: '#2BA4C6', width: '5px', height: '30px', border: 'none' }} />
                            <div className="statistique_row_right">
                                <span className="row_title">Total</span>
                                <h2 className="statistique_h2"><CountUp end={stats.fournisseur} /></h2>
                                <span className="row_desc">Fournisseur</span>
                            </div>
                        </div>
                    </>
                )}
    </>
  )
}

export default StatisticItems