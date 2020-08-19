import React from 'react';
import { YamlOutput } from "../../components/YamlOutput";
import { Drawer, AppBar, Toolbar, Typography } from '@material-ui/core';
import styles from './Home.css';

const containersMock = {
  version: 3,
  services: {
    db: {
      image: "mongo",
      restart: "always",
      ports: [
        "27017:27017"
      ],
      volumes: [
        "~/mongo/data:/data/db"
      ],
      networks: [
        "services"
      ]
    },
    api: {
      depends_on: [
        "db"
      ],
      image: "parseplatform/parse-server",
      restart: "always",
      ports: [
        "1337:1337"
      ],
      networks: [
        "services",
        "gateway"
      ],
      environment: [
        "PARSE_SERVER_APPLICATION_ID",
        "PARSE_SERVER_MASTER_KEY",
        "PARSE_SERVER_DATABASE_URI"
      ]
    },
    dashboard: {
      depends_on: [
        "api"
      ],
      image: "parseplatform/parse-dashboard",
      restart: "always",
      ports: [
        "4040:4040"
      ],
      networks: [
        "gateway"
      ],
      environment: [
        "PARSE_DASHBOARD_SERVER_URL",
        "PARSE_DASHBOARD_APP_ID",
        "PARSE_DASHBOARD_MASTER_KEY",
        "PARSE_DASHBOARD_APP_NAME",
        "PARSE_DASHBOARD_ALLOW_INSECURE_HTTP",
        "PARSE_DASHBOARD_USER_ID",
        "PARSE_DASHBOARD_USER_PASSWORD"
      ]
    },
    rest: {
      build: ".",
      restart: "always",
      depends_on: [
        "api"
      ],
      ports: [
        "80:3000"
      ],
      networks: [
        "gateway"
      ],
      environment: [
        "PARSE_SERVER_URL"
      ],
      volumes: [
        ".:/opt/app",
        "/opt/app/node_modules"
      ]
    }
  },
  networks: {
    services: {
      "driver": "bridge",
      "internal": true
    },
    gateway: {
      "driver": "bridge"
    }
  }
}

export const Home = () => {
  return (
    <div className={styles.root}>
      <AppBar position="fixed" className={styles.appbar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            RampApp
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" anchor="left" className={styles.menubar}>
        <Toolbar />
        <div className="drawer-container">PROJECTS HERE</div>
      </Drawer>
      <main className={styles.content}>
        <YamlOutput json={containersMock} />
      </main>
    </div>
  );
};
