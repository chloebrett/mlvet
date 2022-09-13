import { Box } from '@mui/system';
import { useState } from 'react';
import colors from 'renderer/colors';
import SquareBracketHover from './SquareBracketHover';

interface Props {
  isLast: boolean;
  isTakeGroupOpened: boolean;
}

const SquareBracket = ({ isLast, isTakeGroupOpened }: Props) => {
  // const bottomWidth = isLast ? '2px' : '0px';
  const bottomWidth = '2px';

  const [isHovering, setIsHovering] = useState(false);

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  return (
    <Box
      id="squareBracket"
      sx={{
        height: '60px',
        width: '15px',
        borderStyle: 'solid',
        borderColor: isTakeGroupOpened ? '#FFB355' : colors.grey[500],
        borderWidth: '0px',
        borderLeftWidth: '2px',
        borderTopWidth: '2px',
        borderBottomWidth: bottomWidth,
      }}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <SquareBracketHover isLast={isLast} isHoveredOver={isHovering} />
    </Box>
  );
};

export default SquareBracket;
