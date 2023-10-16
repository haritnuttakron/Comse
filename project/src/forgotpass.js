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
import { useEffect } from 'react';

function Forgotpass() {
  const [timerCount, setTimer] = React.useState(60);
  const [disable, setDisable] = useState(true);
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const handleChange = (event) => {
  const name = event.target.name;
  const value = event.target.value;
  setInputs(values => ({...values, [name]: value}))
  }

  useEffect(() => {
    const email = sessionStorage.recovery
    if(!email)
    {
      MySwal.fire({
        html: <i>'session expired'</i>,
        icon: 'error'
      }).then((value) => {
          navigate('/')
        })
    }
  },[])
  const resendOTP = () => {
    if (disable) return;
    var email = sessionStorage.getItem("recovery");
    var jsonData = {
      email: email
    }
    fetch("http://localhost:5000/sentotp", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData),
      })
        .then(response => response.json())
        .then(data => {
          if (data.status === 'ok') {
            MySwal.fire({
              html: <i>{'A new OTP has succesfully been sent to your email.'}</i>,
              icon: 'success'
            })
          } else {
            MySwal.fire({
              html: <i>{data.message}</i>,
              icon: 'error'
            })
          }
        })
        .then(() => setTimer(60))
        .catch(error => console.log('error', error));
  }

  const verfiyOTP = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const otp = data.get('otp');
    const jsonData = {
        otp: otp,
        email:sessionStorage.recovery
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
            localStorage.setItem('token',data.token)
            MySwal.fire({
              html: <i>{data.message}</i>,
              icon: 'success' 
            })
        .then(navigate('/resetpass'))
          } else {
            MySwal.fire({
              html: <i>{data.message}</i>,
              icon: 'error'
            })
          }
        })
        .catch(error => console.log('error', error));
  }
  React.useEffect(() => {
    let interval = setInterval(() => {
      setTimer((lastTimerCount) => {
        lastTimerCount <= 1 && clearInterval(interval);
        if (lastTimerCount <= 1) setDisable(false);
        if (lastTimerCount <= 0) return lastTimerCount;
        return lastTimerCount - 1;
      });
    }, 1000); //each count lasts for a second
    //cleanup the interval on complete
    return () => clearInterval(interval);
  }, [disable]);
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
      We have sent a code to your email {sessionStorage.recovery}
      </Typography>
      <Box component="form" noValidate onSubmit={verfiyOTP} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                required
                fullWidth
                id="otp"
                label="otp"
                name="otp"
                value={inputs.otp || ""} 
                onChange={handleChange}
                />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={resendOTP}
              >
                Confirm Otp
              </Button>
            </Grid>
        </Grid>
        <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                    <p>Didn't recieve code?</p>{" "}
                    <a
                      className="flex flex-row items-center"
                      style={{
                        color: disable ? "gray" : "blue",
                        cursor: disable ? "none" : "pointer",
                        textDecorationLine: disable ? "none" : "underline",
                      }}
                      onClick={() => resendOTP()}
                    >
                      {disable ? `Resend OTP in ${timerCount}s` : "Resend OTP"}
                    </a>
                  </div>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link href="/" variant="body2">
              Remember? Login
            </Link>

          </Grid>
        </Grid>
      </Box>
    </Box>
  </Container>
</div>
)
}

export default Forgotpass