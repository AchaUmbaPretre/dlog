import React from 'react'
import './statistiqueItems.scss'
import { BankOutlined, FileDoneOutlined, ScheduleOutlined, ProjectOutlined } from '@ant-design/icons';
import CountUp from 'react-countup';


const StatistiqueItems = () => {
  return (
    <>
      <div className="statistique_items">
        <div className="statistiqueItems_wrapper">
          <div className="statistiqueItems_rows">
            <div className="statistiqueItems-row items_orange">
              <div className="statistiqueItems-top">
                <div className="statistique_row_icon" style={{ backgroundColor: '#f4a261' }}>
                  <BankOutlined style={{ color: '#FFF' }} />
                </div>
              </div>
              <hr style={{ backgroundColor: '#f4a261', width: '4px', height: '30px', border: 'none' }} />
              <div className="statistiqueItems-bottom">
                <span className="row_title">Total</span>
                  <h2 className="statistique_h2"><CountUp end={''} /></h2>
                <span className="row_desc">Batiment</span>
              </div>
            </div>
            <div className="statistiqueItems-row items_blue">
              <div className="statistiqueItems-top">
                <div className="statistique_row_icon" style={{ backgroundColor: '#6a8caf' }}>
                  <ProjectOutlined style={{ color: '#FFF' }} />
                </div>
              </div>
              <hr style={{ backgroundColor: '#6a8caf', width: '4px', height: '30px', border: 'none' }} />
              <div className="statistiqueItems-bottom">
                <span className="row_title">Total</span>
                <h2 className="statistique_h2"><CountUp end={''} /></h2>
                <span className="row_desc">Projet</span>
              </div>
            </div>
            <div className="statistiqueItems-row items_yellow">
              <div className="statistiqueItems-top">
                <div className="statistique_row_icon" style={{ backgroundColor: '#f9c74f' }}>
                  <ScheduleOutlined style={{ color: '#FFF' }} />
                </div>
              </div>
              <hr style={{ backgroundColor: '#f9c74f', width: '4px', height: '30px', border: 'none' }} />
              <div className="statistiqueItems-bottom">
                <span className="row_title">Total</span>
                  <h2 className="statistique_h2"><CountUp end={''} /></h2>
                <span className="row_desc">Template</span>
              </div>
            </div>
            <div className="statistiqueItems-row items_red">
              <div className="statistiqueItems-top">
                <div className="statistique_row_icon" style={{ backgroundColor: '#e63946'}}>
                  <ScheduleOutlined  style={{ color: '#FFF' }} />
                </div>
              </div>
              <hr style={{ backgroundColor: '#e63946', width: '4px', height: '30px', border: 'none' }} />
              <div className="statistiqueItems-bottom">
                <span className="row_title">Total</span>
                  <h2 className="statistique_h2"><CountUp end={''} /></h2>
                <span className="row_desc">Déclaration</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default StatistiqueItems