import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import AccountCircle from '@material-ui/icons/AccountCircle';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import { fade, makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import { MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBBtn } from 'mdbreact';
import ManageUser from './ManageUser';

export default ({ onSubmit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const classes = useStyles();
  const [toggle, setToggle] = useState(false);

  // const setActiveItemFunc = tab => e => {
  //   if (this.state.activeItem !== tab) {
  //     setActiveItem({
  //       activeItem: tab
  //     });
  //   }
  // };

  const handleChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const onKeyPress = (event) => {
    if (event.key === 'Enter') {
      onSubmit(searchTerm);
    }
  }

  const toVideos = (e) => {
    e.preventDefault();
    onSubmit();
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
            <img src={process.env.PUBLIC_URL + '/mytubelogo.png'} className='float-left logo' alt='logo' />
          </div>
          <MDBBtn outline color='primary' id='toVideos' className={classes.tovidbtn} onClick={toVideos}>
            Go to Videos
          </MDBBtn>
          <IconButton
            aria-label="to videos"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            id='toVideosIcon'
            onClick={toVideos}
            color="primary"
            className={classes.iconButton}
          >
            <VideoLibraryIcon />
          </IconButton>

          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            id='userButton'
            onClick={() => setToggle(true)}
            color="primary"
          >
            <AccountCircle />
          </IconButton>
          <MDBModal isOpen={toggle} size='lg'>
            <MDBModalHeader style={{ backgroundColor: '#2196F3', color: 'white', fontWeight: 'bold' }} className='d-flex align-items-center justify-content-center'>

              <div>
                Manage your rorysmytube subscription</div>
            </MDBModalHeader>
            <MDBModalBody><ManageUser /></MDBModalBody>
            <MDBModalFooter className='d-flex'>
              <MDBBtn tag='a' role='button' color='primary' className='align-items-center justify-content-center h5' onClick={() => setToggle(false)}>
                Close
          </MDBBtn>
            </MDBModalFooter>
          </MDBModal>

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
    marginRight: theme.spacing(1),
    color: 'black'
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    // paddingRight: theme.spacing(2),
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
  iconButton: {
    display: 'block',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  tovidbtn: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
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