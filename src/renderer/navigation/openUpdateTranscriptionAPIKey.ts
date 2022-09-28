import store from 'renderer/store/store';
import { toggleUpdateTranscriptionAPIKey } from 'renderer/store/updateTranscriptionAPIKey/actions';

const { dispatch } = store;

const openUpdateTranscriptionAPIKey: () => void = async () => {
  dispatch(toggleUpdateTranscriptionAPIKey(true));
};

export default openUpdateTranscriptionAPIKey;
