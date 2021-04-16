import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import { fade, makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';

export default ({ onSubmit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const classes = useStyles();

  const handleChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const onKeyPress = (event) => {
    if (event.key === 'Enter') {
      onSubmit(searchTerm);
    }
  }

  return (
    <div className={classes.root}>
      <AppBar position='static' className={classes.bar}>
        <Toolbar>
          <IconButton
            edge='start'
            className={classes.menuButton}
            color='primary'
            aria-label='open drawer'
          >
            <MenuIcon />
          </IconButton>
          <div className={classes.title}>
            <img src={process.env.PUBLIC_URL + '/mytube_logo.png'} className='img-fluid float-left logo' alt='logo' style={{ width: '40%' }} />
          </div>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder='Search…'
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              value={searchTerm}
              onChange={handleChange}
              onKeyPress={onKeyPress}
              fullwidth='true'
            />
          </div>
        </Toolbar>
      </AppBar>
    </div>

  );

}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  bar: {
    backgroundColor: 'white',
  },
  menuButton: {
    marginRight: theme.spacing(2),
    color: 'black'
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    borderWidth: 1,
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    borderColor: theme.palette.common.black,
    backgroundColor: fade(theme.palette.common.black, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.black, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
      backgroundColor: 'white'
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black'
  },
  inputRoot: {
    color: 'primary',
    borderColor: 'primary',
    borderWidth: .5,

  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
  },
}));