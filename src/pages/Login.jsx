import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';

export default function Login() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const { login, user, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useSnackbar();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      const role = user.role;
      if (role === 'ADMIN') navigate('/admin', { replace: true });
      else if (role === 'LOGISTICS') navigate('/logistics', { replace: true });
      else navigate('/', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }

    setLoading(true);
    try {
      const loggedIn = await login(email.trim(), password);
      showSuccess('Login successful');

      const role = loggedIn?.role;
      if (role === 'ADMIN') navigate('/admin', { replace: true });
      else if (role === 'LOGISTICS') navigate('/logistics', { replace: true });
      else navigate('/', { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || 'Invalid email or password';
      setError(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        backgroundColor: 'background.default',
      }}
    >
      {/* ===== LEFT PANEL ===== */}
      {!isSmall && (
        <Box
          sx={{
            width: '45%',
            background: `linear-gradient(160deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 60%, ${theme.palette.primary.light} 100%)`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: 5,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background pattern */}
          <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {[...Array(5)].map((_, idx) => (
              <Box
                key={idx}
                sx={{
                  position: 'absolute',
                  borderRadius: '50%',
                  border: '1.5px solid rgba(255,255,255,0.1)',
                  width: 120 + idx * 90,
                  height: 120 + idx * 90,
                  bottom: -60 - idx * 45,
                  right: -60 - idx * 45,
                }}
              />
            ))}
          </Box>

          {/* Top brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, zIndex: 1 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <VolunteerActivismIcon sx={{ fontSize: 20, color: '#fff' }} />
            </Box>
            <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.01em' }}>
              CareConnect
            </Typography>
          </Box>

          {/* Center content */}
          <Box sx={{ zIndex: 1 }}>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                mb: 2,
              }}
            >
              Community · Compassion · Care
            </Typography>
            <Typography
              sx={{
                color: '#fff',
                fontWeight: 800,
                fontSize: '2.2rem',
                lineHeight: 1.2,
                mb: 2,
              }}
            >
              Give more.
              <br />
              Help more.
              <br />
              <span style={{ opacity: 0.7 }}>Together.</span>
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.75)',
                fontSize: '0.9rem',
                lineHeight: 1.7,
                maxWidth: 280,
              }}
            >
              Connect donors with those who need it most — food, clothes, and essentials delivered with care.
            </Typography>
          </Box>

          {/* Bottom stats row */}
          <Box sx={{ display: 'flex', gap: 4, zIndex: 1 }}>
            {[
              { num: '2k+', label: 'Donors' },
              { num: '8k+', label: 'Items shared' },
              { num: '50+', label: 'Cities' },
            ].map((s) => (
              <Box key={s.label}>
                <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1.3rem' }}>
                  {s.num}
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>
                  {s.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* ===== RIGHT PANEL ===== */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, sm: 5 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 400 }}>

          {/* Mobile brand */}
          {isSmall && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 4 }}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '10px',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <VolunteerActivismIcon sx={{ fontSize: 20, color: '#fff' }} />
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: '1.1rem' }}>CareConnect</Typography>
            </Box>
          )}

          <Typography
            sx={{
              fontWeight: 800,
              fontSize: '1.8rem',
              color: 'text.primary',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              mb: 0.8,
            }}
          >
            Welcome back
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.88rem', mb: 4 }}>
            Sign in to continue to your account
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3, borderRadius: '10px', fontSize: '0.83rem' }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <Box sx={{ mb: 2.5 }}>
              <Typography
                sx={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'text.primary',
                  mb: 0.8,
                  letterSpacing: '0.03em',
                }}
              >
                Email address
              </Typography>
              <TextField
                fullWidth
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    fontSize: '0.92rem',
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : '#f8fafc',
                    '& fieldset': { borderColor: theme.palette.divider },
                    '&:hover fieldset': { borderColor: theme.palette.primary.main },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                      borderWidth: '2px',
                    },
                  },
                }}
              />
            </Box>

            {/* Password */}
            <Box sx={{ mb: 3.5 }}>
              <Typography
                sx={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'text.primary',
                  mb: 0.8,
                  letterSpacing: '0.03em',
                }}
              >
                Password
              </Typography>
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                        sx={{ color: 'text.secondary', mr: 0.2 }}
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    fontSize: '0.92rem',
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : '#f8fafc',
                    '& fieldset': { borderColor: theme.palette.divider },
                    '&:hover fieldset': { borderColor: theme.palette.primary.main },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                      borderWidth: '2px',
                    },
                  },
                }}
              />
            </Box>

            {/* Submit */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.55,
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.95rem',
                textTransform: 'none',
                letterSpacing: '0.01em',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                boxShadow: `0 4px 16px ${theme.palette.primary.main}40`,
                mb: 3,
                '&:hover': {
                  boxShadow: `0 6px 22px ${theme.palette.primary.main}55`,
                  transform: 'translateY(-1px)',
                  transition: 'all 0.18s ease',
                },
                '&:active': { transform: 'translateY(0)' },
                '&:disabled': { opacity: 0.55, transform: 'none' },
              }}
            >
              {loading ? 'Signing in…' : 'Sign in →'}
            </Button>

            {/* Divider */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
              <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled', whiteSpace: 'nowrap' }}>
                New to CareConnect?
              </Typography>
              <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
            </Box>

            {/* Sign up */}
            <Button
              component={Link}
              to="/signup"
              fullWidth
              variant="outlined"
              size="large"
              sx={{
                py: 1.4,
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.92rem',
                textTransform: 'none',
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: `${theme.palette.primary.main}0a`,
                  borderColor: theme.palette.primary.dark,
                },
              }}
            >
              Create an account
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}