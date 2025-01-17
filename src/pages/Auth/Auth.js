
import React, { useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { LOGIN_ROUTE } from "../../utils/consts";
import { Tabs, Tab } from "react-bootstrap";
import UserService from "../../auth/services/UserService";
import { observer } from "mobx-react-lite";
import { Context } from "../../index";
import { useLocation, useParams, useHistory } from "react-router-dom";

const ModelType3d = observer(() => {
  //const { user } = useContext(Context);
  //const isLogin = location.pathname === LOGIN_ROUTE;
  const location = useLocation();
  const { sessionToken } = useParams();
  const [moralisSession, setMoralisSession] = useState(sessionToken);

  const { push } = useHistory();
  const { store } = useContext(Context);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!store.isAuth) {
      store.login(sessionToken);
      push(`/`);
    }
  }, [sessionToken]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      store.checkAuth();
    }
  }, []);

  async function getUsers() {
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data);
    } catch (e) {
      console.error("getUsers ERROR", e);
    }
  }

  return (
    <div className="work_page navbar1 ">
      <Container>
        <Tabs
          className="mt-3"
          defaultActiveKey="tab_page_1"
          id="uncontrolled-tab-example"
        >
          <Tab className="p-1" eventKey="tab_page_1" title="ModelType3d">
            <h4>
              <strong>AUTH</strong>
            </h4>

            {store.isAuth ? (
              <div>
                <Container
                  className=" navbar "
                  style={{ height: window.innerHeight - 54, zIndex: 55 }}
                >
                  <h5>
                    {store.isAuth
                      ? `Authorised as ${store.user.username}. eth address: ${store.user.ethAddress}`
                      : ""}
                  </h5>

                  <button onClick={getUsers}>Получить пользователей</button>
                  {users.map((user) => (
                    <div key={user.ethAddress}>{user.ethAddress}</div>
                  ))}

                  <button onClick={() => { store.logout(); users.length = 0;}}>LOGOUT</button>
                </Container>
              </div>
            ) : (
              <div>
                <Container
                  className=" navbar d-flex justify-content-center align-items-center  navbar"
                  style={{ height: window.innerHeight - 54, zIndex: 55 }}
                >
                  <input
                    onChange={(e) => setMoralisSession(e.target.value)}
                    value={moralisSession}
                    placeholder="moralis session"
                  />
                  <button onClick={() => store.login(moralisSession)}>
                    Логин
                  </button>
                  <button onClick={() => store.registration(moralisSession)}>
                    Регистрация
                  </button>

                  <button onClick={getUsers}>Получить пользователей !!!</button>
                  {users.map((user) => (
                    <div key={user.email}>{user.email}</div>
                  ))}
                </Container>
              </div>
            )}
          </Tab>
          <Tab className="p-1" eventKey="tab_page_2" title="Profile">
            <Container>

            </Container>
          </Tab>
          <Tab className="p-1" eventKey="tab_page_3" title="Contact">

          </Tab>
        </Tabs>
      </Container>
    </div>
  );
});

export default ModelType3d;
