import React from "react";
import { Space, Checkbox, InputNumber } from "antd";

const SortieEamModal = ({
  docPhysiqueOk,
  setDocPhysiqueOk,
  qteDocPhysique,
  setQteDocPhysique
}) => {
  return (
    <Space direction="vertical" style={{ width: "100%" }} size="middle">
      <Checkbox
        checked={docPhysiqueOk}
        onChange={(e) => {
          setDocPhysiqueOk(e.target.checked);
          if (!e.target.checked) setQteDocPhysique(null);
        }}
      >
        Document physique disponible
      </Checkbox>

      <InputNumber
        style={{ width: "100%" }}
        min={0}
        placeholder="Qté lue sur le document physique"
        disabled={!docPhysiqueOk}
        value={qteDocPhysique}
        onChange={setQteDocPhysique}
      />
    </Space>
  );
};

export default SortieEamModal;
