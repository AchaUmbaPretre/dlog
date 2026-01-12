import React from 'react'
import { usePresenceData } from './hooks/usePresenceData'

const Presence = () => {
    const { data, setData, loading, reload } = usePresenceData();

  return (
    <div>Presence</div>
  )
}

export default Presence