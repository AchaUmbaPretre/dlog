import { useNavigate } from 'react-router-dom'
import './topBarModelTv.scss'
import { Tooltip, Badge } from 'antd'
import { FullscreenOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'

const TopBarModelTv = () => {
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, "0")
      const minutes = String(now.getMinutes()).padStart(2, "0")
      const seconds = String(now.getSeconds()).padStart(2, "0")
      setCurrentTime(`${hours}:${minutes}:${seconds}`)
    }

    updateTime() // initialisation immédiate
    const timer = setInterval(updateTime, 1000) // mise à jour chaque seconde

    return () => clearInterval(timer) // nettoyage du timer
  }, [])

  return (
    <div className="topBar_model">
      <div className="topbar_model_wrapper">
        {/* Logo */}
        <div
          className="topbar_model_left"
          onClick={() => navigate('/')}
          role="button"
          tabIndex={0}
        >
          <span className="logo">
            <div className="logo-d">D</div>LOG
          </span>
        </div>

        {/* Titre */}
        <div className="topbar_model_center">
          <h2 className="topbar_model_h2">Tableau de bord</h2>
        </div>

        {/* Infobulle + Horodatage */}
        <div className="topbar_model_right">
          <Tooltip title="Affichage plein écran avec rotation automatique des vues">
            <FullscreenOutlined className="fullscreen-icon" />
          </Tooltip>

          <Badge
            count={`MAJ à ${currentTime}`}
            style={{ backgroundColor: '#52c41a' }}
            className="maj-badge"
          />
        </div>
      </div>
    </div>
  )
}

export default TopBarModelTv
