import {
  ClockCircleOutlined,
  CarOutlined,
  DashboardOutlined,
} from "@ant-design/icons";

import "./ravitaillementRecent.scss";

const RavitaillementRecent = ({
  data = [],
}) => {
  return (
    <div className="ravitaillementRecent">

      <div className="ravitHeader">

        <div>

          <h3>
            Ravitaillements récents
          </h3>

          <p>
            Dernières opérations carburant
          </p>

        </div>

        <div className="ravitCount">
          {data.length}
        </div>

      </div>

      <div className="timeline">

        {data.slice(0, 5).map((item) => (

            <div
            key={item.id}
            className="timelineItem"
            >

            <div className="timelineLeft">

                <div className="vehicleIcon">
                <CarOutlined />
                </div>

                <div className="vehicleInfo">
                <h4>
                    {item.vehicule?.immatriculation}
                </h4>

                <span>
                    {item.type_carburant}
                </span>
                </div>

            </div>

            <div className="timelineRight">

                <div className="litreBadge">
                {item.quantite?.formate}
                </div>

                <div className="amountInfo">

                <h5>
                    {item.montant?.usd_formate}
                </h5>

                <span>
                    <ClockCircleOutlined />
                    {item.date?.split(" ")[0]}
                </span>

                </div>

            </div>

            </div>

        ))}

      </div>

    </div>
  );
};

export default RavitaillementRecent;