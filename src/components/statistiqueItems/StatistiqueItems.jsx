import React from 'react'
import './statistiqueItems.scss'
import { FileSyncOutlined, FileDoneOutlined, TeamOutlined } from '@ant-design/icons';
import CountUp from 'react-countup';


const StatistiqueItems = () => {
  return (
    <>
      <div className="statistique_items">
        <div className="statistiqueItems_wrapper">
          <div className="statistiqueItems_rows">
            <div className="statistiqueItems-row">
              <div className="statistiqueItems-top">
                <div className="statistique_row_icon" style={{ backgroundColor: '#f4a261' }}>
                  <FileDoneOutlined style={{ color: '#FFF' }} />
                </div>
              </div>
              <hr style={{ backgroundColor: '#f4a261', width: '4px', height: '30px', border: 'none' }} />
              <div className="statistiqueItems-bottom">
                <span className="row_title">Total</span>
                  <h2 className="statistique_h2"><CountUp end={''} /></h2>
                <span className="row_desc">Ctrl de base</span>
              </div>
            </div>
            <div className="statistiqueItems-row">
              <div className="statistiqueItems-top">
                <div className="statistique_row_icon" style={{ backgroundColor: '#6a8caf' }}>
                  <FileDoneOutlined style={{ color: '#FFF' }} />
                </div>
              </div>
              <hr style={{ backgroundColor: '#6a8caf', width: '4px', height: '30px', border: 'none' }} />
              <div className="statistiqueItems-bottom">
                <span className="row_title">Total</span>
                  <h2 className="statistique_h2"><CountUp end={''} /></h2>
                <span className="row_desc">Ctrl de base</span>
              </div>
            </div>
            <div className="statistiqueItems-row">
              <div className="statistiqueItems-top">
                <div className="statistique_row_icon" style={{ backgroundColor: '#f9c74f' }}>
                  <FileDoneOutlined style={{ color: '#FFF' }} />
                </div>
              </div>
              <hr style={{ backgroundColor: '#f9c74f', width: '4px', height: '30px', border: 'none' }} />
              <div className="statistiqueItems-bottom">
                <span className="row_title">Total</span>
                  <h2 className="statistique_h2"><CountUp end={''} /></h2>
                <span className="row_desc">Ctrl de base</span>
              </div>
            </div>
            <div className="statistiqueItems-row">
              <div className="statistiqueItems-top">
                <div className="statistique_row_icon" style={{ backgroundColor: '#e63946'}}>
                  <FileDoneOutlined style={{ color: '#FFF' }} />
                </div>
              </div>
              <hr style={{ backgroundColor: '#e63946', width: '4px', height: '30px', border: 'none' }} />
              <div className="statistiqueItems-bottom">
                <span className="row_title">Total</span>
                  <h2 className="statistique_h2"><CountUp end={''} /></h2>
                <span className="row_desc">Ctrl de base</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default StatistiqueItems