import React, { useCallback, useRef, useState, useEffect } from "react";
import { Form, Select, Divider, Button, notification, Card, Progress, Typography } from "antd";
import "./relierVehiculeSite.scss";
import { getSite, getVehicule, postSite, postSiteVehicule } from "../../../services/charroiService";

const { Option } = Select;
const { Title } = Typography;

const RelierVehiculeSite = ({ closeModal, fetchData }) => {
  const [form] = Form.useForm();
  const [site, setSite] = useState([]);
  const [vehicule, setVehicule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const progressRef = useRef(null);

  const fetchDatas = async () => {
    try {
      const [vehiculeData, siteData] = await Promise.all([getVehicule(), getSite()]);
      setVehicule(vehiculeData?.data?.data || []);
      setSite(siteData?.data?.data || []);
    } catch (error) {
      console.error("Erreur fetch datas :", error);
    }
  };

  useEffect(() => { fetchDatas(); }, []);

  const startProgress = () => {
    setProgress(10);
    if (progressRef.current) clearInterval(progressRef.current);

    progressRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) {
          clearInterval(progressRef.current);
          return p;
        }
        return Math.min(p + Math.floor(Math.random() * 10) + 5, 90);
      });
    }, 500);
  };

  const finishProgress = () => {
    if (progressRef.current) clearInterval(progressRef.current);
    setProgress(100);
    setSuccess(true);

    setTimeout(() => {
      setProgress(0);
      setSuccess(false);
    }, 1200);
  };

  const onFinish = useCallback(async (values) => {
    setLoading(true);
    startProgress();

    const payload = {
      id_site: values.id_site,
      vehicules: values.vehicules,
    };

    try {
      await postSiteVehicule(payload);
      finishProgress();

      notification.success({
        message: "Succès",
        description: "Les véhicules ont été reliés au site avec succès 🚗💨",
        placement: "topRight",
      });

      setTimeout(() => {
        form.resetFields();
        closeModal();
        fetchData();
      }, 1200);
    } catch (error) {
      console.error("Erreur :", error);
      setProgress(0);
      notification.error({
        message: "Erreur",
        description: "Une erreur est survenue lors du rattachement.",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  }, [closeModal, fetchData, form]);

  return (
    <Card bordered={false} className="vehicule-card">
      <div className="relier-vehicule-container" style={{ position: "relative" }}>
        <Title level={3} className="vehicule-title">Relier les véhicules au site</Title>
        <Divider />
        {progress > 0 && (
          <Progress
            percent={progress}
            strokeWidth={8}
            status={progress < 100 ? "active" : "success"}
            style={{ marginBottom: "1rem" }}
          />
        )}

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="id_site"
            label="Sélectionner un Site"
            rules={[{ required: true, message: "Veuillez sélectionner un site" }]}
          >
            <Select placeholder="Choisir un site" showSearch optionFilterProp="children">
              {site.map(s => (
                <Option key={s.id_site} value={s.id_site}>
                  {s.nom_site} — {s.CodeSite}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="vehicules"
            label="Sélectionner les véhicules"
            rules={[{ required: true, message: "Veuillez sélectionner au moins un véhicule" }]}
          >
            <Select
              mode="multiple"
              placeholder="Choisir plusieurs véhicules"
              optionFilterProp="children"
              showSearch
            >
              {vehicule.map(v => (
                <Option key={v.id_vehicule} value={v.id_vehicule}>
                  {v.immatriculation} — {v.nom_marque ?? 'N/A'}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading} block className="shine-btn">
            Relier les véhicules au site
          </Button>
        </Form>

        <div className={`confetti ${success ? "show" : ""}`} aria-hidden="true">
          {[...Array(10)].map((_, i) => <span key={i} />)}
        </div>
      </div>
    </Card>
  );
};

export default RelierVehiculeSite;
