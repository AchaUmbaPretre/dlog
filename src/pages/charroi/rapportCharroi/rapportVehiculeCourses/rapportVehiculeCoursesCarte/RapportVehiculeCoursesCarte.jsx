import React from 'react'
import { useMonitoring } from '../../../monitoring/hooks/useMonitoring';

const RapportVehiculeCoursesCarte = () => {
    const {
        mergedCourses
    } = useMonitoring();

  return (
    <div>RapportVehiculeCoursesCarte</div>
  )
}

export default RapportVehiculeCoursesCarte