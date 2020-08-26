import React, { useEffect, useState, useRef } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { YamlOutput } from '../../components/YamlOutput';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
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
import { getApiUrl } from '../../helpers/getApiUrl';
import { ComponentCard } from '../../components/ComponentCard';

function uploadFile(file) {
  const formData = new FormData();
  formData.append('fileName', file.name);
  formData.append('file', file);
  const apiUrl = getApiUrl();

  return fetch(`${apiUrl}/files`, {
    method: 'POST',
    body: formData,
  }).then((res) => res.json());
}

function patchProject(projectId, newData) {
  const apiUrl = getApiUrl();

  return fetch(`${apiUrl}/api/Project/${projectId}`, {
    method: 'PUT',
    body: JSON.stringify(newData),
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}

export const YamlUpload = ({ projectId, onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const inputRef = useRef();

  function uploadFileAndAssociate() {
    uploadFile(file).then((fileResponse) => {
      patchProject(projectId, { docker_compose_yml: fileResponse });
      onUploadComplete(fileResponse);
    });
  }

  if (!file) {
    return (
      <label htmlFor="fileUpload">
        <input
          ref={inputRef}
          style={{ display: 'none' }}
          id="fileUpload"
          name="fileUpload"
          type="file"
          onChange={() => {
            if (inputRef.current.files.length) {
              setFile(inputRef.current.files[0]);
            }
          }}
          accept=".yml"
        />

        <Button variant="contained" component="span">
          Seleccionar docker-compose.yml
        </Button>
      </label>
    );
  }

  return (
    <div>
      <div>{file.name}</div>
      <Button
        variant="contained"
        color="primary"
        onClick={uploadFileAndAssociate}
      >
        Subir
      </Button>
      <Button style={{ marginLeft: '1rem' }} onClick={() => setFile(null)}>
        Cancelar
      </Button>
    </div>
  );
};

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
  const [currentProject, setCurrentProject] = useState(null);
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

    const apiUrl = `${getApiUrl()}/api/Project`;
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
                  <ListItem
                    button
                    key={`item-${project.objectId}`}
                    onClick={() => setCurrentProject(project)}
                  >
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
      {!currentProject && <div>Select a project on the left</div>}
      {currentProject && <RightPanel project={currentProject} />}
    </div>
  );
};

const RightPanel = ({ project }) => {
  const [dockerComposeYmlUrl, setDockerComposeYmlUrl] = useState();
  const [selectedVsCodeExtensions, setSelectedVsCodeExtensions] = useState([]);
  const [ymlContent, setYmlContent] = useState(null);

  useEffect(
    function () {
      setYmlContent(null);
      setDockerComposeYmlUrl(project.docker_compose_yml?.url);
    },
    [project.objectId],
  );

  useEffect(
    function fetchYaml() {
      if (dockerComposeYmlUrl) {
        fetch(dockerComposeYmlUrl)
          .then((res) => {
            if (!res.ok) {
              throw new Error('Unable to fetch yml');
            }

            return res.text().catch(() => {
              throw new Error('Unable to decode file');
            });
          })
          .then((content) => setYmlContent(content));
      }
    },
    [dockerComposeYmlUrl],
  );

  return (
    <>
      <div>
        <ComponentCard
          getSelectedItems={setSelectedVsCodeExtensions}
          className={styles.right}
          items={selectedVsCodeExtensions}
          title="Visual Studio Code extensions"
        />
      </div>
      <div>
        <Card className={styles.design} variant="outlined">
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              <YamlUpload
                projectId={project.objectId}
                onUploadComplete={(ymlObject) =>
                  setDockerComposeYml(ymlObject.url)
                }
              ></YamlUpload>
              <div style={{ marginTop: '1rem' }}></div>
              {ymlContent && <YamlOutput yml={ymlContent} />}
            </Typography>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
