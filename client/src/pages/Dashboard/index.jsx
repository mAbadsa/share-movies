import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from 'react-jss';
// import { useSelector, useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

// import { getUsersConnectionCount } from '../../redux/actions/shareMoies';

import Video from '../../components/video';
import Button from '../../components/Button';
import RoomController from '../../components/RoomController';
import ChatBox from '../../components/ChatBox';

import useStyles from './styles';

function Dashboard({ socket }) {
  const theme = useTheme();
  const classes = useStyles({ theme });
  // const dispatch = useDispatch();

  const state = useSelector((_state) => _state);
  const { roomId } = state;
  const [nOfUsers, setNOfUsers] = useState(0);
  console.log(socket);
  const [shareLink, setShareLink] = useState('');
  const shareLinkRef = useRef(null);

  const handleIdCopy = (e) => {
    shareLinkRef.current.select();
    shareLinkRef.current.setSelectionRange(0, 99999);
    document.execCommand('copy');
    e.target.focus();
  };

  const handleChange = () => {
    setShareLink(
      `${window.location.protocol}//${window.location.host}/${roomId}`
    );
  };

  useEffect(() => {
    handleChange();
    socket.on('number-user-connected', ({ connectedUsers }) => {
      console.log(connectedUsers);
      // if (localStorage.getItem('shareVideo')) {
      //   const shareVideo = JSON.parse(
      //     window.localStorage.getItem('shareVideo')
      //   );
      //   window.localStorage.setItem(
      //     'shareVideo',
      //     JSON.stringify({ ...shareVideo, connectedUsers })
      //   );
      // }
      setNOfUsers(connectedUsers);
      // dispatch(getUsersConnectionCount({ connectedUsers }));
    });
    socket.emit('number-user-connected', { roomId });
    // (async () => {
    //   try {

    //     console.log('Effect');

    //     await socket.on('join-room-data', ({ connectedUsers }) => {
    //       console.log({ connectedUsers });
    //       // dispatch(getUsersConnectionCount({ connectedUsers }));
    //     });
    //     console.log('Effect_2');
    //   } catch (error) {
    //     console.log({ error });
    //   }
    // })();
  }, []);

  const handleRoomLeave = () => {
    socket.emit('leave-room', { roomId });
    socket.on('leave-room', (data) => {
      window.localStorage.removeItem('shareVideo');
      console.log(data);
    });
  };

  return (
    <div className={classes.Dashboard}>
      <div className={classes.statusBar}>
        <p className={classes.userCounter}>
          <span>{nOfUsers}</span> {nOfUsers === 1 ? 'user' : 'users'}
        </p>
      </div>
      <header className={classes.header}>
        <button
          onClick={handleRoomLeave}
          type="button"
          className={classes.leaveButtonMobile}
        >
          <i className="fas fa-phone" />
        </button>
        <div className={classes.linkBox}>
          <input
            ref={shareLinkRef}
            className={classes.linkText}
            value={shareLink}
            onChange={handleChange}
            // disabled
          />
          <button
            className={classes.copyButton}
            type="button"
            onClick={handleIdCopy}
          >
            copy
          </button>
        </div>
        <div className={classes.leaveButton}>
          <Button
            handleClick={handleRoomLeave}
            variant="danger"
            text="Leave"
            size="large"
          />
        </div>
      </header>
      <div className={classes.mainContent}>
        <div className={classes.roomControllerBox}>
          <Video />
          <RoomController />
        </div>
        <div className={classes.chatContainer}>
          <ChatBox />
        </div>
      </div>
    </div>
  );
}

Dashboard.propTypes = {
  socket: PropTypes.objectOf.isRequired,
};

export default Dashboard;
