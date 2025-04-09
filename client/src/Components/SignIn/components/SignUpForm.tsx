import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import api, { UserData } from '../../../utils/api'; // Import api and UserData

// --- Props Interface ---
interface SignUpFormProps {
  onSwitchToSignIn: () => void; // Function to switch back to Sign In view
}

// --- Strings --- (Could be moved to a shared constants file)
const strings = {
  signUp: 'Sign up',
  username: 'Username',
  usernamePlaceholder: 'Choose a username',
  email: 'Email',
  emailPlaceholder: 'your@email.com',
  password: 'Password',
  passwordPlaceholder: 'Create a password (min. 6 characters)',
  confirmPassword: 'Confirm Password',
  confirmPasswordPlaceholder: 'Re-enter your password',
  signUpButton: 'Sign Up',
  alreadyHaveAccount: 'Already have an account?',
  signInLink: 'Sign In',
  // Error Messages
  usernameRequired: 'Username is required.',
  emailRequired: 'Email is required.',
  emailInvalid: 'Please enter a valid email address.',
  passwordRequired: 'Password is required.',
  passwordMinLength: 'Password must be at least 6 characters long.',
  confirmPasswordRequired: 'Please confirm your password.',
  passwordsDoNotMatch: 'Passwords do not match.',
  registrationFailed: 'Registration failed. Please try again.', // Generic server error
};

// --- Component ---
export default function SignUpForm({ onSwitchToSignIn }: SignUpFormProps) {
  const [formData, setFormData] = React.useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = React.useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    api: '', // For general API errors
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear specific error when user starts typing in a field
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    // Clear API error on any change
    if (errors.api) {
      setErrors((prev) => ({ ...prev, api: '' }));
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      api: '',
    };

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = strings.usernameRequired;
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = strings.emailRequired;
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = strings.emailInvalid;
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      // Don't trim password
      newErrors.password = strings.passwordRequired;
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = strings.passwordMinLength;
      isValid = false;
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = strings.confirmPasswordRequired;
      isValid = false;
    } else if (
      formData.password &&
      formData.confirmPassword !== formData.password
    ) {
      newErrors.confirmPassword = strings.passwordsDoNotMatch;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors((prev) => ({ ...prev, api: '' })); // Clear previous API error

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const userData: UserData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };

    try {
      await api.registerUser(userData);
      // Registration successful!
      alert('Registration successful! Please Sign In.'); // Simple feedback
      onSwitchToSignIn(); // Switch back to the Sign In view
    } catch (error: any) {
      console.error('Registration Error:', error);
      // Handle specific errors if the backend provides them
      const errorMessage =
        error.response?.data?.message || strings.registrationFailed;
      setErrors((prev) => ({ ...prev, api: errorMessage }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', mb: 2 }} // Added margin bottom
      >
        {strings.signUp}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 2,
        }}
      >
        {/* Username Field */}
        <FormControl>
          <FormLabel htmlFor="username">{strings.username}</FormLabel>
          <TextField
            id="username"
            name="username"
            placeholder={strings.usernamePlaceholder}
            autoComplete="username"
            required
            fullWidth
            variant="outlined"
            value={formData.username}
            onChange={handleChange}
            error={!!errors.username}
            helperText={errors.username}
            disabled={isLoading}
          />
        </FormControl>

        {/* Email Field */}
        <FormControl>
          <FormLabel htmlFor="email-signup">{strings.email}</FormLabel>{' '}
          {/* Unique ID */}
          <TextField
            id="email-signup" // Unique ID
            type="email"
            name="email"
            placeholder={strings.emailPlaceholder}
            autoComplete="email"
            required
            fullWidth
            variant="outlined"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            disabled={isLoading}
          />
        </FormControl>

        {/* Password Field */}
        <FormControl>
          <FormLabel htmlFor="password-signup">{strings.password}</FormLabel>{' '}
          {/* Unique ID */}
          <TextField
            id="password-signup" // Unique ID
            name="password"
            placeholder={strings.passwordPlaceholder}
            type="password"
            autoComplete="new-password" // Important for password managers
            required
            fullWidth
            variant="outlined"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            disabled={isLoading}
          />
        </FormControl>

        {/* Confirm Password Field */}
        <FormControl>
          <FormLabel htmlFor="confirmPassword">
            {strings.confirmPassword}
          </FormLabel>
          <TextField
            id="confirmPassword"
            name="confirmPassword"
            placeholder={strings.confirmPasswordPlaceholder}
            type="password"
            autoComplete="new-password" // Important for password managers
            required
            fullWidth
            variant="outlined"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            disabled={isLoading}
          />
        </FormControl>

        {/* API Error Display */}
        {errors.api && (
          <Typography
            color="error"
            variant="body2"
            sx={{ mt: 1, textAlign: 'center' }}
          >
            {errors.api}
          </Typography>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 1 }} // Add some margin top
          disabled={isLoading}
        >
          {isLoading ? 'Signing Up...' : strings.signUpButton}
        </Button>

        {/* Switch to Sign In Link */}
        <Typography sx={{ textAlign: 'center', mt: 2 }}>
          {`${strings.alreadyHaveAccount} `}
          <Link
            component="button"
            type="button"
            onClick={onSwitchToSignIn}
            variant="body2"
            disabled={isLoading}
          >
            {strings.signInLink}
          </Link>
        </Typography>
      </Box>
    </>
  );
}
