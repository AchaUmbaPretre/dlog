import { useEffect, useState } from 'react'
import './statistiqueItems.scss'
import { BankOutlined, ScheduleOutlined, ProjectOutlined } from '@ant-design/icons';
import CountUp from 'react-countup';
import { getBatimentCount } from '../../services/typeService';
import { getProjetCount } from '../../services/projetService';
import { getDeclarationCount, getTemplateCount } from '../../services/templateService';
import { Skeleton } from 'antd';
import { useNavigate } from 'react-router-dom';

const StatistiqueItems = () => {
  const [loading, setLoading] = useState(true);
  const [batiment, setBatiment] = useState([]);
  const [projet, setProjet] = useState([]);
  const [template, setTemplate] = useState([]);
  const [declaration, setDeclaration] = useState([]);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    batiment: 0,
    projet: 0,
    template: 0,
    declaration: 0
  });
  
  useEffect(() => {
    const fetchData = async () => {
        try {
            const [batimentData, projetData, templateData, declarationData] = await Promise.all([
                getBatimentCount(),
                getProjetCount(),
                getTemplateCount(),
                getDeclarationCount()
            ]);
  
            setBatiment(batimentData.data[0]?.nbre_batiment)
            setProjet(projetData.data[0]?.nbre_projet)
            setTemplate(templateData.data[0]?.nbre_template)
            setDeclaration(declarationData.data[0]?.nbre_declaration)

            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };
  
    fetchData();
  }, []);


  return (
    <>
      <div className="statistique_items">
        <div className="statistiqueItems_wrapper">
          <div className="statistiqueItems_rows">
          { loading ? (
            <>
              <Skeleton active paragraph={{ rows: 1 }} />
              <Skeleton active paragraph={{ rows: 1 }} />
              <Skeleton active paragraph={{ rows: 1 }} />
              <Skeleton active paragraph={{ rows: 1 }} />
            </>
          ) : (
            <>
            <div className="statistiqueItems-row items_orange" onClick={() => navigate('/batiment')}>
              <div className="statistiqueItems-top">
                <div className="statistique_row_icon" style={{ backgroundColor: '#f4a261' }}>
                  <BankOutlined style={{ color: '#FFF' }} />
                </div>
              </div>
              <hr style={{ backgroundColor: '#f4a261', width: '4px', height: '30px', border: 'none' }} />
              <div className="statistiqueItems-bottom">
                <span className="row_title">Total</span>
                  <h2 className="statistique_h2"><CountUp end={batiment} /></h2>
                <span className="row_desc">Batiment</span>
              </div>
            </div>
            <div className="statistiqueItems-row items_blue" onClick={() => navigate('/projet')}>
              <div className="statistiqueItems-top">
                <div className="statistique_row_icon" style={{ backgroundColor: '#6a8caf' }}>
                  <ProjectOutlined style={{ color: '#FFF' }} />
                </div>
              </div>
              <hr style={{ backgroundColor: '#6a8caf', width: '4px', height: '30px', border: 'none' }} />
              <div className="statistiqueItems-bottom">
                <span className="row_title">Total</span>
                <h2 className="statistique_h2"><CountUp end={projet} /></h2>
                <span className="row_desc">Projet</span>
              </div>
            </div>
            <div className="statistiqueItems-row items_yellow" onClick={() => navigate('/liste_template')}>
              <div className="statistiqueItems-top">
                <div className="statistique_row_icon" style={{ backgroundColor: '#f9c74f' }}>
                  <ScheduleOutlined style={{ color: '#FFF' }} />
                </div>
              </div>
              <hr style={{ backgroundColor: '#f9c74f', width: '4px', height: '30px', border: 'none' }} />
              <div className="statistiqueItems-bottom">
                <span className="row_title">Total</span>
                  <h2 className="statistique_h2"><CountUp end={template} /></h2>
                <span className="row_desc">Template</span>
              </div>
            </div>
            <div className="statistiqueItems-row items_red" onClick={() => navigate('/liste_declaration')}>
              <div className="statistiqueItems-top">
                <div className="statistique_row_icon" style={{ backgroundColor: '#e63946'}}>
                  <ScheduleOutlined  style={{ color: '#FFF' }} />
                </div>
              </div>
              <hr style={{ backgroundColor: '#e63946', width: '4px', height: '30px', border: 'none' }} />
              <div className="statistiqueItems-bottom">
                <span className="row_title">Total</span>
                  <h2 className="statistique_h2"><CountUp end={declaration} /></h2>
                <span className="row_desc">Déclaration</span>
              </div>
            </div>
            </>
          )
          }
          </div>
        </div>
      </div>
    </>
  )
}

export default StatistiqueItems