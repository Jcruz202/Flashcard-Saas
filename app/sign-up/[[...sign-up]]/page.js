import { SignIn, SignUp } from "@clerk/nextjs";
import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import Link from "next/link";


export default function SignUpPage(){
    return(
    <Container maxWidth="100vw" disableGutters>
        <AppBar position="static" sx={{backgroundColor: "#588157"}}>
            <Toolbar>
                <Typography variant="h6" sx={{flexGrow: 1}}>Study Buddy</Typography>
                <Button variant="outlined" color="inherit" sx={{mr: 1}}>
                    <Link href="/sign-in" passHref>
                        Login
                    </Link>
                </Button>
                <Button variant="outlined" color="inherit">
                    <Link href="/sign-up" passHref>
                        Sign Up
                    </Link>
                </Button>
            </Toolbar>
        </AppBar>

        <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{mt:3, mb:3}}
        >
            <Typography variant="h4">Sign Up</Typography>
            <SignUp />
        </Box>
    </Container>
    )
}