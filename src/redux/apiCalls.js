import { loginFailure, loginStart, loginSuccess } from "./userRedux";
import axios from "axios";
import { message } from "antd";
import config from "../config";

/* export const login = async (dispatch, user, navigate) => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

  dispatch(loginStart());
  try {
    const res = await axios.post(`${DOMAIN}/api/auth/login`, user, { withCredentials: true,});
    dispatch(loginSuccess(res.data));

    if (res.data.success) {
      message.success("Connectez-vous avec succès");
      const role = res.data?.role;
      if (role === 'Securité') {
        navigate('/securite/dashboard');
      } else {
        navigate('/');
      }
    } else {
      message.error(res.data.message);
      throw new Error(res.data.message);
    }

  } catch (err) {
    dispatch(loginFailure());
    throw err;
  }
}; */


export const login = async (dispatch, user, navigate) => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

  dispatch(loginStart());
  try {
    const res = await axios.post(`${DOMAIN}/api/auth/login`, user, { withCredentials: true });
    dispatch(loginSuccess(res.data));

    if (res.data.success) {
      message.success("Connectez-vous avec succès");
      const role = res.data?.role;
      navigate(role === 'Securité' ? '/securite/dashboard' : '/');
    } else {
      throw new Error(res.data.message);
    }

  } catch (err) {
    dispatch(loginFailure());
    // Relance toujours une erreur avec le message du backend si disponible
    throw new Error(err.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.');
  }
};


export const register = async (dispatch, user) => {
  const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

  dispatch(loginStart());
  try {
    const res = await axios.post(`${DOMAIN}/api/auth/register`, user);
    dispatch(loginSuccess(res.data));
    if (res.data.success) {
      message.success("Les informations sont enregistrées avec succès");
    } else {
      message.error(res.data.message);
    }
  } catch (err) {
    dispatch(loginFailure());
    console.log(err);
    message.error("Quelque chose s'est mal passé");
  }
};

