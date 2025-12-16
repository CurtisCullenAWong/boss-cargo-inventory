import { useState, ReactElement } from 'react'
import { Snackbar, Text, useTheme, Portal } from 'react-native-paper'

interface UseSnackbarReturn {
  showSnackbar: (msg: string, isSuccess?: boolean) => void
  SnackbarElement: ReactElement
}

const useSnackbar = (): UseSnackbarReturn => {
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const { colors, fonts } = useTheme()

  const showSnackbar = (msg: string, isSuccess = false) => {
    setMessage(msg)
    setSuccess(isSuccess)
    setVisible(true)
  }

  const hideSnackbar = () => setVisible(false)

  const SnackbarElement = (
    <Portal>
      <Snackbar
        visible={visible}
        onDismiss={hideSnackbar}
        duration={3000}
        className="rounded-lg mx-[50%] mb-[20%] z-50"
        style={{
          backgroundColor: success ? colors.primary : colors.error, minWidth: '75%', maxWidth: '80%', alignSelf:'center'
        }}
      >
        <Text
          style={[
            fonts.bodyMedium,
            { color: success ? colors.onPrimary : colors.onError, textAlign: 'center' }
          ]}
        >
          {message}
        </Text>
      </Snackbar>
    </Portal>
  )

  return {
    showSnackbar,
    SnackbarElement,
  }
}

export default useSnackbar