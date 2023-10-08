import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
} from '@mui/material';
import {makeStyles} from '@mui/styles';
import { useNavigate } from 'react-router-dom';
const useStyles = makeStyles((theme) => ({
  appBar: {
    background: '#1976D2',
    marginBottom : '10px'
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    height: '150px',
    fontSize: '1.2rem',
    minHeight : '40vh'
  },
}));

const HomePage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const handleButtonClick = (option) => {
    // Handle button clicks based on the selected option
    navigate(`/${option}`)

  };
  const redirectprofile = ()=>{
    navigate('/profile')
  }
  return (
    <div>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Namma Bank
          </Typography>
          <Button color="inherit" onClick={redirectprofile}>Profile</Button>
          <Button color="inherit">Logout</Button>
        </Toolbar>
      </AppBar>

      <Container className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Paper elevation={3}>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() => handleButtonClick('account')}
              >
                Create/Update Account
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper elevation={3}>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() => handleButtonClick('account')}
              >
                Transfer Money
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper elevation={3}>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={()=>handleButtonClick('getBal')}
              >
                Check Balance
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper elevation={3}>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() => handleButtonClick('pin')}
              >
                Set/Reset PIN
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default HomePage;
