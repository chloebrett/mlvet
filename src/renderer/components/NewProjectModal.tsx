import {
  Box,
  Modal,
  styled,
  Typography,
  colors,
  TextField,
  Button,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { projectCreated, recentProjectAdded } from '../store/actions';
import SelectMediaBlock from './SelectMediaBlock';
import { Project } from '../store/helpers';

const CustomModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CustomModalInner = styled(Box)`
  width: calc(80vw - 40px);
  background: ${colors.grey[900]};
  padding: 20px;
`;

const CustomTextField = styled(TextField)`
  background: ${colors.grey[400]};
  color: ${colors.grey[900]};
  width: 400px;
`;

const ButtonContainer = styled(Box)`
  display: flex;
  justify-content: right;
  width: 100%;
`;

const CustomButtonBase = styled(Button)`
  border-radius: 0;
  font-weight: bold;
  color: ${colors.grey[900]};
  text-transform: none;
  margin: 20px 10px;
  padding: 10px;
`;

const CancelButton = styled(CustomButtonBase)`
  background: ${colors.grey[400]};

  &:hover {
    background: ${colors.grey[600]};
  }
`;

const ActionButton = styled(CustomButtonBase)`
  background: ${colors.lightBlue[500]};

  &:hover {
    background: ${colors.lightBlue[700]};
  }
`;

interface Props {
  isOpen: boolean;
  closeModal: () => void;
}

const NewProjectModal = ({ isOpen, closeModal }: Props) => {
  const [projectName, setProjectName] = useState<string>('Example');

  const makeMockProject: (name: string) => Project = (name) => ({
    name,
    mediaType: 'video',
    fileExtension: 'mp4',
    filePath: 'test',
  });

  const dispatch = useDispatch();

  const setCurrentProject = () =>
    dispatch(projectCreated(makeMockProject(projectName)));
  const addToRecentProjects = () =>
    dispatch(recentProjectAdded(makeMockProject(projectName)));

  const onProjectCreate = () => {
    setCurrentProject();
    addToRecentProjects();
    closeModal();
  };

  return (
    <CustomModal open={isOpen} onClose={closeModal}>
      <CustomModalInner>
        <Typography fontWeight="bold">New Project</Typography>
        <CustomTextField
          sx={{ marginTop: '40px' }}
          label="Project Name"
          variant="outlined"
          value={projectName}
          onChange={(event) => setProjectName(event.target.value)}
        />
        <SelectMediaBlock />
        <ButtonContainer>
          <CancelButton onClick={closeModal}>Cancel</CancelButton>
          <ActionButton onClick={onProjectCreate}>Create!</ActionButton>
        </ButtonContainer>
      </CustomModalInner>
    </CustomModal>
  );
};

export default NewProjectModal;
