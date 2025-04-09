import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/actions';
import { AppDispatch } from '../../redux/store';
import api, { Credentials } from '../../utils/api';
import AppTheme from '../shared-theme/AppTheme';
import ColorModeSelect from '../shared-theme/ColorModeSelect';
import { FacebookIcon, GoogleIcon } from './components/CustomIcons';
import ForgotPassword from './components/ForgotPassword';
import SignUpForm from './components/SignUpForm'; // Import the new SignUpForm
import { Card, SignInContainer } from './SignIn.styled';

export default function SignIn(props: { disableCustomTheme?: boolean }) {
  // --- State for Sign In ---
  const [signInEmail, setSignInEmail] = React.useState('');
  const [signInPassword, setSignInPassword] = React.useState('');
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [forgotPasswordOpen, setForgotPasswordOpen] = React.useState(false);
  const [signInApiError, setSignInApiError] = React.useState('');
  const [isSignInLoading, setIsSignInLoading] = React.useState(false);

  // --- State to toggle between Sign In and Sign Up ---
  const [isSignUpView, setIsSignUpView] = React.useState(false); // <-- New State

  const dispatch = useDispatch<AppDispatch>();

  // --- Handlers for Forgot Password ---
  const handleForgotPasswordOpen = () => {
    setForgotPasswordOpen(true);
  };
  const handleForgotPasswordClose = () => {
    setForgotPasswordOpen(false);
  };

  // --- Handlers for Sign In Input Change ---
  const handleSignInEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSignInEmail(event.target.value);
    if (emailError) setEmailError(false);
    if (emailErrorMessage) setEmailErrorMessage('');
    if (signInApiError) setSignInApiError('');
  };

  const handleSignInPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSignInPassword(event.target.value);
    if (passwordError) setPasswordError(false);
    if (passwordErrorMessage) setPasswordErrorMessage('');
    if (signInApiError) setSignInApiError('');
  };

  // --- Sign In Validation ---
  const validateSignInInputs = () => {
    let isValid = true;
    setSignInApiError(''); // Clear previous API error

    if (!signInEmail || !/\S+@\S+\.\S+/.test(signInEmail)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!signInPassword || signInPassword.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  // --- Sign In Submit Handler ---
  const handleSignInSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (!validateSignInInputs()) {
      return;
    }

    setIsSignInLoading(true);
    setSignInApiError('');

    const credentials: Credentials = {
      email: signInEmail,
      password: signInPassword,
    };
    try {
      const loginResponse = await api.loginUser(credentials);
      if (loginResponse) {
        dispatch(
          setUser({
            userId: loginResponse.userId,
            token: loginResponse.token,
            username: loginResponse.username,
          })
        );
        // No need to setLoading(false) here as the component might unmount/redirect
      } else {
        // Should not happen if api.loginUser throws on error, but good practice
        setSignInApiError('Login failed. Please check your credentials.');
        setIsSignInLoading(false);
      }
    } catch (error: any) {
      console.error('Sign In Error:', error);
      const message =
        error.response?.data?.message ||
        'Login failed. Please check your credentials or server status.';
      setSignInApiError(message);
      setIsSignInLoading(false);
    }
  };

  // --- Strings --- (Keep relevant ones, SignUpForm has its own)
  const strings = {
    signIn: 'Sign in',
    email: 'Email',
    emailPlaceholder: 'your@email.com',
    password: 'Password',
    passwordPlaceholder: '••••••',
    rememberMe: 'Remember me',
    forgot: 'Forgot your password?',
    or: 'or',
    withGoogle: 'with Google',
    withFacebook: 'with Facebook',
    dontHaveAcc: "Don't have an account?",
    signUp: 'Sign up',
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <ColorModeSelect
          sx={{ position: 'fixed', top: '1rem', right: '1rem' }}
        />
        <Card variant="outlined">
          {/* --- Conditional Rendering: Sign In or Sign Up --- */}
          {!isSignUpView ? (
            // --- Sign In View ---
            <>
              <Typography
                component="h1"
                variant="h4"
                sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
              >
                {strings.signIn}
              </Typography>
              <Box
                component="form"
                onSubmit={handleSignInSubmit}
                noValidate
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  gap: 2,
                  mt: 2, // Add margin top
                }}
              >
                <FormControl>
                  <FormLabel htmlFor="email-signin">{strings.email}</FormLabel>{' '}
                  {/* Unique ID */}
                  <TextField
                    error={emailError}
                    helperText={emailErrorMessage}
                    id="email-signin" // Unique ID
                    type="email"
                    name="email"
                    placeholder={strings.emailPlaceholder}
                    autoComplete="email"
                    autoFocus
                    required
                    fullWidth
                    variant="outlined"
                    color={emailError ? 'error' : 'primary'}
                    value={signInEmail}
                    onChange={handleSignInEmailChange}
                    disabled={isSignInLoading}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="password-signin">
                    {strings.password}
                  </FormLabel>{' '}
                  {/* Unique ID */}
                  <TextField
                    error={passwordError}
                    helperText={passwordErrorMessage}
                    name="password"
                    placeholder={strings.passwordPlaceholder}
                    type="password"
                    id="password-signin" // Unique ID
                    autoComplete="current-password"
                    required
                    fullWidth
                    variant="outlined"
                    color={passwordError ? 'error' : 'primary'}
                    value={signInPassword}
                    onChange={handleSignInPasswordChange}
                    disabled={isSignInLoading}
                  />
                </FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      value="remember"
                      color="primary"
                      disabled={isSignInLoading}
                    />
                  }
                  label={strings.rememberMe}
                />
                {/* API Error Display */}
                {signInApiError && (
                  <Typography
                    color="error"
                    variant="body2"
                    sx={{ mt: 1, textAlign: 'center' }}
                  >
                    {signInApiError}
                  </Typography>
                )}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 1 }}
                  disabled={isSignInLoading}
                >
                  {isSignInLoading ? 'Signing In...' : strings.signIn}
                </Button>
                <Link
                  component="button"
                  type="button"
                  onClick={handleForgotPasswordOpen}
                  variant="body2"
                  sx={{ alignSelf: 'center' }}
                  disabled={isSignInLoading}
                >
                  {strings.forgot}
                </Link>
              </Box>
              <Divider sx={{ my: 2 }}>{strings.or}</Divider> {/* Add margin */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() =>
                    alert(`${strings.signIn} ${strings.withGoogle}`)
                  }
                  startIcon={<GoogleIcon />}
                  disabled={isSignInLoading}
                >
                  {`${strings.signIn} ${strings.withGoogle}`}
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() =>
                    alert(`${strings.signIn} ${strings.withFacebook}`)
                  }
                  startIcon={<FacebookIcon />}
                  disabled={isSignInLoading}
                >
                  {`${strings.signIn} ${strings.withFacebook}`}
                </Button>
                <Typography sx={{ textAlign: 'center', mt: 2 }}>
                  {' '}
                  {/* Add margin */}
                  {`${strings.dontHaveAcc} `}
                  <Link
                    component="button" // Change to button
                    type="button" // Change to button
                    onClick={() => setIsSignUpView(true)} // <-- Set state onClick
                    variant="body2"
                    sx={{ alignSelf: 'center' }}
                    disabled={isSignInLoading}
                  >
                    {strings.signUp}
                  </Link>
                </Typography>
              </Box>
            </>
          ) : (
            // --- Sign Up View ---
            <SignUpForm onSwitchToSignIn={() => setIsSignUpView(false)} /> // <-- Render SignUpForm
          )}
        </Card>
        {/* Forgot Password Modal (remains outside conditional rendering) */}
        <ForgotPassword
          open={forgotPasswordOpen}
          handleClose={handleForgotPasswordClose}
        />
      </SignInContainer>
    </AppTheme>
  );
}
