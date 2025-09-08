import { Route, Routes } from "react-router-dom";
import { routes } from "./Routes";
import Layout from "./layouts/Layout";

function App() {
  return (
    <Layout>
      <Routes>
        {routes.map(route => (
          <Route key={route.path || route.id} path={route.path} element={route.element} />
        ))}
        {/* Add subitem routes */}
        {routes.flatMap(route =>
          route.subItems
            ? route.subItems.map(sub => (
                <Route key={sub.path || sub.id} path={sub.path} element={sub.element} />
              ))
            : []
        )}
      </Routes>
    </Layout>
  );
}

export default App;