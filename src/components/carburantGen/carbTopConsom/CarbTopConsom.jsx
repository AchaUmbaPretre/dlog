import {
  FireOutlined,
  TrophyOutlined,
  CarOutlined,
  DollarOutlined,
} from "@ant-design/icons";

import "./carbTopConsom.scss";

const CarbTopConsom = ({ data = [] }) => {
  const maxLitres = data?.[0]?.litres || 1;

  return (
    <div className="carbTopConsom">

      <div className="topConsomHeader">

        <div>

          <h3>
            Top Consommation
          </h3>

          <p>
            Véhicules les plus consommateurs
          </p>
        </div>

        <div className="topConsomBadge">
          <FireOutlined />
          TOP 5
        </div>

      </div>

      <div className="topConsomList">

        {data.map((item, index) => {

          const percent =
            (item.litres / maxLitres) * 100;

          return (

            <div
              key={index}
              className={`consomCard ${
                index === 0
                  ? "leader"
                  : ""
              }`}
            >

              <div className="consomTop">

                <div className="vehicleBlock">

                  <div
                    className={`rank ${
                      index === 0
                        ? "gold"
                        : ""
                    }`}
                  >
                    {index === 0 ? (
                      <TrophyOutlined />
                    ) : (
                      `#${index + 1}`
                    )}
                  </div>

                  <div className="vehicleInfo">

                    <h4>
                      {
                        item.immatriculation
                      }
                    </h4>

                    <span>
                      {item.vehicule}
                    </span>

                  </div>

                </div>

                <div className="volumeBlock">

                  <strong>
                    {
                      item.litres_formate
                    }
                  </strong>

                  <span>
                    Volume
                  </span>

                </div>

              </div>

              <div className="progressWrapper">

                <div className="progressLabels">

                  <span>
                    Part relative
                  </span>

                  <span>
                    {percent.toFixed(0)}%
                  </span>

                </div>

                <div className="progressBar">

                  <div
                    className="progressFill"
                    style={{
                      width: `${percent}%`
                    }}
                  />

                </div>

              </div>

              <div className="consomBottom">

                <div>

                  <DollarOutlined />

                  <span>
                    {
                      item.depenses_formate
                    }
                  </span>

                </div>

                <div>

                  <CarOutlined />

                  <span>
                    {
                      item.nombre_pleins
                    } pleins
                  </span>

                </div>

              </div>

            </div>

          );
        })}
      </div>

    </div>
  );
};

export default CarbTopConsom;