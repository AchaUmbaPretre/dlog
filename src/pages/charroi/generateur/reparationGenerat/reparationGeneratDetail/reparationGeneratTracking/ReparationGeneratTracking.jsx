import React, { useEffect, useState, useCallback } from 'react';
import { Form, notification } from 'antd';
import {
  getEvaluation,
  getPiece,
  getStatutVehicule,
  getTypeReparation
} from '../../../../../../services/charroiService';
import { getCat_inspection } from '../../../../../../services/batimentService';
import { useReparationTracking } from './hook/useReparationTracking';

const ReparationGeneratTracking = ({ idRep }) => {
  const [form] = Form.useForm();
  const { data, loading, refresh } = useReparationTracking(idRep)

  return (
    <div>
      ReparationGeneratTracking – ID : {idRep}
    </div>
  );
};

export default ReparationGeneratTracking;
