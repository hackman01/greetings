import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Divider, Paper, Alert } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

export const LoginPage = ({ onSwitchToSignup }) => {
  const { loginWithEmail, loginWithGoogle, loginAsGuest } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      try {
        setLoading(true);
        await loginWithGoogle(codeResponse.code);
      } catch (err) {
        setError('Google login failed');
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError('Google login failed'),
  });

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginWithEmail(email, password);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginAsGuest();
    } catch (err) {
      setError('Guest login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        px: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: '100%',
          maxWidth: 420,
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography variant="h4" fontWeight="900" color="primary.dark" align="center" gutterBottom>
          GREETIFY
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Sign in to create greeting cards
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={googleLogin}
          disabled={loading}
          sx={{ mb: 2, py: 1.5, borderRadius: 2 }}
        >
          Continue with Google
        </Button>

        <Divider sx={{ my: 2 }}>
          <Typography variant="body2" color="text.secondary">or</Typography>
        </Divider>

        <Box component="form" onSubmit={handleEmailLogin}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ py: 1.5, borderRadius: 2, fontWeight: 'bold', mb: 1 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </Box>

        <Typography variant="body2" align="center" sx={{ mt: 1, cursor: 'pointer' }} onClick={onSwitchToSignup}>
          Don't have an account? <strong style={{ color: 'primary.main' }}>Sign Up</strong>
        </Typography>

        <Divider sx={{ my: 2 }}>
          <Typography variant="body2" color="text.secondary">or</Typography>
        </Divider>

        <Button
          fullWidth
          variant="text"
          disabled={loading}
          onClick={handleGuestLogin}
          sx={{ py: 1.5, borderRadius: 2 }}
        >
          Continue as Guest
        </Button>
      </Paper>
    </Box>
  );
};
