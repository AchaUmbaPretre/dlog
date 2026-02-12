import React, { useState } from "react";
import { Card, DatePicker, Button, Space, notification, Input, Select } from "antd";
import { ExportOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import 'dayjs/locale/fr';
import { useRapportPresenceSite } from "./hooks/useRapportPresenceSite";

dayjs.locale('fr');
const { MonthPicker } = DatePicker;
const { Search } = Input;

const RapportPresenceSite = () => {
    const [searchValue, setSearchValue] = useState("");
    const { data, loading, monthRange, setMonthRange, reload: load } = useRapportPresenceSite();

    const exportExcel = () => {

    };

  return (
    <>
        <Card
            bordered={false}
            title="Rapport Mensuel des sites"
            extra={
                <Space wrap>
                <MonthPicker
                    placeholder="Sélectionner le mois"
                    format="MMMM YYYY"
                    value={dayjs(`${monthRange.year}-${monthRange.month}-01`)}
                    onChange={(date) =>
                    date &&
                    setMonthRange({
                        month: date.month() + 1,
                        year: date.year()
                    })
                    }
                />
                
                <Search
                    placeholder="Recherche utilisateur"
                    allowClear
                    onChange={e => setSearchValue(e.target.value)}
                    style={{ width: 250 }}
                />
                <Button icon={<ExportOutlined />} onClick={exportExcel}>
                    Exporter Excel
                </Button>
                </Space>
            }
        >

        </Card>
    </>
  )
}

export default RapportPresenceSite