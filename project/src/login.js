import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Login() {
    const navigate = useNavigate();
    const MySwal = withReactContent(Swal);
    const [inputs, setInputs] = useState({});
    const [loginAttempts, setLoginAttempts] = useState(0);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}))
  }

  const handleSubmit = (event) => {
    event.preventDefault();
      const data = new FormData(event.currentTarget);
      const email= data.get('email');
      const password = data.get('password');
      
      if (!email || !password) {
        MySwal.fire({
          html: <i>Please provide both email and password</i>,
          icon: 'error'
        });
        return;
      }
         
      const jsonData = {
          email: email,
          password: password
      }
      fetch("http://localhost:5000/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),//{ email:เมลที่กรอกไป,iat: เวลาสร้าง }
      })
        .then(response => response.json())
        .then(data => {
          if (data.status === 'ok') {
            //var token = jwt.sign({ email: users[0].email }, secret);
            localStorage.setItem('token',data.token)
            MySwal.fire({
              html: <i>{data.message}</i>,
              icon: 'success'
            }).then((value) => {
              navigate('/profile')
            })
          } else {
            MySwal.fire({
              html: <i>{data.message}</i>,
              icon: 'error'
            })
  
          }
        })
        .catch(error => console.log('error', error));
      console.log(inputs);
    }
  return (
    <div>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={inputs.email || ""}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={inputs.password || ""}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Grid container>            
              <Grid item>
                <Link href="/forgot" variant="body2">
                  {"forgot password?"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
  </div>
  )
}

export default Login