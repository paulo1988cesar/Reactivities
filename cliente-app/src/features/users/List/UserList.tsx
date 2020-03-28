import React, { Fragment, useContext, useEffect } from "react";
import { Table, Checkbox, Button, Icon, Card, Image } from "semantic-ui-react";
import { toast } from "react-toastify";
import { observer } from "mobx-react-lite";
import userStore from "../../../app/stores/userStore";
import LoadingComponent from "../../../app/layout/LoadingComponent";

const ativarDesativarUsuario = () => {
  toast.success("Usuário desativado com sucesso.");
};

const UserList: React.FC = () => {
  const usersStore = useContext(userStore);
  const { userLists } = usersStore;

  if (usersStore.loadingInitial)
    return <LoadingComponent content="Loading data..." />;

  return (
    <Fragment>
      <Table compact celled definition selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>UserName</Table.HeaderCell>
            <Table.HeaderCell>E-mail address</Table.HeaderCell>
            <Table.HeaderCell>Active</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {userLists.map(user => (
            <Table.Row key={user.id}>
              <Table.Cell collapsing>
                <Checkbox slider onClick={ativarDesativarUsuario} />
              </Table.Cell>
              <Table.Cell>{user.displayName}</Table.Cell>
              <Table.Cell>{user.username}</Table.Cell>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell>{user.status}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>

        <Table.Footer fullWidth>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell colSpan="4">
              <Button
                floated="right"
                icon
                labelPosition="left"
                primary
                size="small"
              >
                <Icon name="user" /> Add User
              </Button>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </Fragment>
  );
};

export default observer(UserList);
