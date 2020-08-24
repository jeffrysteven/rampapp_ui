import React, { useEffect, useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { YamlOutput } from '../../components/YamlOutput';
import { Drawer, AppBar, Toolbar, Typography } from '@material-ui/core';
import styles from './Home.css';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SettingsIcon from '@material-ui/icons/Settings';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import { useCreateProject } from '../../hooks/useCreateProject';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  form: {
    '& > *': {
      margin: theme.spacing(1),
      width: '300px',
    },
  },
}));

export const Home = () => {
  const [expanded, setExpanded] = React.useState(false);
  const [modalStyle] = React.useState(getModalStyle);
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const { create, isLoading: isloadingProject } = useCreateProject();
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectRepo, setProjectRepo] = useState('');
  const [projectDocs, setProjectDocs] = useState('');
  const [appState, setAppState] = useState({
    loading: false,
    projects: null,
  });

  const classes = useStyles();

  const BootstrapButton = withStyles({
    root: {
      boxShadow: 'none',
      textTransform: 'none',
      fontSize: 16,
      padding: '6px 12px',
      border: '1px solid',
      lineHeight: 1.5,
      color: '#FFFFFF',
      backgroundColor: '#009688',
      borderColor: '#0063cc',
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:hover': {
        backgroundColor: '#009688',
        borderColor: '#0062cc',
        boxShadow: 'none',
      },
      '&:active': {
        boxShadow: 'none',
        backgroundColor: '#0062cc',
        borderColor: '#005cbf',
      },
      '&:focus': {
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
      },
    },
  })(Button);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    setAppState({ loading: true });
    const apiUrl = `http://54.157.141.205/api/Project`;
    fetch(apiUrl)
      .then((res) => res.json())
      .then((projects) => {
        setAppState({ loading: false, projects: projects });
      });
  }, [setAppState, isloadingProject]);

  const handleOpen = () => {
    setOpenCreateModal(true);
  };

  const handleClose = () => {
    setOpenCreateModal(false);
  };

  function onProjectNameChange(event) {
    setProjectName(event.currentTarget.value);
  }
  function onProjectDescriptionChange(event) {
    setProjectDescription(event.currentTarget.value);
  }
  function onProjectRepoChange(event) {
    setProjectRepo(event.currentTarget.value);
  }
  function onProjectDocsChange(event) {
    setProjectDocs(event.currentTarget.value);
  }
  const onCreateProjectClick = () => {
    const project = {
      name: projectName,
      description: projectDescription,
      repo_url: projectRepo,
      docs_url: projectDocs,
    };
    console.log('save', project);
    create(project).then(() => {
      if (!isloadingProject) {
        setProjectName('');
        setProjectDescription('');
        setProjectDocs('');
        setProjectRepo('');
        setOpenCreateModal(false);
      }
    });
  };

  const containersMock = {
    version: 3,
    services: {
      db: {
        image: 'mongo',
        restart: 'always',
        ports: ['27017:27017'],
        volumes: ['~/mongo/data:/data/db'],
        networks: ['services'],
      },
      api: {
        depends_on: ['db'],
        image: 'parseplatform/parse-server',
        restart: 'always',
        ports: ['1337:1337'],
        networks: ['services', 'gateway'],
        environment: [
          'PARSE_SERVER_APPLICATION_ID',
          'PARSE_SERVER_MASTER_KEY',
          'PARSE_SERVER_DATABASE_URI',
        ],
      },
      dashboard: {
        depends_on: ['api'],
        image: 'parseplatform/parse-dashboard',
        restart: 'always',
        ports: ['4040:4040'],
        networks: ['gateway'],
        environment: [
          'PARSE_DASHBOARD_SERVER_URL',
          'PARSE_DASHBOARD_APP_ID',
          'PARSE_DASHBOARD_MASTER_KEY',
          'PARSE_DASHBOARD_APP_NAME',
          'PARSE_DASHBOARD_ALLOW_INSECURE_HTTP',
          'PARSE_DASHBOARD_USER_ID',
          'PARSE_DASHBOARD_USER_PASSWORD',
        ],
      },
      rest: {
        build: '.',
        restart: 'always',
        depends_on: ['api'],
        ports: ['80:3000'],
        networks: ['gateway'],
        environment: ['PARSE_SERVER_URL'],
        volumes: ['.:/opt/app', '/opt/app/node_modules'],
      },
    },
    networks: {
      services: {
        driver: 'bridge',
        internal: true,
      },
      gateway: {
        driver: 'bridge',
      },
    },
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">New Project</h2>
      <form className={classes.form} noValidate autoComplete="off">
        <TextField
          onChange={onProjectNameChange}
          value={projectName}
          id="Name"
          label="Name"
        />
        <TextField
          onChange={onProjectDescriptionChange}
          id="Description"
          label="Description"
          value={projectDescription}
        />
        <TextField
          onChange={onProjectRepoChange}
          id="url-repo"
          label="Url Repo"
          value={projectRepo}
        />
        <TextField
          onChange={onProjectDocsChange}
          id="url-doc"
          label="Url Documentation"
          value={projectDocs}
        />
        <BootstrapButton onClick={onCreateProjectClick}>
          Create Project
        </BootstrapButton>
      </form>
    </div>
  );

  return (
    <div className={styles.wrapper}>
      <div>
        <AppBar position="fixed" className={styles.appbar}>
          <Toolbar>
            <Typography variant="h6" noWrap>
              RampApp
            </Typography>
          </Toolbar>
        </AppBar>
        <Card className={styles.left}>
          <CardActionArea>
            <div className="wraperlogo">
              <CardMedia
                className={styles.media}
                image="src/static/images/RampAppLogo.jpeg"
                title="Logo"
              />
            </div>
            <CardContent>
              <Typography variant="body2" color="textSecondary" component="p">
                we are creating RampApp: A Web Application integrated with the
                most popular IDEs, that allows the Local Development
                Environments setup and management in a fast way
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Typography
              className="projectTitle"
              gutterBottom
              variant="h5"
              component="h2"
            >
              Projects
            </Typography>
            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </IconButton>
            <BootstrapButton onClick={handleOpen}>New Project</BootstrapButton>
            <Modal
              open={openCreateModal}
              onClose={handleClose}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
            >
              {body}
            </Modal>
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <List component="nav" aria-label="main mailbox folders">
                {appState?.projects?.map((project) => (
                  <ListItem ListItem button key={`item-${project.objectId}`}>
                    <ListItemIcon>
                      <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary={`${project.name}`} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Collapse>
        </Card>

        <Card className={styles.down} variant="outlined">
          <CardContent>Account</CardContent>
          <CardActions>
            <IconButton aria-label="settings">
              <SettingsIcon /> Settings
            </IconButton>
          </CardActions>
        </Card>
      </div>
      <div>
        <Card className={styles.right} variant="outlined">
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              Docker Images
            </Typography>
            <main className={styles.content}>
              <YamlOutput json={containersMock} />
            </main>
          </CardContent>
        </Card>
        <Card className={styles.right_down} variant="outlined">
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              Docker Images
            </Typography>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card className={styles.design} variant="outlined">
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              Project Design
            </Typography>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
