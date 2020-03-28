import React, { useContext, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import UserList from "./UserList";
import userStore from "../../../app/stores/userStore";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import UserFilter from './UserFilter';
import { observer } from "mobx-react-lite";

const UserDashboard: React.FC = () => {
  const usersStore = useContext(userStore);

  useEffect(() => {
    usersStore.loadUsers();
  }, [usersStore]);

  if (usersStore.loadingInitial)
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
