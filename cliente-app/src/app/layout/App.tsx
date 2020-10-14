import React, { Fragment, useContext, useEffect } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "../../features/nav/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { observer } from "mobx-react-lite";
import {
  Route,
  withRouter,
  RouteComponentProps,
  Switch,
} from "react-router-dom";
import ActivityForm from "../../features/activities/form/ActivityForm";
import HomePage from "../../features/home/HomePage";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import UserDashboard from "../../features/users/List/UserDashboard";
import NotFound from "./NotFound";
import { ToastContainer } from "react-toastify";
import ProfilePage from "../../features/profile/ProfilePage";
import { RootStoreContext } from "../stores/rootStore";
import LoadingComponent from "./LoadingComponent";
import ModalContainer from "../common/modals/ModalContainer";
import PrivatesRoutes from "./PrivatesRoutes";

const App: React.FC<RouteComponentProps> = ({ location }) => {
  const rootStore = useContext(RootStoreContext);
  const { setAppLoaded, token, appLoaded } = rootStore.commonStore;
  const { getUser } = rootStore.userStore;

  useEffect(() => {
    if (token) {
      getUser().finally(() => setAppLoaded());
    } else {
      setAppLoaded();
    }
  }, [getUser, setAppLoaded, token]);

  if (!appLoaded) return <LoadingComponent content="Loading app" />;

  return (
    <Fragment>
      <ModalContainer />
      <ToastContainer position="bottom-right" />
      <Route exact path="/" component={HomePage} />
      <Route
        path={"/(.+)"}
        render={() => (
          <Fragment>
            <NavBar />
            <Container style={{ marginTop: "7em" }}>
              <Switch>
                {" "}
                //Somente um compoente pode ser executado de cada vez
                <PrivatesRoutes
                  exact
                  path="/activities"
                  component={ActivityDashboard}
                />
                <PrivatesRoutes
                  path="/activities/:id"
                  component={ActivityDetails}
                />
                <PrivatesRoutes
                  key={location.key}
                  path={["/createActivity", "/manage/:id"]}
                  component={ActivityForm}
                />
                <PrivatesRoutes path="/users" component={UserDashboard} />
                <PrivatesRoutes
                  path="/profile/:username"
                  component={ProfilePage}
                />
                <Route component={NotFound} />
              </Switch>
            </Container>
          </Fragment>
        )}
      />
    </Fragment>
  );
};

export default withRouter(observer(App));
