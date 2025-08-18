import { Card, Divider } from 'antd'
import './rapportBs.scss'

const RapportBs = () => {
  return (
    <>
        <div className="rapport_bs">
            <Card>
                <div className="rapport_bs_wrapper">
                    <Card  type="inner" title="Volume global des activités" className="rapport_bs_globals">
                        <div className="rapport_bs_global">
                            <div className="bs_global_info">
                                <div className="row">
                                    <span className="type">Nombre total de bons de sortie :</span>
                                    <strong className="info_strong">5</strong>
                                </div>
                                <Divider style={{margin:'20px 0'}} />
                            </div>

                            <div className="bs_global_info">
                                <div className="row">
                                    <span className="type">Nombre total de véhicules mobilisés :</span>
                                    <strong className="info_strong">5</strong>
                                </div>
                                <Divider style={{margin:'20px 0'}} />
                            </div>

                            <div className="bs_global_info">
                                <div className="row">
                                    <span className="type">Nombre de chauffeurs impliqués :</span>
                                    <strong className="info_strong">5</strong>
                                </div>
                                <Divider style={{margin:'20px 0'}} />
                            </div>
                            <div className="bs_global_info">
                                <div className="row">
                                    <span className="type">Nombre total de bons de sortie :</span>
                                    <strong className="info_strong">5</strong>
                                </div>
                                <Divider style={{margin:'20px 0'}} />
                            </div>
                            <Card type="inner" title="Répartition par type de véhicule">
                                <div className="bs_global_infos">
                                    <div className="rows">
                                        <div className="row">
                                            <span className="type">Motos  :</span>
                                            <strong className="info_strong">5</strong>
                                        </div>
                                        <div className="row">
                                            <span className="type">Voitures  :</span>
                                            <strong className="info_strong">5</strong>
                                        </div>
                                        <div className="row">
                                            <span className="type">Camions semi-remorques  :</span>
                                            <strong className="info_strong">5</strong>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Card type="inner" title="Répartition par service">
                                <div className="bs_global_infos">
                                    <div className="rows">
                                        <div className="row">
                                            <span className="type">Logistique :</span>
                                            <strong className="info_strong">5</strong>
                                        </div>
                                        <div className="row">
                                            <span className="type">Administratif :</span>
                                            <strong className="info_strong">5</strong>
                                        </div>
                                        <div className="row">
                                            <span className="type">Maritime :</span>
                                            <strong className="info_strong">5</strong>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </Card>
                </div>
            </Card>
        </div>
    </>
  )
}

export default RapportBs