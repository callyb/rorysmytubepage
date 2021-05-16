import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, InputBase, Drawer, Link, MenuItem } from '@material-ui/core';
import { Link as RouterLink } from "react-router-dom";
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import { fade, makeStyles } from '@material-ui/core/styles';

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

    const handleDrawerOpen = () =>
        setDrawerState((prevState) => ({ ...prevState, drawerOpen: true }));
    const handleDrawerClose = () =>
        setDrawerState((prevState) => ({ ...prevState, drawerOpen: false }));
    const headersData = [
        {
            label: "Listings",
            href: "/listings",
        },
        {
            label: "Mentors",
            href: "/mentors",
        },
        {
            label: "My Account",
            href: "/account",
        },
        {
            label: "Log Out",
            href: "/logout",
        },
    ];

    const [drawerState, setDrawerState] = useState({ drawerOpen: false });
    const { drawerOpen } = drawerState;
    const getDrawerChoices = () => {
        return headersData.map(({ label, href }) => {
            return (
                <Link
                    {...{
                        component: RouterLink,
                        to: href,
                        color: "inherit",
                        style: { textDecoration: "none" },
                        key: label,
                    }}
                >
                    <MenuItem>{label}</MenuItem>
                </Link>
            );
        });
    };

    return (
        <div className={classes.root}>
            <AppBar position='static' className={classes.bar}>
                <Toolbar>
                    <IconButton
                        edge='start'
                        className={classes.menuButton}
                        color='primary'
                        aria-label='menu'
                        aria-haspopup="true"
                        onClick={handleDrawerOpen}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Drawer
                        {...{
                            anchor: "left",
                            open: drawerOpen,
                            onClose: handleDrawerClose,
                        }}
                    >
                        <div style={{ padding: 20 }}>{getDrawerChoices()}</div>

                    </Drawer>
                    <div className={classes.title}>
                        <img src={process.env.PUBLIC_URL + '/mytubelogo.png'} className='img-fluid float-left logo' alt='logo' />
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