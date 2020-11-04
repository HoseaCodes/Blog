import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import { useSpring, animated } from 'react-spring/web.cjs'; // web.cjs is required for IE 11 support
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import '../Modal/Modal.css';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

const Fade = React.forwardRef(function Fade(props, ref) {
    const { in: open, children, onEnter, onExited, ...other } = props;
    const style = useSpring({
        from: { opacity: 0 },
        to: { opacity: open ? 1 : 0 },
        onStart: () => {
            if (open && onEnter) {
                onEnter();
            }
        },
        onRest: () => {
            if (!open && onExited) {
                onExited();
            }
        },
    });

    return (
        <animated.div ref={ref} style={style} {...other}>
            {children}
        </animated.div>
    );
});

Fade.propTypes = {
    children: PropTypes.element,
    in: PropTypes.bool.isRequired,
    onEnter: PropTypes.func,
    onExited: PropTypes.func,
};

export default function SpringModal() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <ControlPointIcon fontSize='large' style={{ color: '#206a5d' }} type="button" onClick={handleOpen} />
            <Modal
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                        <h2 id="spring-modal-title">Merge Immersive</h2>
                        <p id="spring-modal-description">Collaborative Project: Merge-Immersive — This application was developed with a full stack MERN M - MongoDB to store data, E - Express, a back-end framework, R - React, a client side framework, N - NodeJS (RESTful routing) - to run back end service and written in JavaScript including JWT authentication . Styling with Bootstrap and CSS. Problem: Students in the bootcamp have a difficult time connecting with current and past students including students from different disciplines. Another challenge is maintaining the ability to communicate and collaborate on projects. Solution:  Our application gives GA students the ability to see their current projects, websites and applications. Also, giving them the ability to reach out to current and past students even students that are not in their program type like Software Engineering and Data Science. Allowing students to connect and build a stronger network.</p>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}
