import React, { useState, useRef } from 'react';
import { Box, Typography, TextField, Button, Divider, Paper, Alert, Avatar } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

export const SignupPage = ({ onSwitchToLogin }) => {
  const { registerWithEmail, loginWithGoogle, loginAsGuest, uploadPhoto, token } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      try {
        setLoading(true);
        await loginWithGoogle(codeResponse.code);
      } catch (err) {
        setError('Google signup failed');
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError('Google signup failed'),
  });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await registerWithEmail(name, email, password);
      if (photoFile) {
        await uploadPhoto(photoFile);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
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
          Create an account to get started
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
          Sign up with Google
        </Button>

        <Divider sx={{ my: 2 }}>
          <Typography variant="body2" color="text.secondary">or</Typography>
        </Divider>

        <Box component="form" onSubmit={handleSignup}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Avatar
              sx={{ width: 80, height: 80, cursor: 'pointer', bgcolor: 'primary.main' }}
              src={photoPreview || undefined}
              onClick={() => fileInputRef.current?.click()}
            >
              {!photoPreview && <AddAPhotoIcon />}
            </Avatar>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handlePhotoChange}
            />
          </Box>
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
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
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </Box>

        <Typography variant="body2" align="center" sx={{ mt: 1, cursor: 'pointer' }} onClick={onSwitchToLogin}>
          Already have an account? <strong style={{ color: 'primary.main' }}>Sign In</strong>
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
