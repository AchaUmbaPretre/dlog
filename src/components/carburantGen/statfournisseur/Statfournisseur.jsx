import {
  ShopOutlined,
  TrophyOutlined,
} from "@ant-design/icons";

import "./statfournisseur.scss";

const Statfournisseur = ({
  data = [],
}) => {

  const max =
    data?.[0]?.total_depenses || 1;

  return (

    <div className="statfournisseur">

      <div className="supplierHeader">

        <div>

          <h3>
            Top Fournisseurs
          </h3>

          <p>
            Classement des dépenses
          </p>

        </div>

      </div>

      <div className="supplierList">

        {data.map(
          (item, index) => {

            const percent =
              (
                item.total_depenses /
                max
              ) * 100;

            return (

              <div
                key={index}
                className={`supplierCard ${
                  index === 0
                    ? "leader"
                    : ""
                }`}
              >

                <div className="supplierTop">

                  <div className="supplierIdentity">

                    <div className="supplierRank">

                      {
                        index === 0
                          ? (
                            <TrophyOutlined />
                          )
                          : (
                            `#${index + 1}`
                          )
                      }

                    </div>

                    <div>

                      <h4>
                        {
                          item.nom_fournisseur
                        }
                      </h4>

                      <span>
                        {
                          item.total_litres_formate
                        }
                      </span>

                    </div>

                  </div>

                  <strong>
                    {
                      item.total_depenses_formate
                    }
                  </strong>

                </div>

                <div className="supplierProgress">

                  <div
                    className="supplierFill"
                    style={{
                      width:
                        `${percent}%`
                    }}
                  />

                </div>

              </div>
            );
          }
        )}

      </div>

    </div>
  );
};

export default Statfournisseur;