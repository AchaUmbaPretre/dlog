import { useEffect, useState } from "react";
import { Card, Spin } from "antd";
import { fetchAddress } from "../../../../../../utils/fetchAddress";

const TailAddresses = ({ vehicle }) => {
  const [addresses, setAddresses] = useState({});

  useEffect(() => {
    if (!vehicle?.tail) return;

    const loadAddresses = async () => {
      const newAddresses = {};

      for (const t of vehicle.tail) {
        const lat = parseFloat(t.lat);
        const lng = parseFloat(t.lng);
        const key = `${lat}_${lng}`;

        // Si déjà chargé (ou en cache localStorage), ne pas relancer
        if (addresses[key]) {
          newAddresses[key] = addresses[key];
          continue;
        }

        // Charge via fetchAddress()
        newAddresses[key] = await fetchAddress(t);
      }

      setAddresses(prev => ({ ...prev, ...newAddresses }));
    };

    loadAddresses();
  }, [vehicle]);

  return (
    <>
      {vehicle.tail?.length > 0 && (
        <Card title="Trajectoire (tail)" bordered style={{ flex:1 }}>
          {vehicle.tail.map((t, i) => {
            const lat = parseFloat(t.lat);
            const lng = parseFloat(t.lng);
            const key = `${lat}_${lng}`;

            const addr = addresses[key];

            return (
              <p key={i}>
                #{i + 1}: Adresse:{" "}
                {addr ? (
                  addr
                ) : (
                  <Spin size="small" />
                )}
              </p>
            );
          })}
        </Card>
      )}
    </>
  );
};

export default TailAddresses;
