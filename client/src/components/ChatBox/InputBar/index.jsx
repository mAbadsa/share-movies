import React, { useState } from 'react';
import { useTheme } from 'react-jss';

import useStyles from './styles';

import Emoji from './Emoji';

function InputBar() {
  const theme = useTheme();
  const classes = useStyles({ theme });
  const [open, setOpen] = useState(false);
  const [emoji, setEmoji] = useState('');
  const handleOpenEmojiBox = () => {
    setOpen(!open);
  };
  return (
    <div className={classes.InputBar}>
      <Emoji open={open} handleOpen={setOpen} handleEmoji={setEmoji} />
      <button
        className={classes.EmojiSwitch}
        onClick={handleOpenEmojiBox}
        type="button"
      >
        <i className="fas fa-laugh" />
      </button>
      <div className={classes.MessageInputContainer}>
        <input className={classes.messageInput} type="text" value={emoji} />
        <i className="fas fa-paper-plane" />
      </div>
    </div>
  );
}

export default InputBar;
