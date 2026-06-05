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

          <span className="sectionLabel">
            ACTIVITÉ
          </span>

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

        {data
          .slice(0, 5)
          .map((item, index) => (
            <div
              key={item.id}
              className="timelineItem"
            >

              <div className="timelineLeft">

                <div className="timelineDot" />

                {
                  index !== 4 &&
                  <div className="timelineLine" />
                }

              </div>

              <div className="timelineCard">

                <div className="timelineTop">

                  <div className="vehicleInfo">

                    <div className="vehicleIcon">
                      <CarOutlined />
                    </div>

                    <div>

                      <h4>
                        {
                          item.vehicule
                            ?.immatriculation
                        }
                      </h4>

                      <span>
                        {
                          item.type_carburant
                        }
                      </span>

                    </div>

                  </div>

                  <div className="litreBadge">

                    {
                      item.quantite
                        ?.formate
                    }

                  </div>

                </div>

                <div className="timelineBottom">

                  <div>

                    <DashboardOutlined />

                    {
                      item.montant
                        ?.usd_formate
                    }

                  </div>

                  <div>

                    <ClockCircleOutlined />

                    {item.date}

                  </div>

                </div>

              </div>

            </div>
          ))}

      </div>

    </div>
  );
};

export default RavitaillementRecent;