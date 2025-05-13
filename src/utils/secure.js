import SecureRoute from "./SecureRoute";

export const secure = (path, component) => (
    <SecureRoute path={path}>
      {component}
    </SecureRoute>
  );
  