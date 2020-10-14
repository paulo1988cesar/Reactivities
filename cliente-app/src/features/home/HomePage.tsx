import React, { useContext, Fragment } from "react";
import { Container, Segment, Header, Button, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { RootStoreContext } from "../../app/stores/rootStore";
import LoginForm from "../users/LoginForm";
import RegisterForm from '../users/RegisterForm';

const HomePage = () => {
  const token = window.localStorage.getItem('jwt');
  const rootStore = useContext(RootStoreContext);
  const { isLoggedIn, user } = rootStore.userStore;
  const { openModal } = rootStore.modalStore;

  return (
    <Segment inverted textAlign="center" vertical className="masthead">
      <Container text>
        <Header as="h1" inverted>
          <Image
            size="massive"
            src="/assets/logo.png"
            alt="logo"
            style={{ marginBottom: 12 }}
          />
          Reactivities
        </Header>
        {isLoggedIn && user && token ? (
          <Fragment>
            <Header as="h2" inverted content={`Welcome back ${user.displayName}`} />
            <Button as={Link} to="/activities" size="huge" inverted>
              Go to activities
            </Button>
          </Fragment>
        ) : (
          <Fragment>
            <Header as="h2" inverted content="Welcome to Reactivities" />
            <Button onClick={() => openModal(<LoginForm/>)} size="huge" inverted>
              Login
            </Button>
            <Button onClick={() => openModal(<RegisterForm/>)} size="huge" inverted>
              Register
            </Button>
          </Fragment>
        )}
      </Container>
    </Segment>

    // <Container style={{ marginTop: '7em'}}>
    //     <h1>Home Page</h1>
    //     <h3>Go To <Link to='/activities'>Activities</Link></h3>
    // </Container>
  );
};

export default HomePage;
