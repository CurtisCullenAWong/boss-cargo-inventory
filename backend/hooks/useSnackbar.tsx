import { useState, ReactElement } from 'react';
import { Snackbar, Text, useTheme, Portal } from 'react-native-paper';

interface UseSnackbarReturn {
  showSnackbar: (msg: string, isSuccess?: boolean) => void;
  SnackbarElement: ReactElement;
}

const useSnackbar = (): UseSnackbarReturn => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const { colors, fonts } = useTheme();

  const showSnackbar = (msg: string, isSuccess = false) => {
    setMessage(msg);
    setSuccess(isSuccess);
    setVisible(true);
  };

  const hideSnackbar = () => setVisible(false);

  const SnackbarElement = (
    <Portal>
      <Snackbar
        visible={visible}
        onDismiss={hideSnackbar}
        duration={3000}
        className="rounded-lg mx-[50%] mb-[20%] z-50 mt-2 px-2 py-1 w-[75%] max-w-[80%] items-center justify-center"
        style={{
          backgroundColor: success ? colors.primary : colors.error,
        }}
      >
        <Text
          variant="bodyMedium"
          className={`text-center ${success ? 'text-onPrimary' : 'text-onError'}`}
          style={[
            { color: success ? colors.onPrimary : colors.onError, textAlign: 'center' },
          ]}
        >
          {message}
        </Text>
      </Snackbar>
    </Portal>
  );

  return {
    showSnackbar,
    SnackbarElement,
  };
};

export default useSnackbar;


