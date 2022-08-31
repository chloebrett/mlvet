import {
  Box,
  ClickAwayListener,
  Popper,
  styled,
  Typography,
} from '@mui/material';
import { RefObject } from 'react';
import colors from 'renderer/colors';
import useKeypress from 'renderer/utils/hooks';

interface RestorePopoverProps {
  text: string;
  anchorEl: HTMLElement | null;
  onClickAway: () => void;
  width: number | null;
  transcriptionBlockRef: RefObject<HTMLElement>;
  restoreText: () => void;
}

const RestorePopover = ({
  text,
  anchorEl,
  onClickAway,
  width,
  transcriptionBlockRef,
  restoreText,
}: RestorePopoverProps) => {
  useKeypress(restoreText, Boolean(anchorEl), ['Enter', 'NumpadEnter']);

  const StyledPopper = styled(Popper)(() => ({
    zIndex: 1,
    maxWidth: width || '40%',
    backgroundColor: colors.grey[600],
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: '5px',
  }));

  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <StyledPopper
        id="restore-popper"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        placement="top"
        modifiers={[
          {
            name: 'preventOverflow',
            options: {
              boundary: transcriptionBlockRef.current,
            },
          },
        ]}
      >
        <Box
          sx={{
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            height: 38,
            maxWidth: width,
            padding: '8px',
            borderRadius: '5px',
            color: colors.yellow[500],
            border: 0.5,
          }}
        >
          <Typography style={{ color: colors.yellow[500] }} noWrap>
            {text}
          </Typography>
        </Box>
      </StyledPopper>
    </ClickAwayListener>
  );
};

export default RestorePopover;