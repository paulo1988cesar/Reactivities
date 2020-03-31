import React, { useContext, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import UserList from "./UserList";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import UserFilter from './UserFilter';
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../../app/stores/rootStore";

const UserDashboard: React.FC = () => {
  
  const rootStore = useContext(RootStoreContext);
  const { loadUsers, loadingInitial } = rootStore.userStore;

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  if (loadingInitial)
    return <LoadingComponent content="Loading data..." />;

  return (
    <Grid>
      <Grid.Column width={12}>
        <UserList />
      </Grid.Column>
      <Grid.Column width={4}>
        <UserFilter/>
      </Grid.Column>
    </Grid>
  );
};

export default observer(UserDashboard);
