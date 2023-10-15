import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

function Forgotpass() {
    const [inputs, setInputs] = useState({});
    const [toggle, settoggle] = useState(false);
    const navigate = useNavigate();
    const MySwal = withReactContent(Swal);

    const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}))
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const jsonData = {
        email: email
      };
    fetch("http://localhost:5000/sentotp", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      })
        .then(response => response.json())
        .then(data => {
          if (data.status === 'ok') {
            settoggle(true)
            MySwal.fire({
              html: <i>{data.message}</i>,
              icon: 'success'
            })
          } else {
            MySwal.fire({
              html: <i>{data.message}</i>,
              icon: 'error'
            }).then((value) => {
              localStorage.removeItem('token');
              navigate('/')
            })
          }
        })
        .catch(error => console.log('error', error));
  }
  const handleSubmitOTP = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const otp = data.get('otp');
    const email = data.get('email');
    const jsonData = {
        otp: otp,
        email: email
      };
    fetch("http://localhost:5000/confirmotp", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      })
        .then(response => response.json())
        .then(data => {
          if (data.status === 'ok') {
            MySwal.fire({
              html: <i>{data.message}</i>,
              icon: 'success'
            })
          } else {
            MySwal.fire({
              html: <i>{data.message}</i>,
              icon: 'error'
            })
          }
        })
        .catch(error => console.log('error', error));
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
          Forgotpass
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
                    value={inputs.email || ""} 
                    onChange={handleChange}
                    />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    ส่ง Otp
                  </Button>
                </Grid>
            </Grid>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  Remember? Login
                </Link>
              </Grid>
            </Grid>
          </Box>
          {toggle &&(<Box component="form" noValidate onSubmit={handleSubmitOTP} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                    required
                    fullWidth
                    id="otp"
                    label="OTP"
                    name="otp"
                    value={inputs.otp || ""} 
                    onChange={handleChange}
                    />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Confirm OTP
                  </Button>
                </Grid>
            </Grid>
          </Box>
          )}
        </Box>
      </Container>
    </div>
  )
}

export default Forgotpass